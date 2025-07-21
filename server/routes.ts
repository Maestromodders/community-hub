import express, { type Express, type Request } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { sendVerificationEmail, sendPasswordResetEmail, sendFeedbackNotification } from "./services/email";
import { uploadMultiple, uploadProfilePicture } from "./services/upload";
import { insertUserSchema, insertPostSchema, insertCommentSchema, insertServerSchema, insertFeedbackSchema, type User } from "@shared/schema";
import path from "path";

// Extend Request to include user property
interface AuthenticatedRequest extends Request {
  user: User;
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const ADMIN_EMAIL = "fsocietycipherrevolt@gmail.com";
const ADMIN_PASSWORD = "Admin12??";

// Middleware to verify JWT token
const authenticateToken = async (req: AuthenticatedRequest, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUser(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Generate random 6-digit code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve uploaded files with proper CORS and caching
  app.use('/uploads', (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // 24 hours
    next();
  });
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'), {
    maxAge: '1d',
    etag: false
  }));

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Generate verification code
      const verificationCode = generateVerificationCode();

      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        verificationCode,
        isVerified: false
      });

      // Send verification email
      await sendVerificationEmail(user.email, verificationCode, user.name);

      res.status(201).json({ 
        message: "Registration successful. Please check your email for verification code.",
        email: user.email 
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/verify-email", async (req, res) => {
    try {
      const { email, code } = req.body;
      
      const success = await storage.verifyUser(email, code);
      if (success) {
        res.json({ message: "Email verified successfully" });
      } else {
        res.status(400).json({ message: "Invalid verification code" });
      }
    } catch (error) {
      console.error("Verification error:", error);
      res.status(400).json({ message: "Verification failed" });
    }
  });

  app.post("/api/auth/resend-code", async (req, res) => {
    try {
      const { email } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.isVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      const verificationCode = generateVerificationCode();
      await storage.updateUser(user.id, { verificationCode });
      await sendVerificationEmail(user.email, verificationCode, user.name);

      res.json({ message: "Verification code resent" });
    } catch (error) {
      console.error("Resend code error:", error);
      res.status(400).json({ message: "Failed to resend code" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check for admin login
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Check if admin user exists, create if not
        let adminUser = await storage.getUserByEmail(ADMIN_EMAIL);
        if (!adminUser) {
          const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
          adminUser = await storage.createUser({
            name: "John Reese",
            email: ADMIN_EMAIL,
            password: hashedPassword,
            country: "US",
            isVerified: true,
            isAdmin: true
          });
        }

        const token = jwt.sign({ userId: adminUser.id }, JWT_SECRET);
        res.json({ 
          token, 
          user: { 
            id: adminUser.id, 
            name: adminUser.name, 
            email: adminUser.email, 
            country: adminUser.country,
            profilePicture: adminUser.profilePicture,
            isAdmin: adminUser.isAdmin,
            isVerified: adminUser.isVerified 
          } 
        });
        return;
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isVerified) {
        return res.status(401).json({ message: "Please verify your email first" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET);
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          country: user.country,
          profilePicture: user.profilePicture,
          isAdmin: user.isAdmin,
          isVerified: user.isVerified 
        } 
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetToken = generateVerificationCode();
      await storage.updateUser(user.id, { resetToken });
      await sendPasswordResetEmail(user.email, resetToken, user.name);

      res.json({ message: "Password reset code sent to your email" });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(400).json({ message: "Failed to process request" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { email, code, newPassword } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.resetToken !== code) {
        return res.status(400).json({ message: "Invalid reset code" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(user.id, { 
        password: hashedPassword, 
        resetToken: null 
      });

      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(400).json({ message: "Failed to reset password" });
    }
  });

  // User routes
  app.get("/api/user/profile", authenticateToken, async (req, res) => {
    res.json(req.user);
  });

  app.put("/api/user/profile", authenticateToken, async (req, res) => {
    try {
      const { name, country } = req.body;
      const updatedUser = await storage.updateUser(req.user.id, { name, country });
      res.json(updatedUser);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(400).json({ message: "Failed to update profile" });
    }
  });

  app.post("/api/user/upload-profile-picture", authenticateToken, (req, res) => {
    uploadProfilePicture(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      try {
        const profilePictureUrl = `/uploads/profile-pictures/${req.file.filename}`;
        const updatedUser = await storage.updateUser(req.user.id, { 
          profilePicture: profilePictureUrl 
        });
        res.json({ 
          profilePicture: profilePictureUrl,
          user: {
            id: updatedUser?.id,
            name: updatedUser?.name,
            email: updatedUser?.email,
            country: updatedUser?.country,
            profilePicture: updatedUser?.profilePicture,
            isAdmin: updatedUser?.isAdmin,
            isVerified: updatedUser?.isVerified
          }
        });
      } catch (error) {
        console.error("Upload profile picture error:", error);
        res.status(400).json({ message: "Failed to update profile picture" });
      }
    });
  });

  app.post("/api/user/change-password", authenticateToken, async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      
      const isValidPassword = await bcrypt.compare(currentPassword, req.user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(req.user.id, { password: hashedPassword });

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(400).json({ message: "Failed to change password" });
    }
  });

  app.delete("/api/user/account", authenticateToken, async (req, res) => {
    try {
      await storage.deleteUser(req.user.id);
      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Delete account error:", error);
      res.status(400).json({ message: "Failed to delete account" });
    }
  });

  // Posts routes
  app.get("/api/posts", authenticateToken, async (req, res) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = 20;
      const offset = (page - 1) * limit;
      
      const posts = await storage.getPosts(limit, offset);
      res.json(posts);
    } catch (error) {
      console.error("Get posts error:", error);
      res.status(400).json({ message: "Failed to fetch posts" });
    }
  });

  app.post("/api/posts", authenticateToken, (req, res) => {
    uploadMultiple(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }

      try {
        const { content, isAnonymous } = req.body;
        
        const postData = insertPostSchema.parse({
          userId: req.user.id,
          content,
          isAnonymous: isAnonymous === 'true'
        });

        const post = await storage.createPost(postData);

        // Handle file uploads
        if (req.files && Array.isArray(req.files)) {
          for (const file of req.files) {
            await storage.addPostFile({
              postId: post.id,
              filename: file.filename,
              originalName: file.originalname,
              mimeType: file.mimetype,
              size: file.size,
              url: `/uploads/posts/${file.filename}`
            });
          }
        }

        const fullPost = await storage.getPost(post.id);
        res.status(201).json(fullPost);
      } catch (error) {
        console.error("Create post error:", error);
        res.status(400).json({ message: "Failed to create post" });
      }
    });
  });

  app.delete("/api/posts/:id", authenticateToken, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if user owns the post or is admin
      if (post.userId !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      await storage.deletePost(postId);
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Delete post error:", error);
      res.status(400).json({ message: "Failed to delete post" });
    }
  });

  // Reactions routes
  app.post("/api/posts/:id/react", authenticateToken, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const { type } = req.body;
      
      const reaction = await storage.addReaction({
        postId,
        userId: req.user.id,
        type
      });

      res.json(reaction);
    } catch (error) {
      console.error("Add reaction error:", error);
      res.status(400).json({ message: "Failed to add reaction" });
    }
  });

  app.delete("/api/posts/:id/react/:type", authenticateToken, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const { type } = req.params;
      
      await storage.removeReaction(postId, req.user.id, type);
      res.json({ message: "Reaction removed" });
    } catch (error) {
      console.error("Remove reaction error:", error);
      res.status(400).json({ message: "Failed to remove reaction" });
    }
  });

  // Comments routes
  app.post("/api/posts/:id/comments", authenticateToken, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const { content } = req.body;
      
      const commentData = insertCommentSchema.parse({
        postId,
        userId: req.user.id,
        content
      });

      const comment = await storage.addComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      console.error("Add comment error:", error);
      res.status(400).json({ message: "Failed to add comment" });
    }
  });

  // Servers routes
  app.get("/api/servers", authenticateToken, async (req, res) => {
    try {
      const servers = await storage.getServers();
      res.json(servers);
    } catch (error) {
      console.error("Get servers error:", error);
      res.status(400).json({ message: "Failed to fetch servers" });
    }
  });

  app.post("/api/servers/generate", authenticateToken, async (req, res) => {
    try {
      const servers = await storage.getServers();
      if (servers.length === 0) {
        return res.status(404).json({ message: "No servers available" });
      }

      // Get random server
      const randomServer = servers[Math.floor(Math.random() * servers.length)];
      const server = await storage.generateUserServer(req.user.id, randomServer.id);
      
      if (server) {
        res.json(server);
      } else {
        res.status(404).json({ message: "Server not available" });
      }
    } catch (error) {
      console.error("Generate server error:", error);
      res.status(400).json({ message: "Failed to generate server" });
    }
  });

  app.get("/api/user/servers", authenticateToken, async (req, res) => {
    try {
      const servers = await storage.getUserServers(req.user.id);
      res.json(servers);
    } catch (error) {
      console.error("Get user servers error:", error);
      res.status(400).json({ message: "Failed to fetch user servers" });
    }
  });

  // Admin routes
  app.post("/api/admin/servers", authenticateToken, async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const serverData = insertServerSchema.parse({
        ...req.body,
        createdById: req.user.id
      });

      const server = await storage.createServer(serverData);
      res.status(201).json(server);
    } catch (error) {
      console.error("Create server error:", error);
      res.status(400).json({ message: "Failed to create server" });
    }
  });

  app.get("/api/admin/users", authenticateToken, async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      res.status(400).json({ message: "Failed to fetch users" });
    }
  });

  app.delete("/api/admin/users/:id", authenticateToken, async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const userId = parseInt(req.params.id);
      await storage.deleteUser(userId);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(400).json({ message: "Failed to delete user" });
    }
  });

  app.patch("/api/admin/users/:id/toggle-admin", authenticateToken, async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const userId = parseInt(req.params.id);
      const targetUser = await storage.getUser(userId);
      
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      // Prevent demoting the owner creator admin
      if (targetUser.email === ADMIN_EMAIL && targetUser.isAdmin) {
        return res.status(403).json({ message: "Cannot modify owner admin status" });
      }

      // Toggle admin status
      const newAdminStatus = !targetUser.isAdmin;
      await storage.updateUser(userId, { isAdmin: newAdminStatus });

      const updatedUser = await storage.getUser(userId);
      res.json({ 
        message: `User ${newAdminStatus ? 'promoted to' : 'demoted from'} admin successfully`,
        user: updatedUser
      });
    } catch (error) {
      console.error("Toggle admin error:", error);
      res.status(400).json({ message: "Failed to update admin status" });
    }
  });

  app.delete("/api/admin/servers/:id", authenticateToken, async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const serverId = parseInt(req.params.id);
      await storage.deleteServer(serverId);
      res.json({ message: "Server deleted successfully" });
    } catch (error) {
      console.error("Delete server error:", error);
      res.status(400).json({ message: "Failed to delete server" });
    }
  });

  app.get("/api/admin/feedback", authenticateToken, async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      const feedback = await storage.getAllFeedback();
      res.json(feedback);
    } catch (error) {
      console.error("Get feedback error:", error);
      res.status(400).json({ message: "Failed to fetch feedback" });
    }
  });

  // Feedback routes
  app.post("/api/feedback", authenticateToken, async (req, res) => {
    try {
      const feedbackData = insertFeedbackSchema.parse({
        userId: req.user.id,
        ...req.body
      });

      const feedback = await storage.createFeedback(feedbackData);
      
      // Send email notification to admin
      await sendFeedbackNotification(
        req.user.email, 
        req.user.name, 
        feedback.rating, 
        feedback.message
      );

      res.status(201).json(feedback);
    } catch (error) {
      console.error("Create feedback error:", error);
      res.status(400).json({ message: "Failed to submit feedback" });
    }
  });

  app.get("/api/feedback", async (req, res) => {
    try {
      const feedback = await storage.getPublicFeedback();
      res.json(feedback);
    } catch (error) {
      console.error("Get public feedback error:", error);
      res.status(400).json({ message: "Failed to fetch feedback" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('New WebSocket connection');

    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        
        // Handle different types of real-time updates
        switch (data.type) {
          case 'join_room':
            // Join a specific room (e.g., post comments)
            ws.send(JSON.stringify({ type: 'joined_room', room: data.room }));
            break;
          
          case 'new_comment':
            // Broadcast new comment to all connected clients
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'comment_added',
                  postId: data.postId,
                  comment: data.comment
                }));
              }
            });
            break;

          case 'new_reaction':
            // Broadcast new reaction
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'reaction_added',
                  postId: data.postId,
                  reaction: data.reaction
                }));
              }
            });
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  return httpServer;
}

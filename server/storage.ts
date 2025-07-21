import { 
  users, posts, postFiles, postReactions, comments, servers, userServers, feedback,
  type User, type InsertUser, type Post, type InsertPost, type PostFile, 
  type PostReaction, type Comment, type InsertComment, type Server, 
  type InsertServer, type Feedback, type InsertFeedback
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  verifyUser(email: string, code: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<boolean>;

  // Posts
  getPosts(limit?: number, offset?: number): Promise<(Post & { user: User; files: PostFile[]; reactions: PostReaction[]; comments: (Comment & { user: User })[] })[]>;
  getPost(id: number): Promise<(Post & { user: User; files: PostFile[]; reactions: PostReaction[]; comments: (Comment & { user: User })[] }) | undefined>;
  createPost(post: InsertPost): Promise<Post>;
  updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  getUserPosts(userId: number): Promise<Post[]>;

  // Post Files
  addPostFile(file: Omit<PostFile, "id" | "createdAt">): Promise<PostFile>;
  getPostFiles(postId: number): Promise<PostFile[]>;

  // Reactions
  addReaction(reaction: Omit<PostReaction, "id" | "createdAt">): Promise<PostReaction>;
  removeReaction(postId: number, userId: number, type: string): Promise<boolean>;
  getPostReactions(postId: number): Promise<PostReaction[]>;

  // Comments
  addComment(comment: InsertComment): Promise<Comment>;
  getPostComments(postId: number): Promise<(Comment & { user: User })[]>;
  deleteComment(id: number): Promise<boolean>;

  // Servers
  getServers(): Promise<Server[]>;
  createServer(server: InsertServer): Promise<Server>;
  deleteServer(id: number): Promise<boolean>;
  generateUserServer(userId: number, serverId: number): Promise<Server | undefined>;
  getUserServers(userId: number): Promise<(Server & { generatedAt: Date })[]>;

  // Feedback
  createFeedback(feedback: InsertFeedback): Promise<Feedback>;
  getPublicFeedback(): Promise<(Feedback & { user: User })[]>;
  getAllFeedback(): Promise<(Feedback & { user: User })[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async verifyUser(email: string, code: string): Promise<boolean> {
    const [user] = await db.select().from(users).where(
      and(eq(users.email, email), eq(users.verificationCode, code))
    );
    
    if (user) {
      await db.update(users).set({ 
        isVerified: true, 
        verificationCode: null 
      }).where(eq(users.id, user.id));
      return true;
    }
    return false;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      // Delete user and cascade will handle related records
      const result = await db.delete(users).where(eq(users.id, id));
      return (result.rowCount ?? 0) > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Posts
  async getPosts(limit = 20, offset = 0): Promise<(Post & { user: User; files: PostFile[]; reactions: PostReaction[]; comments: (Comment & { user: User })[] })[]> {
    const postsData = await db.query.posts.findMany({
      with: {
        user: true,
        files: true,
        reactions: true,
        comments: {
          with: {
            user: true
          }
        }
      },
      orderBy: [desc(posts.createdAt)],
      limit,
      offset
    });
    return postsData as (Post & { user: User; files: PostFile[]; reactions: PostReaction[]; comments: (Comment & { user: User })[] })[];
  }

  async getPost(id: number): Promise<(Post & { user: User; files: PostFile[]; reactions: PostReaction[]; comments: (Comment & { user: User })[] }) | undefined> {
    const postData = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        user: true,
        files: true,
        reactions: true,
        comments: {
          with: {
            user: true
          }
        }
      }
    });
    return postData as (Post & { user: User; files: PostFile[]; reactions: PostReaction[]; comments: (Comment & { user: User })[] }) | undefined;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async updatePost(id: number, updates: Partial<Post>): Promise<Post | undefined> {
    const [post] = await db.update(posts).set(updates).where(eq(posts.id, id)).returning();
    return post || undefined;
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getUserPosts(userId: number): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.userId, userId)).orderBy(desc(posts.createdAt));
  }

  // Post Files
  async addPostFile(file: Omit<PostFile, "id" | "createdAt">): Promise<PostFile> {
    const [newFile] = await db.insert(postFiles).values(file).returning();
    return newFile;
  }

  async getPostFiles(postId: number): Promise<PostFile[]> {
    return await db.select().from(postFiles).where(eq(postFiles.postId, postId));
  }

  // Reactions
  async addReaction(reaction: Omit<PostReaction, "id" | "createdAt">): Promise<PostReaction> {
    // Remove existing reaction of same type from same user
    await db.delete(postReactions).where(
      and(
        eq(postReactions.postId, reaction.postId!),
        eq(postReactions.userId, reaction.userId!),
        eq(postReactions.type, reaction.type)
      )
    );
    
    const [newReaction] = await db.insert(postReactions).values(reaction).returning();
    return newReaction;
  }

  async removeReaction(postId: number, userId: number, type: string): Promise<boolean> {
    const result = await db.delete(postReactions).where(
      and(
        eq(postReactions.postId, postId),
        eq(postReactions.userId, userId),
        eq(postReactions.type, type)
      )
    );
    return (result.rowCount ?? 0) > 0;
  }

  async getPostReactions(postId: number): Promise<PostReaction[]> {
    return await db.select().from(postReactions).where(eq(postReactions.postId, postId));
  }

  // Comments
  async addComment(comment: InsertComment): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async getPostComments(postId: number): Promise<(Comment & { user: User })[]> {
    const commentsData = await db.query.comments.findMany({
      where: eq(comments.postId, postId),
      with: {
        user: true
      },
      orderBy: [desc(comments.createdAt)]
    });
    return commentsData as (Comment & { user: User })[];
  }

  async deleteComment(id: number): Promise<boolean> {
    const result = await db.delete(comments).where(eq(comments.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  // Servers
  async getServers(): Promise<Server[]> {
    return await db.select().from(servers).where(eq(servers.isActive, true)).orderBy(desc(servers.createdAt));
  }

  async createServer(server: InsertServer): Promise<Server> {
    const [newServer] = await db.insert(servers).values(server).returning();
    return newServer;
  }

  async deleteServer(id: number): Promise<boolean> {
    const result = await db.update(servers).set({ isActive: false }).where(eq(servers.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async generateUserServer(userId: number, serverId: number): Promise<Server | undefined> {
    // Check if server exists and is active
    const [server] = await db.select().from(servers).where(
      and(eq(servers.id, serverId), eq(servers.isActive, true))
    );
    
    if (server) {
      // Record the generation
      await db.insert(userServers).values({
        userId,
        serverId
      });
      return server;
    }
    return undefined;
  }

  async getUserServers(userId: number): Promise<(Server & { generatedAt: Date })[]> {
    const userServerData = await db.query.userServers.findMany({
      where: eq(userServers.userId, userId),
      with: {
        server: true
      },
      orderBy: [desc(userServers.generatedAt)]
    });
    
    return userServerData.map(us => ({
      ...us.server!,
      generatedAt: us.generatedAt!
    })) as (Server & { generatedAt: Date })[];
  }

  // Feedback
  async createFeedback(feedbackData: InsertFeedback): Promise<Feedback> {
    const [newFeedback] = await db.insert(feedback).values(feedbackData).returning();
    return newFeedback;
  }

  async getPublicFeedback(): Promise<(Feedback & { user: User })[]> {
    const feedbackData = await db.query.feedback.findMany({
      where: eq(feedback.isPublic, true),
      with: {
        user: true
      },
      orderBy: [desc(feedback.createdAt)]
    });
    return feedbackData as (Feedback & { user: User })[];
  }

  async getAllFeedback(): Promise<(Feedback & { user: User })[]> {
    const feedbackData = await db.query.feedback.findMany({
      with: {
        user: true
      },
      orderBy: [desc(feedback.createdAt)]
    });
    return feedbackData as (Feedback & { user: User })[];
  }
}

export const storage = new DatabaseStorage();

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Server, 
  MessageSquare, 
  Star, 
  Plus, 
  Trash2, 
  Shield, 
  Eye,
  Ban,
  CheckCircle,
  XCircle
} from "lucide-react";

const serverSchema = z.object({
  name: z.string().min(2, "Server name must be at least 2 characters"),
  host: z.string().min(1, "Host is required"),
  port: z.number().min(1, "Port is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  type: z.enum(["ssh", "udp"]),
  location: z.string().min(1, "Location is required"),
});

type ServerForm = z.infer<typeof serverSchema>;

export default function AdminPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [createServerOpen, setCreateServerOpen] = useState(false);

  const serverForm = useForm<ServerForm>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      host: "",
      port: 22,
      username: "",
      password: "",
      type: "ssh",
      location: "",
    },
  });

  // Fetch admin data
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['/api/admin/users'],
    queryFn: () => fetch('/api/admin/users', { headers: getAuthHeaders() }).then(res => res.json()),
    enabled: user?.isAdmin,
  });

  const { data: servers, isLoading: serversLoading } = useQuery({
    queryKey: ['/api/servers'],
    queryFn: () => fetch('/api/servers', { headers: getAuthHeaders() }).then(res => res.json()),
    enabled: user?.isAdmin,
  });

  const { data: feedback, isLoading: feedbackLoading } = useQuery({
    queryKey: ['/api/admin/feedback'],
    queryFn: () => fetch('/api/admin/feedback', { headers: getAuthHeaders() }).then(res => res.json()),
    enabled: user?.isAdmin,
  });

  const { data: posts } = useQuery({
    queryKey: ['/api/posts'],
    queryFn: () => fetch('/api/posts', { headers: getAuthHeaders() }).then(res => res.json()),
    enabled: user?.isAdmin,
  });

  // Mutations
  const createServerMutation = useMutation({
    mutationFn: async (data: ServerForm) => {
      const response = await fetch('/api/admin/servers', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create server');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
      setCreateServerOpen(false);
      serverForm.reset();
      toast({
        title: "Success",
        description: "Server created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create server",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Success",
        description: "User deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  const toggleAdminMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/users/${userId}/toggle-admin`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update admin status');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "Success",
        description: data.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update admin status",
        variant: "destructive",
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Success",
        description: "Post deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
    },
  });

  const deleteServerMutation = useMutation({
    mutationFn: async (serverId: number) => {
      const response = await fetch(`/api/admin/servers/${serverId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete server');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/servers'] });
      toast({
        title: "Success",
        description: "Server deleted successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete server",
        variant: "destructive",
      });
    },
  });

  const handleCreateServer = (data: ServerForm) => {
    createServerMutation.mutate(data);
  };

  const handleDeleteUser = (userId: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleToggleAdmin = (userId: number, isCurrentlyAdmin: boolean, userEmail: string) => {
    // Prevent modifying owner creator admin
    if (userEmail === "fsocietycipherrevolt@gmail.com" && isCurrentlyAdmin) {
      toast({
        title: "Action Not Allowed",
        description: "Cannot modify owner admin status",
        variant: "destructive",
      });
      return;
    }

    const action = isCurrentlyAdmin ? "demote from admin" : "promote to admin";
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      toggleAdminMutation.mutate(userId);
    }
  };

  const handleDeletePost = (postId: number) => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate(postId);
    }
  };

  const handleDeleteServer = (serverId: number) => {
    if (confirm("Are you sure you want to delete this server?")) {
      deleteServerMutation.mutate(serverId);
    }
  };

  // Redirect if not admin
  if (!user?.isAdmin) {
    return (
      <DashboardLayout title="Access Denied">
        <div className="text-center py-12">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You need administrator privileges to access this page.</p>
        </div>
      </DashboardLayout>
    );
  }

  const stats = {
    totalUsers: users?.length || 0,
    verifiedUsers: users?.filter((u: any) => u.isVerified).length || 0,
    totalServers: servers?.length || 0,
    totalPosts: posts?.length || 0,
    totalFeedback: feedback?.length || 0,
    averageRating: feedback?.length ? 
      (feedback.reduce((sum: number, f: any) => sum + f.rating, 0) / feedback.length).toFixed(1) : 0
  };

  return (
    <DashboardLayout title="Admin Panel">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Manage users, content, and platform settings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Verified Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.verifiedUsers}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.averageRating}/10</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="servers">Servers</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading users...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users?.map((user: any) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={user.isVerified ? "default" : "destructive"}>
                            {user.isVerified ? "Verified" : "Unverified"}
                          </Badge>
                          {user.isAdmin && (
                            <Badge variant="secondary">Admin</Badge>
                          )}
                          <Button
                            variant={user.isAdmin ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleToggleAdmin(user.id, user.isAdmin, user.email)}
                            disabled={toggleAdminMutation.isPending}
                            className={user.isAdmin ? "text-orange-600 border-orange-600" : "bg-green-600 hover:bg-green-700"}
                          >
                            <Shield className="w-4 h-4 mr-1" />
                            {user.isAdmin ? "Remove Admin" : "Make Admin"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deleteUserMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Servers Tab */}
          <TabsContent value="servers">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Server className="w-5 h-5 mr-2" />
                    Server Management
                  </CardTitle>
                  <Dialog open={createServerOpen} onOpenChange={setCreateServerOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Server
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create New Server</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={serverForm.handleSubmit(handleCreateServer)} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Server Name</Label>
                          <Input
                            id="name"
                            placeholder="e.g., SSH Server #001"
                            {...serverForm.register("name")}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="host">Host</Label>
                          <Input
                            id="host"
                            placeholder="e.g., server.example.com"
                            {...serverForm.register("host")}
                          />
                        </div>

                        <div>
                          <Label htmlFor="port">Port</Label>
                          <Input
                            id="port"
                            type="number"
                            placeholder="22"
                            {...serverForm.register("port", { valueAsNumber: true })}
                          />
                        </div>

                        <div>
                          <Label htmlFor="username">Username</Label>
                          <Input
                            id="username"
                            placeholder="root"
                            {...serverForm.register("username")}
                          />
                        </div>

                        <div>
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            placeholder="password"
                            {...serverForm.register("password")}
                          />
                        </div>

                        <div>
                          <Label htmlFor="type">Type</Label>
                          <Select onValueChange={(value) => serverForm.setValue("type", value as "ssh" | "udp")}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select server type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ssh">SSH</SelectItem>
                              <SelectItem value="udp">UDP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input
                            id="location"
                            placeholder="e.g., United States"
                            {...serverForm.register("location")}
                          />
                        </div>

                        <div className="flex space-x-3">
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setCreateServerOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button 
                            type="submit" 
                            className="flex-1"
                            disabled={createServerMutation.isPending}
                          >
                            {createServerMutation.isPending ? "Creating..." : "Create"}
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {serversLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading servers...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {servers?.map((server: any) => (
                      <div key={server.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{server.name}</h3>
                          <Badge variant={server.isActive ? "default" : "destructive"}>
                            {server.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1 mb-3">
                          <p><strong>Host:</strong> {server.host}:{server.port}</p>
                          <p><strong>Type:</strong> {server.type.toUpperCase()}</p>
                          <p><strong>Location:</strong> {server.location}</p>
                        </div>
                        <div className="flex justify-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteServer(server.id)}
                            disabled={deleteServerMutation.isPending}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Posts Tab */}
          <TabsContent value="posts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Post Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {posts?.map((post: any) => (
                    <div key={post.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="font-medium text-gray-900">
                              {post.isAnonymous ? "Anonymous" : post.user?.name}
                            </p>
                            <span className="text-sm text-gray-500">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-800 mb-2">{post.content}</p>
                          {post.files?.length > 0 && (
                            <p className="text-sm text-gray-600">
                              {post.files.length} file(s) attached
                            </p>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Feedback Tab */}
          <TabsContent value="feedback">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Feedback Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                {feedbackLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-600 mt-2">Loading feedback...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feedback?.map((item: any) => (
                      <div key={item.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <p className="font-medium text-gray-900">{item.user?.name}</p>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="font-bold text-gray-900">{item.rating}</span>
                              <span className="text-gray-600">/10</span>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-800">{item.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

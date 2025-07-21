import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { websocketService } from "@/lib/websocket";
import { 
  Download, 
  MoreHorizontal, 
  MessageCircle, 
  Send,
  Trash2,
  Edit
} from "lucide-react";

interface PostCardProps {
  post: any;
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [showComments, setShowComments] = useState(false);

  const reactions = [
    { type: "like", emoji: "👍", label: "Like" },
    { type: "love", emoji: "❤️", label: "Love" }, 
    { type: "laugh", emoji: "😂", label: "Laugh" },
    { type: "cry", emoji: "😢", label: "Cry" },
  ];

  const addReactionMutation = useMutation({
    mutationFn: async (type: string) => {
      const response = await fetch(`/api/posts/${post.id}/react`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type }),
      });
      if (!response.ok) throw new Error('Failed to add reaction');
      return response.json();
    },
    onSuccess: (data, type) => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      websocketService.sendNewReaction(post.id, { type, user });
      toast({
        title: "Reaction added",
        description: `You reacted with ${reactions.find(r => r.type === type)?.emoji}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add reaction",
        variant: "destructive",
      });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error('Failed to add comment');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      websocketService.sendNewComment(post.id, { ...data, user });
      setComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been posted",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully",
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

  const handleReaction = (type: string) => {
    addReactionMutation.mutate(type);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      addCommentMutation.mutate(comment.trim());
    }
  };

  const handleDownload = (file: any) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeletePost = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      deletePostMutation.mutate();
    }
  };

  const getReactionCount = (type: string) => {
    return post.reactions?.filter((r: any) => r.type === type).length || 0;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canModifyPost = user && (user.id === post.userId || user.isAdmin);

  return (
    <Card className="overflow-hidden">
      {/* Post Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
              {post.user?.profilePicture ? (
                <img 
                  src={post.user.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error('Profile picture failed to load:', post.user.profilePicture);
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold">
                  {post.isAnonymous ? "?" : post.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {post.isAnonymous ? "Anonymous" : post.user?.name || "Unknown User"}
              </p>
              <p className="text-sm text-gray-600">{formatDate(post.createdAt)}</p>
            </div>
          </div>
          {canModifyPost && (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleDeletePost}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <CardContent className="p-6">
        <p className="text-gray-900 mb-4">{post.content}</p>

        {/* File Attachments */}
        {post.files && post.files.length > 0 && (
          <div className="space-y-3 mb-4">
            {post.files.map((file: any) => (
              <div key={file.id}>
                {file.mimeType?.startsWith('image/') ? (
                  <div className="mb-3">
                    <img 
                      src={file.url} 
                      alt={file.originalName}
                      className="max-w-full h-auto rounded-lg border"
                      onError={(e) => {
                        console.error('Image failed to load:', file.url);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <p className="text-sm text-gray-600 mt-2">{file.originalName}</p>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-file text-primary"></i>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{file.originalName}</p>
                        <p className="text-sm text-gray-600">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button 
                      size="sm"
                      onClick={() => handleDownload(file)}
                      className="bg-primary hover:bg-blue-700"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Reactions & Comments */}
      <div className="px-6 py-4 border-t border-gray-200">
        {/* Reactions */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {reactions.map((reaction) => {
              const count = getReactionCount(reaction.type);
              return (
                <Button
                  key={reaction.type}
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition duration-200"
                  onClick={() => handleReaction(reaction.type)}
                  disabled={addReactionMutation.isPending}
                >
                  <span className="text-lg hover:scale-110 transition-transform">
                    {reaction.emoji}
                  </span>
                  {count > 0 && <span className="text-sm">{count}</span>}
                </Button>
              );
            })}
          </div>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <button 
              onClick={() => setShowComments(!showComments)}
              className="hover:text-primary"
            >
              {post.comments?.length || 0} comments
            </button>
          </div>
        </div>

        {/* Comment Form */}
        <form onSubmit={handleComment} className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
            {user?.profilePicture ? (
              <img 
                src={user.profilePicture} 
                alt="Profile" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>
          <Input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="sm" 
            disabled={!comment.trim() || addCommentMutation.isPending}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        {/* Comments */}
        {showComments && post.comments && post.comments.length > 0 && (
          <div className="space-y-3 border-t border-gray-100 pt-4">
            {post.comments.map((comment: any) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                  {comment.user?.profilePicture ? (
                    <img 
                      src={comment.user.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-sm font-bold">
                      {comment.user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <p className="font-medium text-sm text-gray-900">{comment.user?.name || "Unknown User"}</p>
                    <p className="text-gray-800">{comment.content}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
                    <span>{formatDate(comment.createdAt)}</span>
                    <button className="hover:text-primary">Like</button>
                    <button className="hover:text-primary">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
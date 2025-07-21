import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { CreatePost } from "@/components/post/create-post";
import { PostCard } from "@/components/post/post-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

export default function PostHubPage() {
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ['/api/posts'],
    queryFn: () => fetch('/api/posts', { headers: getAuthHeaders() }).then(res => res.json()),
  });

  const createPostMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to create post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/posts'] });
      setCreatePostOpen(false);
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    },
  });

  const handleCreatePost = (formData: FormData) => {
    createPostMutation.mutate(formData);
  };

  return (
    <DashboardLayout title="Post Hub">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Post Hub</h1>
            <p className="text-gray-600">Share files, images, and content with the community</p>
          </div>
          <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <CreatePost 
                onSubmit={handleCreatePost}
                isLoading={createPostMutation.isPending}
                onClose={() => setCreatePostOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading posts...</p>
            </div>
          ) : posts && posts.length > 0 ? (
            posts.map((post: any) => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-4">Be the first to share something with the community!</p>
              <Button onClick={() => setCreatePostOpen(true)}>
                Create Your First Post
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

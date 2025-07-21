import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FileUpload } from "@/components/ui/file-upload";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Send, X } from "lucide-react";

const createPostSchema = z.object({
  content: z.string().min(1, "Post content is required").max(2000, "Content is too long"),
  isAnonymous: z.boolean().optional(),
});

type CreatePostForm = z.infer<typeof createPostSchema>;

interface CreatePostProps {
  onSubmit: (formData: FormData) => void;
  isLoading: boolean;
  onClose: () => void;
}

export function CreatePost({ onSubmit, isLoading, onClose }: CreatePostProps) {
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: "",
      isAnonymous: false,
    },
  });

  const handleSubmit = (data: CreatePostForm) => {
    const formData = new FormData();
    formData.append('content', data.content);
    formData.append('isAnonymous', data.isAnonymous ? 'true' : 'false');
    
    files.forEach((file, index) => {
      formData.append('files', file);
    });

    onSubmit(formData);
  };

  const handleFilesChange = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
  };

  return (
    <div>
      <DialogHeader className="mb-6">
        <div className="flex items-center justify-between">
          <DialogTitle>Create New Post</DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </DialogHeader>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="content">What's on your mind?</Label>
          <Textarea
            id="content"
            rows={4}
            placeholder="Share your thoughts, ask questions, or share something useful with the community..."
            {...form.register("content")}
            className="mt-2"
          />
          {form.formState.errors.content && (
            <p className="text-sm text-red-600 mt-1">
              {form.formState.errors.content.message}
            </p>
          )}
        </div>

        <div>
          <Label className="text-base font-medium mb-4 block">Upload Files (Optional)</Label>
          <FileUpload
            multiple
            maxSize={10}
            accept="*/*"
            onFilesChange={handleFilesChange}
            disabled={isLoading}
          />
          <p className="text-sm text-gray-600 mt-2">
            You can upload images, documents, videos, and any other files up to 10MB each
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="anonymous"
            {...form.register("isAnonymous")}
          />
          <Label htmlFor="anonymous" className="text-sm cursor-pointer">
            Post as Anonymous
          </Label>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            <Send className="w-4 h-4 mr-2" />
            {isLoading ? "Publishing..." : "Publish Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}

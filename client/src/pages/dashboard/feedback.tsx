import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Star, Send, MessageSquare } from "lucide-react";

const feedbackSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(10, "Rating cannot exceed 10"),
  message: z.string().min(10, "Feedback must be at least 10 characters"),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

export default function FeedbackPage() {
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      message: "",
    },
  });

  const { data: publicFeedback, isLoading } = useQuery({
    queryKey: ['/api/feedback'],
    queryFn: () => fetch('/api/feedback').then(res => res.json()),
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data: FeedbackForm) => {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to submit feedback');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/feedback'] });
      form.reset();
      setSelectedRating(0);
      toast({
        title: "Success",
        description: "Thank you for your feedback!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit feedback",
        variant: "destructive",
      });
    },
  });

  const handleRatingSelect = (rating: number) => {
    setSelectedRating(rating);
    form.setValue("rating", rating);
  };

  const onSubmit = (data: FeedbackForm) => {
    submitFeedbackMutation.mutate(data);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <DashboardLayout title="Feedback & Ratings">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Feedback & Ratings</h1>
          <p className="text-xl text-gray-600">Help us improve by sharing your experience</p>
        </div>

        {/* Submit Feedback Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="w-5 h-5 mr-2" />
              Submit Your Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label className="text-base font-medium">Rate Your Experience (1-10)</Label>
                <div className="flex items-center space-x-2 mt-3">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRatingSelect(rating)}
                      className={`w-10 h-10 rounded-full border-2 transition duration-200 flex items-center justify-center font-bold ${
                        rating <= selectedRating
                          ? 'bg-yellow-400 border-yellow-400 text-yellow-900'
                          : 'border-gray-300 text-gray-600 hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-600'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Selected rating: {selectedRating > 0 ? `${selectedRating}/10` : 'None'}
                </p>
                {form.formState.errors.rating && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.rating.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="message">Your Feedback</Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us about your experience..."
                  {...form.register("message")}
                  className="mt-2"
                />
                {form.formState.errors.message && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.message.message}
                  </p>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={submitFeedbackMutation.isPending}
                className="w-full sm:w-auto"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitFeedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Public Feedback Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2" />
              Community Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading feedback...</p>
              </div>
            ) : publicFeedback && publicFeedback.length > 0 ? (
              <div className="space-y-6">
                {publicFeedback.map((feedback: any, index: number) => (
                  <div key={feedback.id || index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold">
                          {feedback.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {feedback.user?.name || 'Anonymous'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(feedback.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        <span className="text-lg font-bold text-gray-900">{feedback.rating}</span>
                        <span className="text-gray-600">/10</span>
                      </div>
                    </div>
                    <p className="text-gray-800">{feedback.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No feedback yet</h3>
                <p className="text-gray-600">Be the first to share your experience!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics */}
        {publicFeedback && publicFeedback.length > 0 && (
          <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Feedback Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">{publicFeedback.length}</p>
                  <p className="text-blue-100">Total Reviews</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {(publicFeedback.reduce((sum: number, f: any) => sum + f.rating, 0) / publicFeedback.length).toFixed(1)}
                  </p>
                  <p className="text-blue-100">Average Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {Math.max(...publicFeedback.map((f: any) => f.rating))}
                  </p>
                  <p className="text-blue-100">Highest Rating</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">
                    {publicFeedback.filter((f: any) => f.rating >= 8).length}
                  </p>
                  <p className="text-blue-100">Happy Users</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

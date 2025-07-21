import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Smartphone, Send, MessageCircle, Star, Download, Shield } from "lucide-react";

const appRequestSchema = z.object({
  appName: z.string().min(2, "App name must be at least 2 characters"),
  details: z.string().optional(),
});

type AppRequestForm = z.infer<typeof appRequestSchema>;

export default function ModdedAppsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<AppRequestForm>({
    resolver: zodResolver(appRequestSchema),
    defaultValues: {
      appName: "",
      details: "",
    },
  });

  const popularApps = [
    {
      name: "Spotify Premium",
      description: "Ad-free music streaming with offline downloads",
      category: "Music",
      icon: "🎵",
    },
    {
      name: "Netflix Modded",
      description: "Watch premium content without subscription",
      category: "Entertainment",
      icon: "🎬",
    },
    {
      name: "WhatsApp Plus",
      description: "Enhanced WhatsApp with extra features",
      category: "Social",
      icon: "💬",
    },
    {
      name: "YouTube Vanced",
      description: "Ad-free YouTube with background play",
      category: "Video",
      icon: "📺",
    },
    {
      name: "Instagram Pro",
      description: "Download photos, videos, and stories",
      category: "Social",
      icon: "📷",
    },
    {
      name: "Adobe Creative Suite",
      description: "Full creative tools suite - Photoshop, Illustrator, etc.",
      category: "Design",
      icon: "🎨",
    },
  ];

  const onSubmit = async (data: AppRequestForm) => {
    setIsSubmitting(true);
    try {
      const message = data.details 
        ? `I want to request: ${data.appName}\n\nAdditional details: ${data.details}`
        : `I want to request: ${data.appName}`;
      
      const whatsappUrl = `https://wa.me/254745282166?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: "Request Sent",
        description: "Your app request has been sent to our admin via WhatsApp!",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePopularAppRequest = (appName: string) => {
    const message = `I want to request: ${appName}`;
    const whatsappUrl = `https://wa.me/254745282166?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <DashboardLayout title="Modded & Premium Apps">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Modded & Premium Apps
          </h1>
          <p className="text-xl text-gray-600">
            Request any app you need - we'll find it for you!
          </p>
        </div>

        {/* Request Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Send className="w-5 h-5 mr-2" />
              Request an App
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="appName">App Name *</Label>
                <Input
                  id="appName"
                  placeholder="e.g., Spotify Premium, Adobe Photoshop, etc."
                  {...form.register("appName")}
                  className="mt-2"
                />
                {form.formState.errors.appName && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.appName.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="details">Additional Details (Optional)</Label>
                <Textarea
                  id="details"
                  rows={3}
                  placeholder="Any specific version, features, or requirements..."
                  {...form.register("details")}
                  className="mt-2"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {isSubmitting ? "Sending..." : "Send Request via WhatsApp"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Popular Apps */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Requests</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularApps.map((app, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-4xl">{app.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{app.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{app.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {app.category}
                        </span>
                        <Button 
                          size="sm"
                          onClick={() => handlePopularAppRequest(app.name)}
                        >
                          Request
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-blue-900 mb-6 text-center">What We Offer</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Download className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-blue-900 mb-2">Any App</h4>
                <p className="text-blue-800 text-sm">Request any Android or Windows app - premium, modded, or cracked versions</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-blue-900 mb-2">Safe & Tested</h4>
                <p className="text-blue-800 text-sm">All apps are tested for malware and viruses before delivery</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-blue-900 mb-2">Fast Delivery</h4>
                <p className="text-blue-800 text-sm">Most apps delivered within 24 hours via WhatsApp</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-2">Important Notice</h3>
                <div className="text-yellow-800 text-sm space-y-2">
                  <p>• Apps are for educational and backup purposes only</p>
                  <p>• We recommend supporting developers by purchasing original apps</p>
                  <p>• Installation is at your own risk - create backups before installing</p>
                  <p>• Some apps may not work on all devices or Android versions</p>
                  <p>• We are not responsible for any issues arising from app usage</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

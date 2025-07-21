import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Bell, CheckCircle, XCircle } from "lucide-react";

export default function JoinCommunityPage() {
  const communityLinks = {
    channel: "https://whatsapp.com/channel/0029VbAU2P8IyPtLoJqv6G01",
    group: "https://chat.whatsapp.com/CXAImX59wSjL5mIjADSZZw"
  };

  const handleJoinChannel = () => {
    window.open(communityLinks.channel, '_blank');
  };

  const handleJoinGroup = () => {
    window.open(communityLinks.group, '_blank');
  };

  const guidelines = {
    dos: [
      { title: "Be Respectful", description: "Treat all members with respect and kindness" },
      { title: "Stay On Topic", description: "Keep discussions relevant to community interests" },
      { title: "Help Others", description: "Share knowledge and assist fellow members" },
    ],
    donts: [
      { title: "No Spam", description: "Avoid excessive promotional content" },
      { title: "No Illegal Content", description: "Sharing illegal content is strictly prohibited" },
      { title: "No Personal Attacks", description: "Harassment and personal attacks are not tolerated" },
    ]
  };

  return (
    <DashboardLayout title="Join Community">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Join Our Community</h1>
          <p className="text-xl text-gray-600">Connect with like-minded individuals and stay updated</p>
        </div>

        {/* Community Options */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* WhatsApp Channel */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-10 w-10 text-green-600" />
              </div>
              <CardTitle className="text-2xl">WhatsApp Channel</CardTitle>
              <p className="text-gray-600">
                Get the latest updates, announcements, and exclusive content directly to your WhatsApp.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>5,000+ Members</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mt-1">
                    <Bell className="h-4 w-4" />
                    <span>Daily Updates</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={handleJoinChannel}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Join Channel
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* WhatsApp Group */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">WhatsApp Group</CardTitle>
              <p className="text-gray-600">
                Join our active community discussions, share experiences, and get help from fellow members.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>2,500+ Members</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mt-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>Active Discussions</span>
                  </div>
                </div>
                <Button 
                  className="w-full"
                  onClick={handleJoinGroup}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join Group
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Community Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Do's */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-800 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  What We Encourage
                </h3>
                {guidelines.dos.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Don'ts */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-red-800 flex items-center">
                  <XCircle className="w-5 h-5 mr-2" />
                  What's Not Allowed
                </h3>
                {guidelines.donts.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Community Benefits</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-6 w-6" />
                </div>
                <h4 className="font-semibold mb-2">Instant Updates</h4>
                <p className="text-blue-100 text-sm">Get notified about new features, services, and important announcements</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6" />
                </div>
                <h4 className="font-semibold mb-2">Community Support</h4>
                <p className="text-blue-100 text-sm">Get help from experienced members and share your knowledge</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="h-6 w-6" />
                </div>
                <h4 className="font-semibold mb-2">Direct Access</h4>
                <p className="text-blue-100 text-sm">Direct communication with admins and priority support</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

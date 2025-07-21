import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Clock, ExternalLink } from "lucide-react";

export default function TalkHubPage() {
  const handleLearnMore = () => {
    window.open("https://example.com", '_blank');
  };

  return (
    <DashboardLayout title="Talk Hub">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Talk Hub - Private Messaging
          </h1>
          <p className="text-xl text-gray-600">
            Secure and private communication platform
          </p>
        </div>

        {/* Coming Soon Card */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-12 w-12 text-yellow-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon!</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our new private messaging feature is under development and will be available soon.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center space-x-2 text-yellow-800 mb-3">
                  <Clock className="h-5 w-5" />
                  <span className="font-semibold">Expected Features</span>
                </div>
                <ul className="text-yellow-700 space-y-2 text-left max-w-md mx-auto">
                  <li>• End-to-end encrypted messaging</li>
                  <li>• Group chat functionality</li>
                  <li>• File and media sharing</li>
                  <li>• Real-time notifications</li>
                  <li>• Voice and video calls</li>
                  <li>• Message history and search</li>
                </ul>
              </div>

              <Button 
                onClick={handleLearnMore}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Development Status */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Development Timeline</h3>
                <div className="text-blue-800 space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Phase 1: Core messaging system - In Progress</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span>Phase 2: Group chat and media sharing - Planned</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <span>Phase 3: Voice/video calls - Future release</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Newsletter Signup */}
        <Card className="bg-gradient-to-r from-primary to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
            <p className="text-blue-100 mb-6">
              Be the first to know when Talk Hub launches. We'll notify you via email and WhatsApp.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="secondary"
                onClick={() => window.open('https://wa.me/254745282166?text=I want to be notified when Talk Hub launches', '_blank')}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Notify Me via WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, User } from "lucide-react";

export default function ContactAdminPage() {
  const adminDetails = {
    name: "John Reese",
    email: "fsocietycipherrevolt@gmail.com",
    whatsapp: "+254745282166"
  };

  const handleWhatsAppContact = () => {
    window.open(`https://wa.me/254745282166`, '_blank');
  };

  const handleEmailContact = () => {
    window.open(`mailto:${adminDetails.email}`, '_blank');
  };

  return (
    <DashboardLayout title="Contact Admin">
      <div className="space-y-8">
        {/* Background Hero Section */}
        <div 
          className="relative rounded-xl overflow-hidden min-h-[400px]"
          style={{
            backgroundImage: "url('https://files.catbox.moe/45jhow.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
          <div className="relative z-10 flex items-center justify-center h-full p-8">
            <div className="text-center text-white max-w-md">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-12 w-12" />
              </div>
              <h1 className="text-4xl font-bold mb-4">Contact Administrator</h1>
              <p className="text-xl mb-8">Get in touch with our admin team</p>
              
              <Card className="bg-white bg-opacity-10 backdrop-blur-sm border-white border-opacity-20">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Admin Details</h2>
                  <div className="space-y-4 text-left">
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Name</p>
                        <p className="text-blue-100">{adminDetails.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-blue-100">{adminDetails.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="w-5 h-5" />
                      <div>
                        <p className="font-medium">WhatsApp</p>
                        <p className="text-blue-100">{adminDetails.whatsapp}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 space-y-3">
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleWhatsAppContact}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact via WhatsApp
                    </Button>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={handleEmailContact}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Additional Contact Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">WhatsApp Support</h3>
                  <p className="text-gray-600">Fast response time</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Get instant support through WhatsApp. Our admin team is available to help with any questions or issues.
              </p>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleWhatsAppContact}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Open WhatsApp
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email Support</h3>
                  <p className="text-gray-600">Detailed assistance</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                Send detailed inquiries or reports via email. Perfect for complex issues that need documentation.
              </p>
              <Button 
                variant="outline"
                className="w-full"
                onClick={handleEmailContact}
              >
                <Mail className="w-4 h-4 mr-2" />
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Support Hours */}
        <Card className="bg-gray-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Support Information</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Response Time</h4>
                <p className="text-gray-600 text-sm">WhatsApp: Within 1 hour</p>
                <p className="text-gray-600 text-sm">Email: Within 24 hours</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Support Hours</h4>
                <p className="text-gray-600 text-sm">24/7 Emergency Support</p>
                <p className="text-gray-600 text-sm">Regular hours: 8AM - 10PM EAT</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Languages</h4>
                <p className="text-gray-600 text-sm">English (Primary)</p>
                <p className="text-gray-600 text-sm">Swahili</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

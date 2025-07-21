import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, MessageCircle, Users, Download, Globe, Lock, Zap } from "lucide-react";

export default function VpnFilesPage() {
  const handleJoinGroup = () => {
    window.open("https://chat.whatsapp.com/CXAImX59wSjL5mIjADSZZw", '_blank');
  };

  const vpnFeatures = [
    {
      icon: Globe,
      title: "Global Servers",
      description: "Access VPN servers from multiple countries",
    },
    {
      icon: Lock,
      title: "Secure Encryption",
      description: "Military-grade encryption for your data",
    },
    {
      icon: Zap,
      title: "High Speed",
      description: "Fast and reliable connection speeds",
    },
    {
      icon: Shield,
      title: "No Logs Policy",
      description: "Your privacy is completely protected",
    },
  ];

  const vpnTypes = [
    {
      name: "OpenVPN",
      description: "Most compatible and secure VPN protocol",
      extension: ".ovpn",
      compatibility: ["Android", "Windows", "iOS", "Linux"],
    },
    {
      name: "IKEv2/IPSec",
      description: "Fast and stable, great for mobile devices", 
      extension: ".p12",
      compatibility: ["Android", "iOS", "Windows"],
    },
    {
      name: "WireGuard",
      description: "Modern, lightweight, and super fast",
      extension: ".conf",
      compatibility: ["Android", "Windows", "Linux"],
    },
    {
      name: "SSTP",
      description: "Works well behind firewalls and NAT",
      extension: ".pbk",
      compatibility: ["Windows", "Android"],
    },
  ];

  return (
    <DashboardLayout title="VPN Files">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">VPN Configuration Files</h1>
          <p className="text-xl text-gray-600">Access free VPN configurations for secure browsing</p>
        </div>

        {/* Main CTA */}
        <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Shield className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Access VPN Files</h2>
            <p className="text-green-100 mb-6 text-lg">
              Get the latest VPN configuration files by joining our dedicated WhatsApp group.
            </p>
            <Button 
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100"
              onClick={handleJoinGroup}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Join VPN Group
            </Button>
          </CardContent>
        </Card>

        {/* VPN Features */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Use Our VPN Files?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vpnFeatures.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* VPN Types */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available VPN Types</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {vpnTypes.map((vpn, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{vpn.name}</CardTitle>
                    <Badge variant="secondary">{vpn.extension}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{vpn.description}</p>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-2">Compatible with:</p>
                    <div className="flex flex-wrap gap-2">
                      {vpn.compatibility.map((platform, platformIndex) => (
                        <Badge key={platformIndex} variant="outline">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Group Info */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-900 mb-4">VPN Group Benefits</h3>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Regular Updates</h4>
                  <p className="text-blue-800 text-sm">New VPN configurations shared daily</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Multiple Protocols</h4>
                  <p className="text-blue-800 text-sm">OpenVPN, IKEv2, WireGuard, and more</p>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">24/7 Support</h4>
                  <p className="text-blue-800 text-sm">Get help with setup and troubleshooting</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2" />
              How to Use VPN Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Join the Group</h4>
                  <p className="text-gray-600 text-sm">Click the button above to join our WhatsApp VPN group</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Download Files</h4>
                  <p className="text-gray-600 text-sm">Save the VPN configuration files shared in the group</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Import to VPN App</h4>
                  <p className="text-gray-600 text-sm">Import the files into your VPN client (OpenVPN, etc.)</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Connect & Enjoy</h4>
                  <p className="text-gray-600 text-sm">Connect to the VPN and browse securely!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Important Notice</h3>
                <div className="text-red-800 text-sm space-y-1">
                  <p>• VPN files are for educational and privacy purposes only</p>
                  <p>• Respect local laws and regulations regarding VPN usage</p>
                  <p>• We are not responsible for misuse of the provided configurations</p>
                  <p>• Some configurations may not work in all regions or with all ISPs</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wifi } from "lucide-react";

export default function WiFiBypassPage() {
  const wifiNetworks = [
    {
      name: "Poa Street WiFi",
      description: "Bypass for Poa Street network",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      name: "Wazonet WiFi", 
      description: "Bypass for Wazonet network",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      name: "Rivernet WiFi",
      description: "Bypass for Rivernet network", 
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  const handlePurchase = (networkName: string) => {
    const message = `I want ${networkName} Bypass for 50KSH`;
    const whatsappUrl = `https://wa.me/254745282166?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <DashboardLayout title="WiFi Bypass">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            WiFi Bypass Solutions
          </h1>
          <p className="text-xl text-gray-600">
            Access restricted networks with our bypass tools
          </p>
        </div>

        {/* Networks Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {wifiNetworks.map((network, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className={`w-16 h-16 ${network.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Wifi className={`h-8 w-8 ${network.color}`} />
                </div>
                <CardTitle className="text-xl">{network.name}</CardTitle>
                <p className="text-gray-600">{network.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Details */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">V2Ray</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-medium text-primary">50 KSH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Test Duration:</span>
                    <span className="font-medium">5 Hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Full Duration:</span>
                    <span className="font-medium">7 Days</span>
                  </div>
                </div>

                {/* Purchase Button */}
                <Button 
                  className="w-full"
                  onClick={() => handlePurchase(network.name)}
                >
                  Pay 50 KSH
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Wifi className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">How it works</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>• Select your WiFi network from the options above</li>
                  <li>• Click "Pay 50 KSH" to contact our admin via WhatsApp</li>
                  <li>• Receive your V2Ray configuration file</li>
                  <li>• Enjoy 7 days of unrestricted internet access</li>
                  <li>• Test for 5 hours before full activation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

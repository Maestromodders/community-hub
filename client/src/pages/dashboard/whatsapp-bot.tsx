import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bot, Check, MessageCircle } from "lucide-react";

export default function WhatsAppBotPage() {
  const [selectedPlan, setSelectedPlan] = useState<{price: string, duration: string} | null>(null);

  const features = [
    "Auto-reply with custom commands",
    "Group moderation (anti-link, mute, kick)",
    "Antidelete (see deleted messages)",
    "Always Online Mode (bot never sleeps)",
    "Sticker maker (text, image, video → sticker)",
    "Media downloader (YouTube, TikTok, etc.)",
    "AI Chat (powered by ChatGPT API)",
    "Fun tools (quotes, memes, facts) etc"
  ];

  const plans = [
    {
      name: "14 Days Plan",
      price: "50 KSH",
      duration: "14 DAYS",
      popular: false,
      features: ["All Features Included", "14 Days Valid", "24/7 Support"]
    },
    {
      name: "1 Month Plan", 
      price: "100 KSH",
      duration: "1 MONTH",
      popular: true,
      features: ["All Features Included", "1 Month Valid", "Priority Support"]
    }
  ];

  const handlePlanSelect = (price: string, duration: string) => {
    setSelectedPlan({ price, duration });
  };

  const handleWhatsAppContact = () => {
    if (!selectedPlan) return;
    
    const message = `WHATSAPP BOT FOR ${selectedPlan.price}, I'LL PAY.`;
    const whatsappUrl = `https://wa.me/254745282166?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setSelectedPlan(null);
  };

  return (
    <DashboardLayout title="WhatsApp Bot">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            WhatsApp Bot – Premium Access
          </h1>
          <p className="text-xl text-gray-600">
            Automate your WhatsApp with powerful features
          </p>
        </div>

        {/* Features Section */}
        <Card>
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">💬 Features:</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className={feature.includes("Antidelete") || feature.includes("Always Online") ? "font-semibold" : ""}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Plans */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Choose Your Plan</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'border-primary border-2' : 'border-gray-200'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">
                      Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{plan.name}</h4>
                  <p className="text-3xl font-bold text-primary mb-4">{plan.price}</p>
                  <ul className="text-sm text-gray-600 mb-6 space-y-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Check className="h-4 w-4 text-green-600 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handlePlanSelect(plan.price, plan.duration)}
                  >
                    Choose {plan.price}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Special Offer */}
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <h4 className="text-lg font-bold text-green-800 mb-2">🎉 Special Offer</h4>
            <p className="text-green-700">
              Refer three friends and get WhatsApp bot <strong>permanent and forever!</strong>
            </p>
          </CardContent>
        </Card>

        {/* Payment Modal */}
        <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <DialogTitle className="text-center">Payment Details</DialogTitle>
            </DialogHeader>
            {selectedPlan && (
              <div className="text-center space-y-4">
                <div className="space-y-2">
                  <p><strong>PRICE:</strong> <span className="text-primary">{selectedPlan.price}</span></p>
                  <p><strong>VALID:</strong> <span className="text-primary">{selectedPlan.duration}</span></p>
                  <p><strong>FEATURES:</strong> <span className="text-green-600">ALL</span></p>
                </div>
                <p className="text-gray-600">Click below to contact admin via WhatsApp</p>
                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedPlan(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={handleWhatsAppContact}
                  >
                    Contact Admin
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

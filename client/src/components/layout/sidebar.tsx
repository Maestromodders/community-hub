import { Link, useLocation } from "wouter";
import { 
  Home, 
  Server, 
  Share2, 
  Bot, 
  MessageCircle, 
  Wifi, 
  Smartphone, 
  Shield, 
  Users, 
  Mail, 
  Award, 
  Star 
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/free-server", icon: Server, label: "FREE SERVER" },
  { href: "/dashboard/post-hub", icon: Share2, label: "POST HUB" },
  { href: "/dashboard/whatsapp-bot", icon: Bot, label: "WHATSAPP BOT" },
  { href: "/dashboard/talk-hub", icon: MessageCircle, label: "NEW PRIVATE MESSAGING (TALK HUB)" },
  { href: "/dashboard/wifi-bypass", icon: Wifi, label: "WiFi BYPASS" },
  { href: "/dashboard/modded-apps", icon: Smartphone, label: "MODDED/PREMIUM APPS" },
  { href: "/dashboard/vpn-files", icon: Shield, label: "VPN FILES" },
  { href: "/dashboard/join-community", icon: Users, label: "JOIN COMMUNITY" },
  { href: "/dashboard/contact-admin", icon: Mail, label: "CONTACT ADMIN" },
  { href: "/dashboard/credits", icon: Award, label: "CREDITS" },
  { href: "/dashboard/feedback", icon: Star, label: "FEEDBACK AND RATINGS" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 w-80 bg-white shadow-lg sidebar-transition z-30",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Users className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">COMMUNITY HUB</h1>
                <p className="text-sm text-gray-600">v2.0</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <a 
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg transition duration-200",
                      isActive 
                        ? "bg-primary text-white" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => onClose()}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm">{item.label}</span>
                  </a>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}

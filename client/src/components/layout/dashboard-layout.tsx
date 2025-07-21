import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./sidebar";
import { Footer } from "./footer";
import { getCountryFlag } from "@/lib/countries";
import { Menu, Settings, LogOut } from "lucide-react";
import { Link } from "wouter";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      setCurrentDateTime(now.toLocaleDateString('en-US', options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      window.location.href = "/auth/login";
    }, 100);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-80">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-600">{currentDateTime}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getCountryFlag(user.country)}</span>
                  <span className="font-medium text-gray-900">{user.name}</span>
                </div>

                {/* Profile Picture */}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border-2 border-gray-300">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture.startsWith('http') ? user.profilePicture : `${window.location.origin}${user.profilePicture}`}
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold ${user.profilePicture ? 'hidden' : ''}`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>

              {/* Settings & Logout */}
              <div className="flex items-center space-x-2">
                <Link href="/dashboard/settings">
                  <Button variant="ghost" size="sm" title="Settings">
                    <Settings className="h-4 w-4" />
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
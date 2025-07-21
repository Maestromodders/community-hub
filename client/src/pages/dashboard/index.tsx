import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { getAuthHeaders } from "@/lib/auth";
import { getCountryFlag } from "@/lib/countries";
import { websocketService } from "@/lib/websocket";
import { 
  Rocket, 
  UserCircle, 
  Share2, 
  Server, 
  Calendar, 
  Trophy,
  Clock
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  // Connect to WebSocket on dashboard load
  useEffect(() => {
    websocketService.connect();
    return () => websocketService.disconnect();
  }, []);

  // Fetch user stats
  const { data: userPosts } = useQuery({
    queryKey: ['/api/posts'],
    queryFn: () => fetch('/api/posts', { headers: getAuthHeaders() }).then(res => res.json()),
  });

  const { data: userServers } = useQuery({
    queryKey: ['/api/user/servers'],
    queryFn: () => fetch('/api/user/servers', { headers: getAuthHeaders() }).then(res => res.json()),
  });

  const userPostsCount = userPosts?.filter((post: any) => post.userId === user?.id).length || 0;
  const serversCount = userServers?.length || 0;
  const daysActive = user ? Math.floor((new Date().getTime() - new Date(user.createdAt || 0).getTime()) / (1000 * 60 * 60 * 24)) || 1 : 1;
  const rank = userPostsCount >= 10 ? "Gold" : userPostsCount >= 5 ? "Silver" : "Bronze";

  const recentActivities = [
    {
      icon: Share2,
      text: "Posted a new file in Post Hub",
      time: "2 hours ago",
      color: "bg-primary"
    },
    {
      icon: Server,
      text: "Generated a new server",
      time: "1 day ago",
      color: "bg-green-500"
    },
    {
      icon: Trophy,
      text: `Reached ${rank} community rank`,
      time: "3 days ago",
      color: "bg-orange-500"
    }
  ];

  if (!user) return null;

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Ready to explore what's new in the community?
              </p>
              <div className="mt-4 text-sm text-blue-100">
                <Clock className="inline-block w-4 h-4 mr-2" />
                Click on the sidebar menu to see all available options
              </div>
            </div>
            <div className="hidden md:block">
              <Rocket className="h-16 w-16 opacity-20" />
            </div>
          </div>
        </div>

        {/* User Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCircle className="w-5 h-5 mr-2 text-primary" />
              Your Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 border-4 border-gray-300 mx-auto mb-3">
                  {user.profilePicture ? (
                    <img 
                      src={user.profilePicture} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {!user.profilePicture && (
                  <p className="text-sm text-orange-600 font-medium">
                    Please set your profile picture
                  </p>
                )}
              </div>
              <div className="md:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Full Name</label>
                  <p className="text-lg font-semibold text-gray-900">{user.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Email</label>
                  <div className="flex items-center space-x-2">
                    <p className="text-lg text-gray-900">{user.email}</p>
                    <Badge variant={user.isVerified ? "default" : "destructive"}>
                      {user.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600">Country</label>
                  <p className="text-lg text-gray-900 flex items-center">
                    <span className="text-2xl mr-2">{getCountryFlag(user.country)}</span>
                    {user.country}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Your Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{userPostsCount}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Share2 className="text-primary text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Servers Used</p>
                  <p className="text-2xl font-bold text-gray-900">{serversCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Server className="text-green-600 text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Days Active</p>
                  <p className="text-2xl font-bold text-gray-900">{daysActive}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="text-orange-600 text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Community Rank</p>
                  <p className="text-2xl font-bold text-gray-900">{rank}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Trophy className="text-yellow-600 text-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center`}>
                    <activity.icon className="text-white text-sm" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.text}</p>
                    <p className="text-sm text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

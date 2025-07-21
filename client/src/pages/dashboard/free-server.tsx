import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ServerCard } from "@/components/server/server-card";
import { Button } from "@/components/ui/button";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Server, Plus } from "lucide-react";

export default function FreeServerPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: userServers, isLoading } = useQuery({
    queryKey: ['/api/user/servers'],
    queryFn: () => fetch('/api/user/servers', { headers: getAuthHeaders() }).then(res => res.json()),
  });

  const generateServerMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/servers/generate', {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to generate server');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/servers'] });
      toast({
        title: "Success",
        description: "New server generated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error", 
        description: error.message || "Failed to generate server",
        variant: "destructive",
      });
    },
  });

  const handleGenerateServer = () => {
    setIsGenerating(true);
    generateServerMutation.mutate();
    // Reset loading state after mutation completes
    setTimeout(() => setIsGenerating(false), 1000);
  };

  return (
    <DashboardLayout title="Free Server">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Free Server Generator</h1>
            <p className="text-gray-600">Generate and manage your free SSH/UDP servers</p>
          </div>
          <Button 
            onClick={handleGenerateServer}
            disabled={isGenerating || generateServerMutation.isPending}
          >
            <Server className="w-4 h-4 mr-2" />
            {isGenerating || generateServerMutation.isPending ? "Generating..." : "Generate New Server"}
          </Button>
        </div>

        {/* Server List */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading servers...</p>
            </div>
          ) : userServers && userServers.length > 0 ? (
            userServers.map((server: any, index: number) => (
              <ServerCard key={`${server.id}-${index}`} server={server} />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Server className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No servers generated yet</h3>
              <p className="text-gray-600 mb-4">Generate your first free server to get started!</p>
              <Button onClick={handleGenerateServer} disabled={isGenerating || generateServerMutation.isPending}>
                <Plus className="w-4 h-4 mr-2" />
                Generate Your First Server
              </Button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Server className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Server Information</h3>
              <ul className="text-blue-800 space-y-1 text-sm">
                <li>• Free SSH and UDP servers for VPN usage</li>
                <li>• Servers are valid for 30 days from generation</li>
                <li>• Unlimited bandwidth on all servers</li>
                <li>• Servers located in various countries</li>
                <li>• Copy credentials easily with one click</li>
                <li>• Test connection before use</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

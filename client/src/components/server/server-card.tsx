import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Server, 
  Copy, 
  CheckCircle, 
  Globe, 
  Clock, 
  Shield,
  Activity
} from "lucide-react";

interface ServerCardProps {
  server: any;
}

export function ServerCard({ server }: ServerCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: "Copied!",
        description: `${fieldName} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const copyAllDetails = async () => {
    const details = `Server: ${server.name}
Host: ${server.host}
Port: ${server.port}
Username: ${server.username}
Password: ${server.password}
Type: ${server.type?.toUpperCase()}
Location: ${server.location}`;

    try {
      await navigator.clipboard.writeText(details);
      toast({
        title: "Success",
        description: "All server details copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy server details",
        variant: "destructive",
      });
    }
  };

  const testConnection = () => {
    // This would typically make a request to test the server connection
    toast({
      title: "Connection Test",
      description: "Testing connection to server... (This is a demo)",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Server className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{server.name}</h3>
              <p className="text-sm text-gray-600">
                Generated: {formatDate(server.generatedAt || server.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Activity className="w-3 h-3 mr-1" />
              Active
            </Badge>
            <Button variant="ghost" size="sm" onClick={copyAllDetails} title="Copy all details">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Server Details Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">Server Host</label>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="font-mono text-sm text-gray-900">{server.host}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(server.host, "Host")}
                className="h-6 w-6 p-0"
              >
                {copiedField === "Host" ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">Port</label>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="font-mono text-sm text-gray-900">{server.port}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(server.port.toString(), "Port")}
                className="h-6 w-6 p-0"
              >
                {copiedField === "Port" ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">Username</label>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="font-mono text-sm text-gray-900">{server.username}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(server.username, "Username")}
                className="h-6 w-6 p-0"
              >
                {copiedField === "Username" ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="font-mono text-sm text-gray-900">{server.password}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(server.password, "Password")}
                className="h-6 w-6 p-0"
              >
                {copiedField === "Password" ? (
                  <CheckCircle className="w-3 h-3 text-green-600" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Server Information */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 text-blue-800 mb-3">
            <Shield className="w-4 h-4" />
            <span className="font-medium">Server Information</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Server className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700">
                  <strong>Type:</strong> {server.type?.toUpperCase() || "SSH/UDP"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700">
                  <strong>Location:</strong> {server.location || "Global"}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700">
                  <strong>Validity:</strong> 30 days
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700">
                  <strong>Bandwidth:</strong> Unlimited
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={copyAllDetails} 
            className="flex-1"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy All Details
          </Button>
          <Button 
            variant="outline" 
            onClick={testConnection}
            className="flex-1 sm:flex-initial"
          >
            <Activity className="w-4 h-4 mr-2" />
            Test Connection
          </Button>
        </div>

        {/* Usage Instructions */}
        <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
          <p className="font-medium mb-1">How to use:</p>
          <p>1. Copy the server details above</p>
          <p>2. Configure your VPN client with these credentials</p>
          <p>3. Connect and enjoy secure browsing!</p>
        </div>
      </CardContent>
    </Card>
  );
}

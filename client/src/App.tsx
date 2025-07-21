import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";

// Auth pages
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import VerifyEmailPage from "@/pages/auth/verify-email";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import AdminLoginPage from "@/pages/auth/admin-login";

// Dashboard pages
import DashboardPage from "@/pages/dashboard/index";
import PostHubPage from "@/pages/dashboard/post-hub";
import WhatsAppBotPage from "@/pages/dashboard/whatsapp-bot";
import WiFiBypassPage from "@/pages/dashboard/wifi-bypass";
import FreeServerPage from "@/pages/dashboard/free-server";
import SettingsPage from "@/pages/dashboard/settings";
import ContactAdminPage from "@/pages/dashboard/contact-admin";
import CreditsPage from "@/pages/dashboard/credits";
import FeedbackPage from "@/pages/dashboard/feedback";
import JoinCommunityPage from "@/pages/dashboard/join-community";
import TalkHubPage from "@/pages/dashboard/talk-hub";
import ModdedAppsPage from "@/pages/dashboard/modded-apps";
import VpnFilesPage from "@/pages/dashboard/vpn-files";

// Admin pages
import AdminPage from "@/pages/admin/index";

import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Auth routes */}
      <Route path="/" component={LoginPage} />
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/register" component={RegisterPage} />
      <Route path="/auth/verify-email" component={VerifyEmailPage} />
      <Route path="/auth/forgot-password" component={ForgotPasswordPage} />
      <Route path="/auth/admin-login" component={AdminLoginPage} />

      {/* Dashboard routes */}
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/dashboard/post-hub" component={PostHubPage} />
      <Route path="/dashboard/whatsapp-bot" component={WhatsAppBotPage} />
      <Route path="/dashboard/wifi-bypass" component={WiFiBypassPage} />
      <Route path="/dashboard/free-server" component={FreeServerPage} />
      <Route path="/dashboard/settings" component={SettingsPage} />
      <Route path="/dashboard/contact-admin" component={ContactAdminPage} />
      <Route path="/dashboard/credits" component={CreditsPage} />
      <Route path="/dashboard/feedback" component={FeedbackPage} />
      <Route path="/dashboard/join-community" component={JoinCommunityPage} />
      <Route path="/dashboard/talk-hub" component={TalkHubPage} />
      <Route path="/dashboard/modded-apps" component={ModdedAppsPage} />
      <Route path="/dashboard/vpn-files" component={VpnFilesPage} />

      {/* Admin routes */}
      <Route path="/admin" component={AdminPage} />

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
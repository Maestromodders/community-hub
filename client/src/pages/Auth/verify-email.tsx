import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { authService } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

const verifySchema = z.object({
  code: z.string().length(6, "Verification code must be 6 digits"),
});

type VerifyForm = z.infer<typeof verifySchema>;

export default function VerifyEmailPage() {
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const form = useForm<VerifyForm>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    // Get email from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    } else {
      // If no email in params, redirect to login
      setLocation("/auth/login");
    }
  }, [location, setLocation]);

  const onSubmit = async (data: VerifyForm) => {
    if (!email) return;
    
    setIsLoading(true);
    try {
      await authService.verifyEmail(email, data.code);
      toast({
        title: "Success",
        description: "Email verified successfully! You can now log in.",
      });
      setLocation("/auth/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Verification failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;
    
    setIsResending(true);
    try {
      await authService.resendCode(email);
      toast({
        title: "Success",
        description: "Verification code resent to your email",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to resend code",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Check Your Email</h2>
            <p className="text-gray-600 mt-2">
              We've sent a verification code to{" "}
              <span className="font-medium">{email}</span>
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  className="mt-2 text-center text-2xl tracking-widest"
                  {...form.register("code")}
                />
                {form.formState.errors.code && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.code.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-primary hover:underline font-medium"
                >
                  {isResending ? "Resending..." : "Resend"}
                </button>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/auth/login">
                <a className="text-sm text-gray-600 hover:text-primary">
                  ← Back to Sign In
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from "react";
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
import { Lock, ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const resetPasswordSchema = z.object({
  code: z.string().length(6, "Reset code must be 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordPage() {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "reset">("email");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const forgotForm = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onForgotSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(data.email);
      setEmail(data.email);
      setStep("reset");
      toast({
        title: "Success",
        description: "Password reset code sent to your email",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send reset code",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetPasswordForm) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(email, data.code, data.newPassword);
      toast({
        title: "Success",
        description: "Password reset successfully! You can now log in.",
      });
      setLocation("/auth/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {step === "email" ? "Reset Password" : "Enter Reset Code"}
            </h2>
            <p className="text-gray-600 mt-2">
              {step === "email" 
                ? "Enter your email to receive a reset code"
                : `Enter the reset code sent to ${email}`
              }
            </p>
          </CardHeader>
          <CardContent>
            {step === "email" ? (
              <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...forgotForm.register("email")}
                    className="mt-2"
                  />
                  {forgotForm.formState.errors.email && (
                    <p className="text-sm text-red-600 mt-1">
                      {forgotForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Code"}
                </Button>
              </form>
            ) : (
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="code">Reset Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    className="mt-2 text-center text-xl tracking-widest"
                    {...resetForm.register("code")}
                  />
                  {resetForm.formState.errors.code && (
                    <p className="text-sm text-red-600 mt-1">
                      {resetForm.formState.errors.code.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    {...resetForm.register("newPassword")}
                    className="mt-2"
                  />
                  {resetForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {resetForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    {...resetForm.register("confirmPassword")}
                    className="mt-2"
                  />
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-600 mt-1">
                      {resetForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setStep("email")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Email
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <Link href="/auth/login">
                <a className="text-primary hover:underline font-medium">
                  Back to Sign In
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

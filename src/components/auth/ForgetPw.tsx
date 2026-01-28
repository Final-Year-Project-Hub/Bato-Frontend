"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { OtpDialog } from "@/components/auth/OtpDialog";
import { toast } from "sonner";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validations/auth";
import { apiFetch } from "@/lib/api";
import type { ApiRoutes } from "@/lib/api/routes";

export default function ForgetPassword() {
  const router = useRouter();
  const [openOtp, setOpenOtp] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  //  Step 1: Send OTP to Email (Forgot Password)
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);

    const toastId = toast.loading("Sending OTP...");

    try {
      const res = await apiFetch("/auth/forgotPassword", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          purpose: "FORGOT_PASSWORD"
        }),
      }) as ApiRoutes["/auth/forgotPassword"];

      if (res.success) {
        setUserEmail(data.email);
        setOpenOtp(true);

        toast.success(res.message || "OTP has been sent to your email", {
          id: toastId,
        });
      } else {
        toast.error(res.message || "Failed to send OTP. Please try again.", {
          id: toastId,
        });
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Network error. Please check your connection.", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  //  Step 2: Verify OTP
  const handleVerifyOtp = async (otp: string) => {
    setIsLoading(true);

    const toastId = toast.loading("Verifying OTP...");

    try {
      const res = await apiFetch("/auth/verifyOtp", {
        method: "POST",
        body: JSON.stringify({
          email: userEmail,
          otp,
          purpose: "FORGOT_PASSWORD",
        }),
      }) as ApiRoutes["/auth/verifyOtp"];

      // Check if this is an error response
      if (!res.success) {
        toast.error(res.message || "Invalid OTP. Please try again.", { id: toastId });
        return;
      }

      // Get the resetToken from data (NEW STRUCTURE!)
      const resetToken = res.data?.resetToken;

      if (resetToken) {
        // Store the token in sessionStorage
        sessionStorage.setItem("resetToken", resetToken);
        
        // Show SUCCESS toast (green with checkmark)
        toast.success("Email verified successfully", { 
          id: toastId,
          description: "You can now reset your password"
        });
        
        setOpenOtp(false);
        
        setTimeout(() => {
          router.push("/resetpw");
        }, 1000);
      } else {
        toast.error("Verification successful but no reset token received", { id: toastId });
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to verify OTP. Please try again.", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  //  Step 3: Resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);

    const toastId = toast.loading("Resending OTP...");

    try {
      const res = await apiFetch("/auth/forgotPassword", {
        method: "POST",
        body: JSON.stringify({
          email: userEmail,
          purpose: "FORGOT_PASSWORD"
        }),
      }) as ApiRoutes["/auth/forgotPassword"];

      if (res.success) {
        toast.success("OTP has been resent to your email", { id: toastId });
      } else {
        toast.error(res.message || "Failed to resend OTP", { id: toastId });
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to resend OTP. Please try again.", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center px-4">
      {/* LOGO */}
      <div className="absolute top-6 right-6 z-50">
        <Logo />
      </div>

      {/* CARD */}
      <Card className="w-full max-w-md px-8 py-8 rounded-2xl text-white border border-white/10">
        <div className="text-center bg-background/10">
          <h2 className="text-2xl font-semibold text-[#EC5D44]">
            Find your account
          </h2>
          <p className="text-sm text-[#dbeafe] mt-2">
            Please enter your email address to search for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          <div>
            <label className="text-sm text-[#dbeafe]">Email address</label>
            <Input
              placeholder="m@example.com"
              {...register("email")}
              className="h-10 mt-1 bg-white/10 border-white/20 text-white"
              disabled={isSubmitting || isLoading}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full bg-[#EC5D44] hover:bg-[#EC5D44]/90 mt-2"
          >
            {isSubmitting || isLoading ? "Sending..." : "Search"}
          </Button>
        </form>

        <p
          onClick={() => router.push("/login")}
          className="text-center text-sm text-[#EC5D44] mt-4 cursor-pointer hover:underline"
        >
          Back to Login
        </p>
      </Card>

      {/* OTP DIALOG */}
      <OtpDialog
        open={openOtp}
        onClose={() => setOpenOtp(false)}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
      />
    </div>
  );
}
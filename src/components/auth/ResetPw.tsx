"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";
import type { ApiRoutes } from "@/lib/api/routes";

/* ------------------ Validation ------------------ */
const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormValues) => {
    const resetToken = sessionStorage.getItem("resetToken");
    
    if (!resetToken) {
      toast.error("Reset token is missing. Please try again.");
      router.push("/forgetpw");
      return;
    }

    const toastId = toast.loading("Resetting your password...");

    try {
      const res = await apiFetch("/auth/resetPassword", {
        method: "POST",
        body: JSON.stringify({ 
          token: resetToken,
          password: data.password 
        }),
      }) as ApiRoutes["/auth/resetPassword"];

      if (res.success) {
        // Clear the reset token from sessionStorage
        sessionStorage.removeItem("resetToken");
        
        toast.success("Password reset successful", {
          id: toastId,
          description: "Redirecting to login...",
        });

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.error(res.message || "Failed to reset password", { id: toastId });
      }
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Network error", { id: toastId });
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
            Reset your password
          </h2>
          <p className="text-sm text-[#dbeafe] mt-2">
            Enter your new password below.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-6">
          {/* New Password Field */}
          <div>
            <label className="text-sm text-[#dbeafe]">New Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                {...register("password")}
                className="h-10 mt-1 bg-white/10 border-white/20 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="text-sm text-[#dbeafe]">Confirm Password</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                {...register("confirmPassword")}
                className="h-10 mt-1 bg-white/10 border-white/20 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-2">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#EC5D44] hover:bg-[#EC5D44]/90 mt-2"
          >
            Reset Password
          </Button>
        </form>

        {/* Bottom navigation */}
        <div className="flex justify-between items-center mt-4">
          {/* Previous Button */}
          <button
            type="button"
            onClick={() => router.back()}
            className="text-sm text-[#EC5D44] hover:underline"
          >
            Previous
          </button>

          {/* Back to Login */}
          <p
            onClick={() => router.push("/login")}
            className="text-sm text-[#EC5D44] cursor-pointer hover:underline"
          >
            Back to Login
          </p>
        </div>
      </Card>
    </div>
  );
}
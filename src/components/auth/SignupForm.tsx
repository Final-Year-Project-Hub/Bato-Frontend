"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormValues } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

import { OtpDialog } from "@/components/auth/OtpDialog";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { apiFetch } from "@/lib/api";

export default function SignupForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpUserId, setOtpUserId] = useState("");
  const [otpEmail, setOtpEmail] = useState("");

  const onSubmit = async (data: SignupFormValues) => {
    const toastId = toast.loading("Creating your account...");

    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      const result = await apiFetch("/auth/signup", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const shouldOpenOtp =
        result?.success === true &&
        typeof result?.data?.id === "string" &&
        typeof result?.data?.email === "string";

      if (shouldOpenOtp) {
        toast.success("Account created ", {
          id: toastId,
          description: "OTP sent to your email",
        });

        setOtpEmail(result.data.email);
        setOtpUserId(result.data.id);
        setOtpOpen(true);
        return;
      }

      toast.error(result?.message || "Signup failed ", {
        id: toastId,
      });
    } catch (error) {
      toast.error("Signup error ", {
        id: toastId,
        description: "Please try again later",
      });
      console.error("Signup Error:", error);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    const toastId = toast.loading("Verifying OTP...");

    try {
      const res = await apiFetch("/auth/verifyOtp", {
        method: "POST",
        body: JSON.stringify({
          email: otpEmail,
          userId: otpUserId,
          otp,
          purpose: "EMAIL_VERIFICATION",
        }),
      });

      if (res.success) {
        toast.success("Email verified ", {
          id: toastId,
          description: "You can now login to your account",
        });

        setOtpOpen(false);

        setTimeout(() => {
          router.push("/login");
        }, 800);
      } else {
        toast.error(res.message || "Invalid OTP ", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("OTP verification failed ⚠️", {
        id: toastId,
      });
      console.error(error);
    }
  };

  const handleResendOtp = async () => {
    const toastId = toast.loading("Resending OTP...");

    try {
      const res = await apiFetch("/auth/resendOtp", {
        method: "POST",
        body: JSON.stringify({
          userId: otpUserId,
          email: otpEmail,
          purpose: "EMAIL_VERIFICATION",
        }),
      });

      toast.success("OTP resent 📩", {
        id: toastId,
        description: res.message,
      });
    } catch (error) {
      toast.error("Failed to resend OTP ", {
        id: toastId,
      });
      console.error("Resend OTP error:", error);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(0, 0, 0, 0.7),
              rgba(0, 0, 0, 0.7)
            ),
            url('/images/path.png')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* LOGO */}
      <div className="absolute top-7 right-10 z-50">
        <Logo />
      </div>

      {/* CENTER */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md px-8 py-8 rounded-2xl bg-background border border-border">
          {/* FORM */}
          <div>
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-primary">
                Create an account
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Enter your details below to get started with{" "}
                <span className="font-medium text-foreground">bato.ai</span>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* FULL NAME */}
              <div className="relative">
                <label className="text-sm text-foreground">Full Name</label>
                <Input
                  {...register("name")}
                  placeholder="John Doe"
                  className="h-10 mt-1 bg-grey border-border text-foreground placeholder:text-muted-foreground"
                />
                {errors.name && (
                  <span className="absolute -bottom-4 text-xs text-red-400">
                    {errors.name.message}
                  </span>
                )}
              </div>

              {/* EMAIL */}
              <div className="relative">
                <label className="text-sm text-foreground">Email</label>
                <Input
                  {...register("email")}
                  placeholder="m@example.com"
                  className="h-10 mt-1 bg-grey border-border text-foreground placeholder:text-muted-foreground"
                />
                {errors.email && (
                  <span className="absolute -bottom-4 text-xs text-red-400">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <label className="text-sm text-foreground">Password</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="h-10 mt-1 bg-grey border-border text-foreground pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                {errors.password && (
                  <span className="absolute -bottom-4 text-xs text-red-400">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative">
                <label className="text-sm text-foreground">
                  Confirm Password
                </label>
                <Input
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword")}
                  className="h-10 mt-1 bg-grey border-border text-foreground pr-10 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-10 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                {errors.confirmPassword && (
                  <span className="absolute -bottom-4 text-xs text-red-400">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-white mt-6"
              >
                {isSubmitting ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </div>

          {/* SOCIAL */}
          <div className="space-y-4 mt-6">
            <div className="flex items-center">
              <span className="h-px flex-1 bg-border" />
              <span className="px-3 py-1 text-xs bg-grey rounded-full text-muted-foreground font-semibold">
                OR CONTINUE WITH
              </span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <Button className="w-full h-10 bg-grey text-foreground hover:bg-grey/80 flex items-center justify-center gap-3 border border-border">
              <FcGoogle size={18} /> Google
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="hover:underline cursor-pointer text-primary font-medium"
              >
                Sign in
              </span>
            </p>
          </div>
        </Card>
      </div>

      {/* OTP DIALOG */}
      <OtpDialog
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
      />
    </div>
  );
}
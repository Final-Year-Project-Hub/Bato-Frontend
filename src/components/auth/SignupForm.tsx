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

import { OtpDialog } from "@/components/auth/OtpDialog";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

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

  const onSubmit = async (data: SignupFormValues) => {
    console.log("Signup Data:", data);
    setOtpOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* BACKGROUND */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(30, 70, 94, 0.88),
              rgba(30, 70, 94, 0.88)
            ),
            url('/images/path.png')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* LOGO — FIXED TOP RIGHT */}
      <div className="absolute top-7 right-10 z-50">
        <Logo />
      </div>

      {/* CENTER */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        
        <Card
          className="
            w-full
            max-w-[475px]
            min-h-[675px]
            px-8 py-8
            rounded-2xl
            text-white
            border border-white/10
            flex flex-col justify-between
          "
          style={{
            backgroundColor: "#233845",
            backdropFilter: "blur(14px)",
            boxShadow: "0 25px 70px rgba(0,0,0,0.65)",
          }}
        >
          {/* TOP */}
          <div>
            <div className="mb-3 text-center">
              <h2 className="text-xl font-semibold text-[#EC5D44]">
                Create an account
              </h2>
              <p className="text-sm text-[#EC5D44]/80 mt-1">
                Enter your details below to get started with <br />
                <span className="font-medium">bato.ai</span>
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* FULL NAME */}
              <div className="relative">
                <label className="text-sm text-[#dbeafe] ">Full Name</label>
                <Input
                  {...register("fullName")}
                  placeholder="John Doe"
                  className="h-10 mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                {errors.fullName && (
                  <span className="absolute -bottom-4 left-0 text-xs text-red-400">
                    {errors.fullName.message}
                  </span>
                )}
              </div>

              {/* EMAIL */}
              <div className="relative">
                <label className="text-sm text-[#dbeafe]">Email</label>
                <Input
                  {...register("email")}
                  placeholder="m@example.com"
                  className="h-10 mt-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
                {errors.email && (
                  <span className="absolute -bottom-4 left-0 text-xs text-red-400">
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <label className="text-sm text-[#dbeafe]">Password</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="h-10 mt-1 bg-white/10 border-white/20 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-white/60"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                {errors.password && (
                  <span className="absolute -bottom-4 left-0 text-xs text-red-400">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* CONFIRM PASSWORD */}
              <div className="relative">
                <label className="text-sm text-[#dbeafe] ">
                  Confirm Password
                </label>
                <Input
                  type={showConfirm ? "text" : "password"}
                  {...register("confirmPassword")}
                  className="h-10 mt-1 bg-white/10 border-white/20 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-10 text-white/60"
                >
                  {showConfirm ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                {errors.confirmPassword && (
                  <span className="absolute -bottom-4 left-0 text-xs text-red-400">
                    {errors.confirmPassword.message}
                  </span>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#EC5D44] hover:bg-[#EC5D44]/90 mt-6"
              >
                Sign Up
              </Button>
            </form>
          </div>

          {/* BOTTOM */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="h-px flex-1 bg-white/20" />
              <span className="px-3 py-1 text-xs text-[#45556C] font-semibold bg-white rounded-full">
                OR CONTINUE WITH
              </span>
              <span className="h-px flex-1 bg-white/20" />
            </div>

            <Button className="w-full h-10 bg-white/10 text-white hover:bg-white/20 flex items-center justify-center gap-3">
              <FcGoogle size={18} />
              Google
            </Button>

            <p className="text-center text-sm text-[#A1A1AA]">
              Already have an account?{" "}
              <span
                onClick={() => router.push("/login")}
                className="hover:underline cursor-pointer text-[#EC5D44] font-medium"
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
        onVerify={(otp) => console.log("Entered OTP:", otp)}
      />
    </div>
  );
}

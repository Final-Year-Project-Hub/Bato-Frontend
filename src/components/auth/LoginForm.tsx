"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import { loginSchema, LoginFormValues } from "@/lib/validations/auth";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log(data);
  };

  return (
    <div className="relative min-h-screen bg-[#1e465e] flex items-center justify-center px-4">
      
      {/* LOGO */}
      <div className="absolute top-6 right-6 z-50">
        <Logo />
      </div>

      {/* MAIN WRAPPER — CENTERED & RESPONSIVE */}
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row">

        {/* LEFT IMAGE */}
        <div
          className="hidden lg:block lg:w-7/12 min-h-[70vh] bg-cover bg-center"
          style={{ backgroundImage: "url('/images/path.png')" }}
        />

        {/* RIGHT CARD */}
        <div className="w-full lg:w-5/12 flex items-center justify-center py-10 lg:py-0">
          <Card
            className="w-full max-w-md px-8 py-8 rounded-2xl text-white border border-white/10 flex flex-col"
            style={{
              background: "rgba(35, 56, 69, 0.85)",
              backdropFilter: "blur(14px)",
              boxShadow: "0 25px 70px rgba(0,0,0,0.65)",
            }}
          >
            {/* FORM HEADER */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-[#EC5D44]">
                Welcome back!!!
              </h2>
              <p className="text-sm text-[#EC5D44] mt-1">
                Access your AI-guided learning roadmaps
              </p>
            </div>

            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm text-[#EC5D44]">Email</label>
                <Input
                  placeholder="m@example.com"
                  {...register("email")}
                  className="h-10 mt-1 bg-white/20 border-white/20 placeholder:text-white/60"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.email.message}
                    
                  </p>
                )}
              </div>

              <div className="relative">
                <label className="text-sm text-[#EC5D44]">Password</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="h-10 mt-1 bg-white/20 border-white/20 text-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-10 text-white/60"
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="text-center text-sm text-[#EC5D44] cursor-pointer mt-2 hover:underline">
                Forgot Password?
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#EC5D44] hover:bg-[#EC5D44]/90 mt-3"
              >
                Sign In
              </Button>
            </form>

            {/* SOCIAL LOGIN */}
            <div className="mt-4">
              <div className="flex items-center">
                <span className="flex-1 h-px bg-white/20" />
                <span className="px-3 py-1 text-xs font-semibold text-[#45556C] bg-white rounded-full">
                  OR CONTINUE WITH
                </span>
                <span className="flex-1 h-px bg-white/20" />
              </div>

              <Button className="w-full h-10 bg-white/10 text-white flex items-center justify-center gap-3 hover:bg-white/20 font-medium mt-4">
                <FcGoogle size={18} /> Google
              </Button>

              <p className="text-center text-sm text-[#A1A1AA] mt-5">
                New to bato.ai?{" "}
                <span
                  onClick={() => router.push("/signup")}
                  className="hover:underline cursor-pointer text-[#EC5D44] font-medium"
                >
                  Create an account
                </span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

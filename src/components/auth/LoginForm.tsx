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
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/app/features/auth/hooks/useAuth";
import { toast } from "sonner";

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { refresh } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    const toastId = toast.loading("Signing you in...");

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      if (res.success) {
        toast.success("Login successful ", {
          id: toastId,
          description: "Welcome back to bato.ai",
          duration: 2500,
        });

        await refresh();

        setTimeout(() => {
          router.push("/chat");
        }, 800);
      } else {
        toast.error(res.message || "Invalid email or password ", {
          id: toastId,
        });
      }
    } catch (error) {
      toast.error("Server error ", {
        id: toastId,
        description: "Please try again later",
      });

      console.error("Login error:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center px-4">
      {/* LOGO */}
      <div className="absolute top-6 right-6 z-50">
        <Logo />
      </div>

      {/* MAIN WRAPPER */}
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row">
        {/* LEFT IMAGE */}
        <div
          className="hidden lg:block lg:w-7/12 min-h-[70vh] bg-cover bg-center rounded-l-2xl"
          style={{ backgroundImage: "url('/images/path.png')" }}
        />

        {/* RIGHT CARD */}
        <div className="w-full lg:w-5/12 flex items-center justify-center py-10 lg:py-0">
          <Card className="w-full max-w-md px-8 py-8 rounded-2xl lg:rounded-l-none bg-background border border-border">
            {/* HEADER */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-primary">
                Welcome back!!!
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Access your AI-guided learning roadmaps
              </p>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm text-foreground">Email</label>
                <Input
                  placeholder="m@example.com"
                  {...register("email")}
                  className="h-10 mt-1 bg-grey border-border text-foreground placeholder:text-muted-foreground"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

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
                  <p className="text-red-400 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div
                onClick={() => router.push("/forgetpw")}
                className="text-center text-sm text-primary cursor-pointer mt-2 hover:underline"
              >
                Forgot Password?
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-white mt-3"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* SOCIAL */}
            <div className="mt-4">
              <div className="flex items-center">
                <span className="flex-1 h-px bg-border" />
                <span className="px-3 py-1 text-xs font-semibold text-muted-foreground bg-grey rounded-full">
                  OR CONTINUE WITH
                </span>
                <span className="flex-1 h-px bg-border" />
              </div>

              <Button className="w-full h-10 bg-grey text-foreground flex items-center justify-center gap-3 hover:bg-grey/80 font-medium mt-4 border border-border">
                <FcGoogle size={18} /> Google
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-5">
                New to bato.ai?{" "}
                <span
                  onClick={() => router.push("/signup")}
                  className="hover:underline cursor-pointer text-primary font-medium"
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
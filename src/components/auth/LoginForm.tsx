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

interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken: string;
    refreshToken: string;
    user?: {
      id: string;
      email: string;
      name?: string;
      role?: string;
    };
    role?: string;
  };
}

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

  const getErrorDescription = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("email") && lowerMessage.includes("not found")) {
      return "This email is not registered";
    }
    if (
      lowerMessage.includes("password") &&
      lowerMessage.includes("incorrect")
    ) {
      return "Please check your password and try again";
    }
    if (lowerMessage.includes("invalid credentials")) {
      return "Email or password is incorrect";
    }
    if (lowerMessage.includes("account") && lowerMessage.includes("disabled")) {
      return "Your account has been disabled";
    }
    if (
      lowerMessage.includes("verify") ||
      lowerMessage.includes("verification")
    ) {
      return "Please verify your email first";
    }

    return "";
  };

  const handleGoogleLogin = async () => {
    try{
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://bato-backend-a9x8.onrender.com";
  const response =await fetch(`${backendUrl}/auth/google`, {
    method: "GET",
    credentials: "include",
    headers: {
      'Content-Type': 'application/json'
    }
  });
  } catch (error) {
    console.error("Google login error:", error);
  }
  };

  const onSubmit = async (data: LoginFormValues) => {
    const toastId = toast.loading("Signing you in...");

    try {
      const res = (await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      })) as LoginResponse;

      if (res.success) {
        toast.success("Login successful", {
          id: toastId,
          description: "Welcome back to bato.ai",
          duration: 2500,
        });

        await fetch("/api/session/set", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            accessToken: res.data?.accessToken,
            refreshToken: res.data?.refreshToken,
          }),
        });

        await refresh();

        const userRole = res.data?.user?.role || res.data?.role;
        const userName = res.data?.user?.name || "User";

        // Show role-specific success toast
        if (userRole === "admin" || userRole === "ADMIN") {
          toast.success("Admin login successful", {
            id: toastId,
            description: "Welcome to the Admin Dashboard",
            duration: 2500,
          });
        } else {
          toast.success("Login successful", {
            id: toastId,
            description: `Welcome back, ${userName}!`,
            duration: 2500,
          });
        }

        setTimeout(() => {
          if (userRole === "admin" || userRole === "ADMIN") {
            router.push("/admin");
          } else {
            router.push("/chat");
          }
        }, 800);
      } else {
        const errorMessage = res.message || "Login failed";

        toast.error(errorMessage, {
          id: toastId,
          description: getErrorDescription(errorMessage),
        });
      }
    } catch (error: unknown) {
      const err = error as Error;
      const errorMessage = err?.message || "Unable to connect to server";

      toast.error("Couldn't login", {
        id: toastId,
        description: errorMessage.includes("fetch")
          ? "Please check your internet connection"
          : errorMessage,
      });

      console.error("Login error:", error);
    }
  };

  // Google Login with Fetch and Full Debugging
  const handleGoogleLogin = async () => {
    console.log("[Google Login] Started");
    const toastId = toast.loading("Connecting to Google...");

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://bato-backend-a9x8.onrender.com";

      console.log("[Google Login] Backend URL:", backendUrl);
      console.log("[Google Login] Fetching from:", `${backendUrl}/auth/google`);
        window.location.href=`${backendUrl}/auth/google`;
      // const response = await fetch(`${backendUrl}/auth/google`, {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });

  //     console.log("[Google Login] Response status:", response.status);
  //     console.log("[Google Login] Response ok:", response.ok);
  //     console.log("[Google Login] Response headers:", Object.fromEntries(response.headers.entries()));

  //     if (!response.ok) {
  //       const errorText = await response.text();
  //       console.error("[Google Login] Response not OK. Status:", response.status);
  //       console.error("[Google Login] Error text:", errorText);
        
  //       toast.error("Unable to connect to Google", {
  //         id: toastId,
  //         description: `Server error: ${response.status}`,
  //       });
  //       return;
  //     }

  //     const data = await response.json();
  //     console.log("[Google Login] Response data:", data);

  //     if (data.success && data.authUrl) {
  //       console.log("[Google Login] Auth URL received:", data.authUrl);
        
  //       sessionStorage.setItem('google_login_flow', 'true');
  //       toast.dismiss(toastId);
        
  //       console.log("[Google Login] Redirecting to Google...");
        
  //       // Redirect browser to Google OAuth page
  //       window.location.href = data.authUrl;
  //     } else {
  //       console.error("[Google Login] Invalid response structure:", data);
        
  //       toast.error("Unable to connect to Google", {
  //         id: toastId,
  //         description: data.message || "Invalid server response",
  //       });
  //     }
    } catch (error) {
      console.error("[Google Login] Fetch error caught:", error);
      console.error("[Google Login] Error name:", (error as Error).name);
      console.error("[Google Login] Error message:", (error as Error).message);
      console.error("[Google Login] Full error:", error);

      const err = error as Error;
      
      if (err.message.includes("CORS") || err.message.includes("fetch")) {
        toast.error("Connection blocked", {
          id: toastId,
          description: "CORS policy blocking request. Contact support.",
        });
      } else {
        toast.error("Connection failed", {
          id: toastId,
          description: err.message || "Please check your internet connection",
        });
      }
    }
  };

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute top-6 right-6 z-50">
        <Logo />
      </div>

      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row">
        <div
          className="hidden lg:block lg:w-7/12 min-h-[70vh] bg-cover bg-center rounded-l-2xl"
          style={{ backgroundImage: "url('/images/path.png')" }}
        />

        <div className="w-full lg:w-5/12 flex items-center justify-center py-10 lg:py-0">
          <Card className="w-full max-w-md px-8 py-8 rounded-2xl lg:rounded-l-none bg-background border border-border">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-primary">
                Welcome back!!!
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Access your AI-guided learning roadmaps
              </p>
            </div>

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

            <div className="mt-4">
              <div className="flex items-center">
                <span className="flex-1 h-px bg-border" />
                <span className="px-3 py-1 text-xs font-semibold text-muted-foreground bg-grey rounded-full">
                  OR CONTINUE WITH
                </span>
                <span className="flex-1 h-px bg-border" />
              </div>

              <Button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full h-10 bg-grey text-foreground flex items-center justify-center gap-3 hover:bg-grey/80 font-medium mt-4 border border-border"
              >
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
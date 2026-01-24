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
import { OtpDialog } from "@/components/auth/OtpDialog";

/* ------------------ Validation ------------------ */
const forgetPwSchema = z.object({
  email: z.string().email("Enter a valid email address first"),
});

type ForgetPwFormValues = z.infer<typeof forgetPwSchema>;

export default function ForgetPassword() {
  const router = useRouter();
  const [openOtp, setOpenOtp] = useState(false);
//   

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgetPwFormValues>({
    resolver: zodResolver(forgetPwSchema),
  });

  const onSubmit = async (data: ForgetPwFormValues) => {
    console.log("Forgot Password Email:", data.email);

    // 🔥 API call goes here
    setOpenOtp(true);
  };

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center px-4">
      {/* LOGO */}
      <div className="absolute top-6 right-6 z-50">
        <Logo />
      </div>

      {/* CARD */}
      <Card
        className="w-full max-w-md px-8 py-8 rounded-2xl text-white border border-white/10"
       
      >
        <div className="text-center  bg-background/10 ">
          <h2 className="text-2xl font-semibold text-[#EC5D44]">
            Find your account
          </h2>
          <p className="text-sm text-[#dbeafe] mt-2">
            Please enter your email address to search for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm text-[#dbeafe]">Email address</label>
            <Input
              placeholder="m@example.com"
              {...register("email")}
              className="h-10 mt-1 bg-white/10 border-white/20 text-white"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#EC5D44] hover:bg-[#EC5D44]/90 mt-2"
          >
            Search
          </Button>
        </form>

        <p
          onClick={() => router.push("/login")}
          className="text-center text-sm text-[#EC5D44]  cursor-pointer hover:underline"
        >
          Back to Login
        </p>
      </Card>

      {/* OTP DIALOG */}
      <OtpDialog
        open={openOtp}
        onClose={() => setOpenOtp(false)}
        onVerify={(otp) => {
          console.log("OTP Verified:", otp);
          setOpenOtp(false);

          //  next step
          // router.push("/reset-password");
        }}
        onResend={() => {
          console.log("Resend OTP");
        }}
      />
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Camera } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/features/auth/hooks/useAuth";
import { OtpDialog } from "../../../../../../components/auth/OtpDialog";

/* ================= Types ================= */
interface UpdateProfileData {
  name: string;
  email: string;
}

interface UpdateProfileResponse {
  success: boolean;
  message?: string;
  data?: {
    user?: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
    };
    emailChangePending?: boolean;
  };
}

interface VerifyOtpResponse {
  success: boolean;
  message?: string;
  data?: {
    verified: boolean;
  };
}

/* ================= Schema ================= */
const profileSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Enter a valid email"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileSettings() {
  const { user, refresh } = useAuth();
  const router = useRouter();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  /* ================= Load User ================= */
  useEffect(() => {
    if (!user) return;

    form.reset({
      name: user.name || "",
      email: user.email || "",
    });

    const userWithImage = user as typeof user & { image?: string | null };
    if (userWithImage.image) {
      setAvatarPreview(userWithImage.image);
    }
  }, [user, form]);

  /* ================= Submit Profile ================= */
  async function onSubmit(values: ProfileFormValues) {
    setIsSubmitting(true);
    const toastId = toast.loading("Updating profile...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/editUser`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
          } as UpdateProfileData),
        }
      );

      const data: UpdateProfileResponse = await res.json();

      if (!data.success) {
        toast.error(data.message || "Failed to update profile", {
          id: toastId,
        });
        return;
      }

      if (data.data?.emailChangePending) {
        toast.info("Email verification required", {
          id: toastId,
          description: "Please verify OTP sent to your new email",
        });

        setNewEmail(values.email);
        setShowOtpModal(true);
      } else {
        toast.success("Profile updated successfully", { id: toastId });
        await refresh();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ================= Verify OTP ================= */
  async function handleVerifyOtp(enteredOtp: string) {
    if (enteredOtp.length !== 6) return;

    const toastId = toast.loading("Verifying OTP...");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verifyOtp`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: newEmail,
            otp: enteredOtp,
            purpose: "EMAIL_VERIFICATION",
          }),
        }
      );

      const data: VerifyOtpResponse = await res.json();

      if (!data.success) {
        toast.error(data.message || "Invalid OTP", { id: toastId });
        return;
      }

   toast.success("Email verified successfully", {
  id: toastId,
  description: (
    <span className="flex gap-2">
      You can now login.
      <button
        onClick={() => router.push("/login")}
        className="text-primary font-medium hover:underline"
      >
        Go to Login
      </button>
    </span>
  ),
});


      setShowOtpModal(false);
      await refresh();
    } catch (err) {
      console.error(err);
      toast.error("OTP verification failed", { id: toastId });
    }
  }

  /* ================= Resend OTP ================= */
  async function handleResendOtp() {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/resendOtp`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: newEmail,
            purpose: "EMAIL_VERIFICATION",
          }),
        }
      );

      toast.success("OTP resent successfully");
    } catch {
      toast.error("Failed to resend OTP");
    }
  }

  /* ================= Avatar ================= */
  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    
  }

  const getInitials = () => {
    if (!user?.name) return user?.email?.[0]?.toUpperCase() || "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarPreview ?? ""} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>

              <label
                htmlFor="avatar"
                className="cursor-pointer text-sm text-primary hover:underline flex items-center gap-2"
              >
                <Camera size={16} />
                Upload New Picture
              </label>

              <input
                id="avatar"
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                      {user?.email !== field.value && (
                        <p className="text-xs text-amber-500">
                           Changing email requires OTP verification
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <OtpDialog
        open={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        onResend={handleResendOtp}
      />
    </>
  );
}

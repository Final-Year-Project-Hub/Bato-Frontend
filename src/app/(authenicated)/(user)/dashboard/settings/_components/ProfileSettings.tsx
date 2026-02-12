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

interface UpdateProfileImageResponse {
  updatedUser: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string;
    password: string;
    role: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    refreshToken: string;
  };
  message: string;
  image: string;
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);

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

    console.log(" Loading user data:", user);

    form.reset({
      name: user.name || "",
      email: user.email || "",
    });

    // Set avatar preview from user data
    if (user.image) {
      console.log(" Setting avatar from user.image:", user.image);
      setAvatarPreview(user.image);
    } else {
      console.log("⚠️ No image found in user data");
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
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/resendOtp`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          purpose: "EMAIL_VERIFICATION",
        }),
      });

      toast.success("OTP resent successfully");
    } catch {
      toast.error("Failed to resend OTP");
    }
  }

  /* ================= Avatar Upload ================= */
  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log(" File selected:", file.name, file.type, file.size);

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setIsUploadingImage(true);
    const toastId = toast.loading("Uploading profile picture...");

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("image", file);

      const uploadUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/userProfileImage`;
      console.log("📤 Uploading to:", uploadUrl);

      // Upload to backend
      const res = await fetch(uploadUrl, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      console.log(" Response status:", res.status);

      if (!res.ok) {
        let errorMessage;
        try {
          const errorData = await res.json();
          console.error(" Error response:", errorData);
          errorMessage = errorData.message || errorData.error || `Upload failed: ${res.status}`;
        } catch {
          const errorText = await res.text();
          console.error(" Error response (text):", errorText);
          errorMessage = `Upload failed: ${res.status}`;
        }
        toast.error(errorMessage, { id: toastId });
        return;
      }

      const data: UpdateProfileImageResponse = await res.json();
      console.log(" Response data:", data);

      // Extract image URL
      const imageUrl = data.updatedUser?.image || data.image;
      
      if (!imageUrl) {
        console.error("No image URL in response");
        toast.error("Upload failed: No image URL returned", { id: toastId });
        return;
      }

      console.log(" New image URL:", imageUrl);

      // Update local preview immediately
      setAvatarPreview(imageUrl);

      toast.success("Profile picture updated successfully", { id: toastId });

      // Refresh user data from backend to sync everything
      console.log(" Refreshing user data...");
      await refresh();
      console.log("User data refreshed");
    } catch (err) {
      console.error(" Upload error:", err);
      
      if (err instanceof TypeError && err.message.includes("fetch")) {
        toast.error("Network error: Cannot reach server", { id: toastId });
      } else {
        toast.error("Failed to upload image", { id: toastId });
      }
    } finally {
      setIsUploadingImage(false);
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
                <AvatarImage src={avatarPreview ?? ""} className="object-cover" />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>

              <label
                htmlFor="avatar"
                className={`cursor-pointer text-sm text-primary hover:underline flex items-center gap-2 ${
                  isUploadingImage ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <Camera size={16} />
                {isUploadingImage ? "Uploading..." : "Upload New Picture"}
              </label>

              <input
                id="avatar"
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatarChange}
                disabled={isUploadingImage}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Maximum file size: 2MB. Supported formats: JPG, PNG, GIF
            </p>
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
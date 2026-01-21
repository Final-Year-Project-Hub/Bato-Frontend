"use client";

import { useState } from "react";
import { useForm, Control } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Trash2 } from "lucide-react";
import DeleteModal from "./DeleteModal"; // ✅ adjust path if needed

/* ---------------- Schema ---------------- */
const securitySchema = z
  .object({
    currentPassword: z.string().min(6, "Required"),
    newPassword: z.string().min(8, "At least 8 characters"),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SecurityFormValues = z.infer<typeof securitySchema>;

export default function SecuritySettings() {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: SecurityFormValues) {
    console.log("Security Data:", values);
  }

  function handleDeleteAccount() {
    console.log("Account deleted");
    setOpenDeleteModal(false);
    // 🔥 call delete account API here
  }

  return (
    <>
      <div className="space-y-10">
        {/* ---------------- Change Password ---------------- */}
        <div className="max-w-3xl">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-6">
                Change Password
              </h2>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <PasswordField
                    label="Current Password"
                    name="currentPassword"
                    control={form.control}
                    colSpan
                  />

                  <PasswordField
                    label="New Password"
                    name="newPassword"
                    control={form.control}
                  />

                  <PasswordField
                    label="Confirm Password"
                    name="confirmPassword"
                    control={form.control}
                  />

                  <div className="md:col-span-2 flex justify-end">
                    <Button type="submit">
                      Update Password
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* ---------------- Danger Zone ---------------- */}
        <Card className="border-destructive/40 bg-destructive/5 w-full">
          <CardContent className="px-6 py-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex gap-3">
              <Trash2 className="text-destructive mt-1" size={22} />

              <div>
                <h3 className="text-base font-semibold text-destructive">
                  Delete Account
                </h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data.
                </p>
              </div>
            </div>

            <Button
              variant="destructive"
              onClick={() => setOpenDeleteModal(true)}
            >
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Modal Integration */}
      <DeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteAccount}
      />
    </>
  );
}

/* ---------------- Password Field ---------------- */

function PasswordField({
  label,
  name,
  control,
  colSpan,
}: {
  label: string;
  name: "currentPassword" | "newPassword" | "confirmPassword";
  control: Control<SecurityFormValues>;
  colSpan?: boolean;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={colSpan ? "md:col-span-2" : ""}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type="password" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

"use client";

import { useState } from "react";
import { Bell, MessageCircleMore } from "lucide-react";
import { Button } from "./button";
import { ThemeToggle } from "./ThemeToggle";

export default function AuthNav() {
  //   const userInitial = user?.name?.charAt(0).toUpperCase() ?? null;
  const [open, setOpen] = useState(false);
  const user = "Alisha"; // Replace with actual user authentication logic

  // Desktop layout
  return (
    <nav
      className={` shadow-sm relative flex justify-between items-center px-4  py-4  mx-auto bg-background border-b border-b-white/25`}
    >
      <div className="my-container w-full h-full flex justify-between items-center z-50">
        <div>
          <p className="text-primary text-2xl font-bold">Dashboard</p>
          <p>Welcome Back, {user} </p>
        </div>
        <div className="flex items-center gap-6">
          {/* <Bell className="w-5 h-5 fill-current" /> */}
          {user && (
            <Button>
              <MessageCircleMore /> New Chat
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

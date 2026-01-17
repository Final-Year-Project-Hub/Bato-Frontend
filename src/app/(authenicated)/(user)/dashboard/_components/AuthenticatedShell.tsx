"use client";

import { ReactNode, useState } from "react";
import AuthNav from "@/components/ui/AuthNav";
import SideBar from "./SideBar";

export default function AuthenticatedShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // widths must match your sidebar: w-75 and w-16
  const pl = collapsed ? "lg:pl-16" : "lg:pl-75";

  return (
    <div className="relative min-h-screen">
      {/* TOP NAV */}
      <div className={`fixed top-0 left-0 right-0 hidden lg:block ${pl}`}>
        <AuthNav />
      </div>

      {/* SIDEBAR */}
      <div className="fixed border-r border-white/25 h-screen top-0 left-0 z-70 bg-background flex">
        <SideBar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      </div>

      {/* PAGE CONTENT */}
      <main className={`min-h-screen w-full lg:pt-32 bg-grey transition-all duration-300 ${pl}`}>
        {children}
      </main>
    </div>
  );
}

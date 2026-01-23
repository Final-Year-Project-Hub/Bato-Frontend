"use client";

import { ReactNode, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AuthNav from "@/components/ui/AuthNav";
import SideBar from "./SideBar";

type ViewType = "dashboard" | "settings" | "roadmaps" | "chat";

export default function AuthenticatedShell({
  children,
}: {
  children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Use view ONLY for sidebar highlight, NOT for overriding route rendering
  const currentView: ViewType = useMemo(() => {
    if (pathname?.startsWith("/dashboard/my-roadmaps")) return "roadmaps";
    if (pathname?.startsWith("/dashboard/settings")) return "settings";
    if (pathname?.startsWith("/chat")) return "chat";
    return "dashboard";
  }, [pathname]);

  const handleViewChange = (view: ViewType) => {
    if (view === "settings") router.push("/dashboard/settings");
    else if (view === "roadmaps") router.push("/dashboard/my-roadmaps");
    else if (view === "chat") router.push("/chat");
    else router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen">
      {/* TOP NAV */}
      <div
        className={`fixed top-0 left-0 right-0 hidden lg:block transition-all duration-300 z-30 ${
          collapsed ? "lg:pl-16" : "lg:pl-72"
        }`}
      >
        <AuthNav />
      </div>

      {/* SIDEBAR */}
      <div className="fixed top-0 left-0 h-screen z-50">
        <SideBar
          collapsed={collapsed}
          onCollapsedChange={setCollapsed}
          currentView={currentView}
          onViewChange={handleViewChange}
        />
      </div>

      {/* PAGE CONTENT */}
      <main
        className={`min-h-screen w-full bg-grey transition-all duration-300 lg:pt-20 ${
          collapsed ? "lg:pl-16" : "lg:pl-72"
        }`}
      >
        {/* ✅ Always render the actual route */}
        {children}
      </main>
    </div>
  );
}

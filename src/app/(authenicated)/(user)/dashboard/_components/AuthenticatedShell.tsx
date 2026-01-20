"use client";

import { ReactNode, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AuthNav from "@/components/ui/AuthNav";
import SideBar from "./SideBar";
import SettingsView from "../settings/_components/SettingsView";
import RoadmapsPage from "../my-roadmaps/page";

type ViewType = "dashboard" | "settings" | "roadmaps" | "chat";

export default function AuthenticatedShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Determine current view based on pathname
  const getCurrentView = (): ViewType => {
    if (pathname?.includes('/my-roadmaps')) return 'roadmaps';
    if (pathname?.includes('/settings')) return 'settings';
    if (pathname?.includes('/chat')) return 'chat';
    return 'dashboard';
  };

  const currentView = getCurrentView();

  // widths must match your sidebar: w-75 and w-16
  const pl = collapsed ? "lg:pl-16" : "lg:pl-75";

  const handleViewChange = (view: ViewType) => {
    if (view === 'settings') {
      router.push('/dashboard/settings');
    } else if (view === 'roadmaps') {
      router.push('/dashboard/my-roadmaps');
    } else if (view === 'chat') {
      router.push('/chat');
    } else if (view === 'dashboard') {
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* TOP NAV */}
      <div className={`fixed top-0 left-0 right-0 hidden lg:block ${pl} transition-all duration-300 z-30`}>
        <AuthNav />
      </div>

      {/* SIDEBAR */}
      <div className="fixed border-r border-white/25 h-screen top-0 left-0 z-70 bg-background flex">
        <SideBar 
          collapsed={collapsed} 
          onCollapsedChange={setCollapsed}
          currentView={currentView}
          onViewChange={handleViewChange}
        />
      </div>

      {/* PAGE CONTENT */}
      <main className={`min-h-screen w-full bg-grey transition-all duration-300 lg:pt-20 ${pl}`}>
        {currentView === 'settings' ? (
          <SettingsView />
        ) : currentView === 'roadmaps' ? (
          <RoadmapsPage />
        ) : (
          <>
            {/* Dashboard and other views */}
            {children}
          </>
        )}
      </main>
    </div>
  );
}
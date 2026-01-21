"use client";

import { ReactNode, useState } from "react";
import AdminSidebar from "./_components/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  const pl = collapsed ? "lg:pl-16" : "lg:pl-64";

  return (
    <div className="relative min-h-screen bg-grey">
      {/* SIDEBAR */}
      <div className="fixed h-screen top-0 left-0 z-40">
        <AdminSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      </div>

      {/* MAIN CONTENT */}
      <main className={`min-h-screen transition-all duration-300 ${pl}`}>
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
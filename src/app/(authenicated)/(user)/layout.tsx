import AuthNav from "@/components/ui/AuthNav";
import { ReactNode } from "react";

export default async function AuthenticatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  //   const user = await getSignedInUser();

  return (
    <div className="relative min-h-screen ">
      {/* TOP NAV (only when it actually shows) */}
      <div className="fixed top-0 left-0 right-0 hidden lg:block pl-64">
        <AuthNav />
      </div>

      {/* SIDEBAR */}
      <div className="fixed w-64 border-r border-white/25 h-screen top-0 left-0 z-70 hidden lg:block bg-background">
      </div>

      {/* PAGE CONTENT */}
      <main className="min-h-screen w-full lg:pt-32 lg:pl-64 bg-grey">
        {children}
      </main>
    </div>
  );
}

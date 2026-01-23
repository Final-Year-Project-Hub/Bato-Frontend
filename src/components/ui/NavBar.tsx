"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

export interface NavItem {
  name: string;
  href?: string;
  scrollTo?: string; // ID of section to scroll to
}

const NAV_ITEMS: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "Features", scrollTo: "features" },

  { name: "How It Works", scrollTo: "how-it-works" },
];

export default function NavBar() {
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = (item: NavItem) => {
    if (item.scrollTo) {
      const element = document.getElementById(item.scrollTo);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setMobileOpen(false);
  };

  // MOBILE NAV
  if (isMobile) {
    return (
      <nav className="h-16 shadow-sm z-50 relative w-full flex justify-between items-center px-4 py-2 mx-auto bg-background border border-b-border">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="logo"
            width={75}
            height={30}
            className="object-contain w-auto"
          />
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="text-foreground" onClick={() => setMobileOpen(true)}>
            <Menu />
          </button>
        </div>

        {mobileOpen && (
          <>
            <button
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed top-0 right-0 h-full w-full pb-4 bg-background z-50 shadow-xl space-y-4 text-foreground">
              <div className="flex items-center justify-between px-4 h-16 border border-b-border">
                <Link href="/">
                  <Image
                    src="/logo.svg"
                    alt="logo"
                    width={75}
                    height={30}
                    className="object-contain w-auto"
                  />
                </Link>
                <button onClick={() => setMobileOpen(false)}>
                  <X />
                </button>
              </div>

              <div className="px-5 space-y-4">
                {NAV_ITEMS.map((item) =>
                  item.scrollTo ? (
                    <button
                      key={item.name}
                      onClick={() => handleNavClick(item)}
                      className="block w-full text-left rounded-lg font-medium text-foreground"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href ?? "#"}
                      className="block rounded-lg font-medium text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>
            </div>
          </>
        )}
      </nav>
    );
  }

  // DESKTOP NAV
  return (
    <nav className="sticky top-0 z-50 h-18.5 hidden lg:block bg-background border border-b-border">
      <div className="relative my-container w-full h-full flex justify-between items-center">
        {/* Left Logo */}
        <div className="flex items-center">
          <Link href="/" className="block py-2 cursor-pointer">
            <Image src="/logo.svg" alt="logo" width={85} height={60} />
          </Link>
        </div>

        {/* Nav Links */}
        <div className="flex space-x-9">
          {NAV_ITEMS.map((item) =>
            item.scrollTo ? (
              <button
                key={item.name}
                onClick={() => handleNavClick(item)}
                className={cn(
                  "block rounded-lg p-2 text-foreground hover:text-primary"
                )}
              >
                {item.name}
              </button>
            ) : (
              <Link
                key={item.name}
                href={item.href ?? "#"}
                className={cn(
                  "block rounded-lg p-2 text-foreground hover:text-primary"
                )}
              >
                {item.name}
              </Link>
            )
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-6">
          <ThemeToggle />
          <div className="flex gap-6 items-center">
            <Link href="/login" className="text-foreground hover:text-primary">
              Login
            </Link>
            <Link href="/signup">
              <Button className="px-2 py-3 font-semibold">Sign Up</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

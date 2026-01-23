"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function GenerateRoadmapCTA() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleClick = async () => {
    try {
      // Check if logged in 
      const res = await fetch("/api/auth/me", { cache: "no-store" });

      if (res.ok) {
        router.push("/chat");
        return;
      }

      setOpen(true);
    } catch {
      setOpen(true);
    }
  };

  return (
    <>
      <Button onClick={handleClick} className="flex items-center text-base h-9">
        Generate Your Roadmap <ArrowRight className="ml-2" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login required</DialogTitle>
            <DialogDescription>
              Please sign in to generate your roadmap and access chat.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button className="mr-2" variant="outline" onClick={() => setOpen(false)}>
              Not now
            </Button>
            <Button onClick={() => router.push("/login?next=%2Fchat")}>
              Go to login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

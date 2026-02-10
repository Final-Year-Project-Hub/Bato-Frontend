"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle2, Loader2 } from "lucide-react";

interface TopicCompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentPhaseId: string;
  currentTopicId: string;
  currentTopicTitle: string;
  nextTopicTitle?: string;
  onConfirm: (markAsCompleted: boolean) => void;
}

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://bato-backend-a9x8.onrender.com";

export default function TopicCompletionDialog({
  open,
  onOpenChange,
  currentPhaseId,
  currentTopicId,
  currentTopicTitle,
  nextTopicTitle,
  onConfirm,
}: TopicCompletionDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMarkComplete = async () => {
    setIsSubmitting(true);
    try {
      const roadmapId = window.location.pathname.split("/")[2]; // Extract from URL
      
      const response = await fetch(
        `${baseUrl}/api/roadmap/${roadmapId}/progress/complete-topic`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            phaseId: currentPhaseId,
            topicId: currentTopicId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to mark topic as completed");
      }

      console.log("✅ Topic marked as completed");
      onConfirm(true);
    } catch (error) {
      console.error(" Error marking topic as completed:", error);
      // Still navigate even if API fails
      onConfirm(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    onConfirm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-white" />
            Mark as Completed?
          </DialogTitle>
          <DialogDescription className="space-y-2 pt-2">
              Did you complete{" "}
              <br />
              <span className="font-medium text-foreground">
                "{currentTopicTitle}"
              </span>
              ?
            {/* {nextTopicTitle && (
              <span className="text-sm text-muted-foreground">
                <br /> <br />
                Next up: {nextTopicTitle}
              </span>
            )} */}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleSkip}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            No, Skip
          </Button>
          <Button
            onClick={handleMarkComplete}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="mr-1 h-4 w-4" />
                Yes, Mark Complete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
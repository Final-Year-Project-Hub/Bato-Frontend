"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRoadmapNavigation } from "./RoadmapNavigationContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TopicCompletionDialog from "./TopicCompleteDialog";

interface TopicNavigationButtonsProps {
  currentPhaseId: string;
  currentTopicId: string;
  currentTopicTitle: string; // Added for dialog
}

export default function TopicNavigationButtons({
  currentPhaseId,
  currentTopicId,
  currentTopicTitle,
}: TopicNavigationButtonsProps) {
  const router = useRouter();
  const { roadmapData, roadmapId, getTopicNavigation } =
    useRoadmapNavigation();

  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<{
    phaseId: string;
    topicId: string;
  } | null>(null);

  const navigation = getTopicNavigation(currentPhaseId, currentTopicId);

  if (!navigation || !roadmapData) return null;

  const handleNavigate = (phaseId: string, topicId: string) => {
    const goal = roadmapData.goal ?? "";
    router.push(
      `/progresstracker/${roadmapId}/topic/${topicId}?phaseId=${encodeURIComponent(
        phaseId,
      )}&goal=${encodeURIComponent(goal)}&roadmapId=${encodeURIComponent(
        roadmapId,
      )}`,
    );
  };

  const handleNextClick = () => {
    if (!navigation.nextTopic) return;

    // Store the navigation destination
    setPendingNavigation({
      phaseId: navigation.nextTopic.phaseId,
      topicId: navigation.nextTopic.topicId,
    });

    // Show completion dialog
    setShowCompletionDialog(true);
  };

  const handleConfirmCompletion = (wasMarkedComplete: boolean) => {
    setShowCompletionDialog(false);

    // Navigate regardless of whether they marked it complete
    if (pendingNavigation) {
      handleNavigate(pendingNavigation.phaseId, pendingNavigation.topicId);
    }

    setPendingNavigation(null);
  };

  const handlePreviousClick = () => {
    if (!navigation.previousTopic) return;
    handleNavigate(
      navigation.previousTopic.phaseId,
      navigation.previousTopic.topicId,
    );
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4 pt-6 border-t border-border">
        {/* Previous Button */}
        {navigation.previousTopic ? (
          <Button
            variant="outline"
            onClick={handlePreviousClick}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={18} />
            <div className="text-left">
              <div className="">Previous</div>
              {/* <div className="text-sm font-medium line-clamp-1">
                {navigation.previousTopic.topicTitle}
              </div> */}
            </div>
          </Button>
        ) : (
          <div /> // Empty div for spacing
        )}

        {/* Progress Indicator */}
        <div className="text-center text-sm text-muted-foreground">
          {/* <div>
            Phase {navigation.currentPhaseIndex + 1} of{" "}
            {navigation.totalPhases}
          </div>
          <div className="text-xs">
            Topic {navigation.currentTopicIndex + 1} of{" "}
            {navigation.totalTopicsInPhase}
          </div> */}
        </div>

        {/* Next Button */}
        {navigation.nextTopic ? (
          <Button
            onClick={handleNextClick}
            className="flex items-center gap-2"
          >
            <div className="text-right">
              <div className="">Next</div>
              {/* <div className="text-sm font-medium line-clamp-1">
                {navigation.nextTopic.topicTitle}
              </div> */}
            </div>
            <ChevronRight size={18} />
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => router.push(`/progresstracker/${roadmapId}`)}
            className="flex items-center gap-2"
          >
            <div className="text-right">
              <div className="text-sm font-medium">Complete!</div>
              <div className="text-xs text-muted-foreground">
                Back to overview
              </div>
            </div>
          </Button>
        )}
      </div>

      {/* Completion Dialog */}
      <TopicCompletionDialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
        currentPhaseId={currentPhaseId}
        currentTopicId={currentTopicId}
        currentTopicTitle={currentTopicTitle}
        nextTopicTitle={navigation.nextTopic?.topicTitle}
        onConfirm={handleConfirmCompletion}
      />
    </>
  );
}
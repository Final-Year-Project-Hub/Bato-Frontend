"use client";

import { createContext, useContext, useMemo } from "react";
import { RoadmapResponse, RoadmapPhase } from "../types";

interface TopicNavigation {
  currentPhaseId: string;
  currentTopicId: string;
  nextTopic: {
    phaseId: string;
    topicId: string;
    phaseTitle: string;
    topicTitle: string;
  } | null;
  previousTopic: {
    phaseId: string;
    topicId: string;
    phaseTitle: string;
    topicTitle: string;
  } | null;
  currentPhaseIndex: number;
  currentTopicIndex: number;
  totalPhases: number;
  totalTopicsInPhase: number;
}

interface RoadmapNavigationContextValue {
  roadmapData: RoadmapResponse | null;
  roadmapId: string;
  getTopicNavigation: (
    phaseId: string,
    topicId: string,
  ) => TopicNavigation | null;
}

const RoadmapNavigationContext =
  createContext<RoadmapNavigationContextValue | null>(null);

export function RoadmapNavigationProvider({
  children,
  roadmapData,
  roadmapId,
}: {
  children: React.ReactNode;
  roadmapData: RoadmapResponse | null;
  roadmapId: string;
}) {
  const getTopicNavigation = useMemo(() => {
    return (phaseId: string, topicId: string): TopicNavigation | null => {
      if (!roadmapData?.phases) return null;

      const phases = roadmapData.phases;
      const currentPhaseIndex = phases.findIndex((p) => p.id === phaseId);

      if (currentPhaseIndex === -1) return null;

      const currentPhase = phases[currentPhaseIndex];
      const currentTopicIndex = currentPhase.topics.findIndex(
        (t) => t.id === topicId,
      );

      if (currentTopicIndex === -1) return null;

      // Calculate next topic
      let nextTopic: TopicNavigation["nextTopic"] = null;
      if (currentTopicIndex < currentPhase.topics.length - 1) {
        // Next topic in same phase
        const nextTopicData = currentPhase.topics[currentTopicIndex + 1];
        nextTopic = {
          phaseId: currentPhase.id,
          topicId: nextTopicData.id,
          phaseTitle: currentPhase.title,
          topicTitle: nextTopicData.title,
        };
      } else if (currentPhaseIndex < phases.length - 1) {
        // First topic of next phase
        const nextPhase = phases[currentPhaseIndex + 1];
        if (nextPhase.topics.length > 0) {
          nextTopic = {
            phaseId: nextPhase.id,
            topicId: nextPhase.topics[0].id,
            phaseTitle: nextPhase.title,
            topicTitle: nextPhase.topics[0].title,
          };
        }
      }

      // Calculate previous topic
      let previousTopic: TopicNavigation["previousTopic"] = null;
      if (currentTopicIndex > 0) {
        // Previous topic in same phase
        const prevTopicData = currentPhase.topics[currentTopicIndex - 1];
        previousTopic = {
          phaseId: currentPhase.id,
          topicId: prevTopicData.id,
          phaseTitle: currentPhase.title,
          topicTitle: prevTopicData.title,
        };
      } else if (currentPhaseIndex > 0) {
        // Last topic of previous phase
        const prevPhase = phases[currentPhaseIndex - 1];
        if (prevPhase.topics.length > 0) {
          const lastTopic = prevPhase.topics[prevPhase.topics.length - 1];
          previousTopic = {
            phaseId: prevPhase.id,
            topicId: lastTopic.id,
            phaseTitle: prevPhase.title,
            topicTitle: lastTopic.title,
          };
        }
      }

      return {
        currentPhaseId: phaseId,
        currentTopicId: topicId,
        nextTopic,
        previousTopic,
        currentPhaseIndex,
        currentTopicIndex,
        totalPhases: phases.length,
        totalTopicsInPhase: currentPhase.topics.length,
      };
    };
  }, [roadmapData]);

  const value = useMemo(
    () => ({
      roadmapData,
      roadmapId,
      getTopicNavigation,
    }),
    [roadmapData, roadmapId, getTopicNavigation],
  );

  return (
    <RoadmapNavigationContext.Provider value={value}>
      {children}
    </RoadmapNavigationContext.Provider>
  );
}

export function useRoadmapNavigation() {
  const context = useContext(RoadmapNavigationContext);
  if (!context) {
    throw new Error(
      "useRoadmapNavigation must be used within RoadmapNavigationProvider",
    );
  }
  return context;
}
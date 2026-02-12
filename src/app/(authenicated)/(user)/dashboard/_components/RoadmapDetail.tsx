"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Clock,
  Target,
  BookOpen,
  Zap,
  MoveRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Subtopic = {
  title: string;
  description: string;
  estimated_hours: number;
  doc_link?: string;
};

type Topic = {
  title: string;
  description: string;
  estimated_hours: number;
  doc_link?: string;
  subtopics?: Subtopic[];
};

type Phase = {
  title: string;
  description: string;
  estimated_hours: number;
  topics: Topic[];
};

type RoadmapData = {
  goal: string;
  intent: string;
  proficiency: string;
  phases: Phase[];
  total_estimated_hours: number;
  key_technologies?: string[];
  prerequisites?: string[];
  next_steps?: string[];
  isSelected?: boolean;
};

type RoadmapDetailProps = {
  data: RoadmapData;
  roadmapId: string;
  className?: string;
};

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://bato-backend-a9x8.onrender.com";

export default function RoadmapDetail({
  data,
  roadmapId,
  className = "",
}: RoadmapDetailProps) {
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>(
    () => {
      // Expand first phase by default
      return { 0: true };
    },
  );
  const [selecting, setSelecting] = useState(false);

  const router = useRouter();
  const handleSelectRoadmap = async () => {
    if (selecting) return;

    try {
      setSelecting(true);

      const res = await fetch(`${baseUrl}/api/roadmap/${roadmapId}/select`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Roadmap selected successfully");
        router.push(`/progresstracker/${roadmapId}`);
        return;
      }

      const msg = await res.text().catch(() => "");
      toast.error(msg || "Failed to select roadmap");
    } catch {
      toast.error("Error selecting roadmap");
    } finally {
      setSelecting(false);
    }
  };

  const togglePhase = (index: number) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<number, boolean> = {};
    data.phases.forEach((_, idx) => {
      allExpanded[idx] = true;
    });
    setExpandedPhases(allExpanded);
  };

  const collapseAll = () => {
    setExpandedPhases({});
  };
console.log("isSelected",data?.isSelected)
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="bg-primary/10 p-5 rounded-lg border-l-4 border-primary">
        <h2 className="text-2xl font-bold text-foreground mb-3">{data.goal}</h2>
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-3 text-sm ">
            <span className="bg-muted px-3 py-1.5 rounded-full text-foreground/80 flex items-center gap-2 shrink-0">
              <Target size={14} />
              {data.intent}
            </span>
            <span className="bg-muted px-3 py-1.5 rounded-full text-foreground/80 flex items-center gap-2 shrink-0">
              <BookOpen size={14} />
              {data.proficiency}
            </span>
            <span className="bg-primary/30 px-3 py-1.5 rounded-full text-white flex items-center gap-2 shrink-0">
              <Clock size={14} />
              {data.total_estimated_hours} hours total
            </span>
          </div>
          {data.isSelected  ? (
            <Button>Progress </Button>
          ) : (
            <Button
              className="shrink-0 text-lg"
              disabled={selecting}
              onClick={handleSelectRoadmap}
            >
              {selecting ? (
                <>
                  Tracking <Loader2 className="animate-spin" />
                </>
              ) : (
                <>
                  Track <MoveRight />
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Key Technologies */}
      {data.key_technologies && data.key_technologies.length > 0 && (
        <div className="bg-card p-4 rounded-lg border border-border">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <Zap size={14} />
            Key Technologies
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.key_technologies.map((tech, idx) => (
              <span
                key={idx}
                className="bg-blue-500/20 text-blue-400 dark:text-blue-400 px-3 py-1.5 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Prerequisites */}
      {data.prerequisites && data.prerequisites.length > 0 && (
        <div className="bg-card p-4 rounded-lg border border-border">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">
            Prerequisites
          </h3>
          <ul className="space-y-2">
            {data.prerequisites.map((prereq, idx) => (
              <li
                key={idx}
                className="text-sm text-foreground/80 flex items-start gap-2"
              >
                <span className="text-primary mt-0.5">•</span>
                {prereq}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Phases Header with Expand/Collapse */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Learning Phases ({data.phases.length})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg bg-muted hover:bg-accent transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg bg-muted hover:bg-accent transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-4">
        {data.phases.map((phase, phaseIdx) => (
          <div
            key={phaseIdx}
            className="bg-card rounded-lg border border-border hover:border-primary/50 transition-colors overflow-hidden"
          >
            {/* Phase Header - Clickable */}
            <button
              onClick={() => togglePhase(phaseIdx)}
              className="w-full bg-muted/50 p-4 border-b border-border text-left hover:bg-accent transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-primary font-bold text-lg">
                      {String(phaseIdx + 1).padStart(2, "0")}
                    </span>
                    <h4 className="text-lg font-bold text-foreground">
                      {phase.title}
                    </h4>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 ml-9">
                    {phase.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full whitespace-nowrap">
                    {phase.estimated_hours} hrs
                  </span>
                  {expandedPhases[phaseIdx] ? (
                    <ChevronUp size={20} className="text-muted-foreground" />
                  ) : (
                    <ChevronDown size={20} className="text-muted-foreground" />
                  )}
                </div>
              </div>
            </button>

            {/* Phase Content - Expandable */}
            {expandedPhases[phaseIdx] && (
              <div className="p-4 space-y-4">
                {phase.topics.map((topic, topicIdx) => (
                  <div key={topicIdx} className="space-y-3">
                    {/* Topic */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold text-foreground flex items-center gap-2">
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                          {topic.title}
                        </h5>
                        <p className="text-xs text-muted-foreground mt-1.5 ml-4">
                          {topic.description}
                        </p>
                        {topic.doc_link && (
                          <a
                            href={topic.doc_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-400 hover:text-blue-300 mt-1.5 ml-4 inline-flex items-center gap-1 transition-colors"
                          >
                            <ExternalLink size={12} />
                            Documentation
                          </a>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2 bg-muted px-2 py-1 rounded">
                        {topic.estimated_hours} hrs
                      </span>
                    </div>

                    {/* Subtopics */}
                    {topic.subtopics && topic.subtopics.length > 0 && (
                      <div className="ml-6 pl-4 border-l-2 border-border space-y-3">
                        {topic.subtopics.map((subtopic, subIdx) => (
                          <div
                            key={subIdx}
                            className="flex items-start justify-between"
                          >
                            <div className="flex-1">
                              <h6 className="text-xs font-medium text-foreground/80">
                                {subtopic.title}
                              </h6>
                              <p className="text-xs text-muted-foreground mt-1">
                                {subtopic.description}
                              </p>
                              {subtopic.doc_link && (
                                <a
                                  href={subtopic.doc_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-400 hover:text-blue-300 mt-1 inline-flex items-center gap-1 transition-colors"
                                >
                                  <ExternalLink size={10} />
                                  Documentation
                                </a>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground/70 whitespace-nowrap ml-2">
                              {subtopic.estimated_hours} hrs
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Divider between topics */}
                    {topicIdx < phase.topics.length - 1 && (
                      <div className="border-b border-border/50 my-2"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Next Steps */}
      {data.next_steps && data.next_steps.length > 0 && (
        <div className="bg-green-500/10 p-4 rounded-lg border-l-4 border-green-500">
          <h3 className="text-sm font-semibold text-green-400 mb-3">
            Next Steps
          </h3>
          <ul className="space-y-2">
            {data.next_steps.map((step, idx) => (
              <li
                key={idx}
                className="text-sm text-foreground/80 flex items-start gap-2"
              >
                <span className="text-green-400 mt-0.5">•</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Progress Summary */}
      <div className="bg-card p-4 rounded-lg border border-border">
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">
          Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {data.phases.length}
            </div>
            <div className="text-xs text-muted-foreground">Phases</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {data.phases.reduce((acc, p) => acc + p.topics.length, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Topics</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {data.phases.reduce(
                (acc, p) =>
                  acc +
                  p.topics.reduce((a, t) => a + (t.subtopics?.length || 0), 0),
                0,
              )}
            </div>
            <div className="text-xs text-muted-foreground">Subtopics</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary">
              {data.total_estimated_hours}
            </div>
            <div className="text-xs text-muted-foreground">Total Hours</div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Clock, Target, BookOpen, Zap } from "lucide-react";

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
};

type RoadmapDetailProps = {
  data: RoadmapData;
  className?: string;
};

export default function RoadmapDetail({ data, className = "" }: RoadmapDetailProps) {
  const [expandedPhases, setExpandedPhases] = useState<Record<number, boolean>>(() => {
    // Expand first phase by default
    return { 0: true };
  });

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

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#E96559]/20 to-transparent p-5 rounded-lg border-l-4 border-[#E96559]">
        <h2 className="text-2xl font-bold text-white mb-3">{data.goal}</h2>
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="bg-white/10 px-3 py-1.5 rounded-full text-white/80 flex items-center gap-2">
            <Target size={14} />
            {data.intent}
          </span>
          <span className="bg-white/10 px-3 py-1.5 rounded-full text-white/80 flex items-center gap-2">
            <BookOpen size={14} />
            {data.proficiency}
          </span>
          <span className="bg-[#E96559]/30 px-3 py-1.5 rounded-full text-[#E96559] flex items-center gap-2">
            <Clock size={14} />
            {data.total_estimated_hours} hours total
          </span>
        </div>
      </div>

      {/* Key Technologies */}
      {data.key_technologies && data.key_technologies.length > 0 && (
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h3 className="text-sm font-semibold text-white/60 mb-3 flex items-center gap-2">
            <Zap size={14} />
            Key Technologies
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.key_technologies.map((tech, idx) => (
              <span
                key={idx}
                className="bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-full text-sm font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Prerequisites */}
      {data.prerequisites && data.prerequisites.length > 0 && (
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <h3 className="text-sm font-semibold text-white/60 mb-3">Prerequisites</h3>
          <ul className="space-y-2">
            {data.prerequisites.map((prereq, idx) => (
              <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                <span className="text-[#E96559] mt-0.5">•</span>
                {prereq}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Phases Header with Expand/Collapse */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Learning Phases ({data.phases.length})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="text-xs text-white/60 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="text-xs text-white/60 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
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
            className="bg-white/5 rounded-lg border border-white/10 hover:border-[#E96559]/50 transition-colors overflow-hidden"
          >
            {/* Phase Header - Clickable */}
            <button
              onClick={() => togglePhase(phaseIdx)}
              className="w-full bg-white/5 p-4 border-b border-white/10 text-left hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[#E96559] font-bold text-lg">
                      {String(phaseIdx + 1).padStart(2, "0")}
                    </span>
                    <h4 className="text-lg font-bold text-white">{phase.title}</h4>
                  </div>
                  <p className="text-sm text-white/70 mt-2 ml-9">{phase.description}</p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <span className="text-xs bg-[#E96559]/20 text-[#E96559] px-2 py-1 rounded-full whitespace-nowrap">
                    {phase.estimated_hours} hrs
                  </span>
                  {expandedPhases[phaseIdx] ? (
                    <ChevronUp size={20} className="text-white/60" />
                  ) : (
                    <ChevronDown size={20} className="text-white/60" />
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
                        <h5 className="text-sm font-semibold text-white flex items-center gap-2">
                          <span className="w-2 h-2 bg-[#E96559] rounded-full"></span>
                          {topic.title}
                        </h5>
                        <p className="text-xs text-white/60 mt-1.5 ml-4">
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
                      <span className="text-xs text-white/50 whitespace-nowrap ml-2 bg-white/5 px-2 py-1 rounded">
                        {topic.estimated_hours} hrs
                      </span>
                    </div>

                    {/* Subtopics */}
                    {topic.subtopics && topic.subtopics.length > 0 && (
                      <div className="ml-6 pl-4 border-l-2 border-white/10 space-y-3">
                        {topic.subtopics.map((subtopic, subIdx) => (
                          <div key={subIdx} className="flex items-start justify-between">
                            <div className="flex-1">
                              <h6 className="text-xs font-medium text-white/80">
                                {subtopic.title}
                              </h6>
                              <p className="text-xs text-white/50 mt-1">
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
                            <span className="text-xs text-white/40 whitespace-nowrap ml-2">
                              {subtopic.estimated_hours} hrs
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Divider between topics */}
                    {topicIdx < phase.topics.length - 1 && (
                      <div className="border-b border-white/5 my-2"></div>
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
        <div className="bg-gradient-to-r from-green-500/10 to-transparent p-4 rounded-lg border-l-4 border-green-500">
          <h3 className="text-sm font-semibold text-green-400 mb-3">Next Steps</h3>
          <ul className="space-y-2">
            {data.next_steps.map((step, idx) => (
              <li key={idx} className="text-sm text-white/80 flex items-start gap-2">
                <span className="text-green-400 mt-0.5">•</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Progress Summary */}
      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
        <h3 className="text-sm font-semibold text-white/60 mb-3">Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#E96559]">{data.phases.length}</div>
            <div className="text-xs text-white/60">Phases</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#E96559]">
              {data.phases.reduce((acc, p) => acc + p.topics.length, 0)}
            </div>
            <div className="text-xs text-white/60">Topics</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#E96559]">
              {data.phases.reduce(
                (acc, p) =>
                  acc + p.topics.reduce((a, t) => a + (t.subtopics?.length || 0), 0),
                0
              )}
            </div>
            <div className="text-xs text-white/60">Subtopics</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#E96559]">
              {data.total_estimated_hours}
            </div>
            <div className="text-xs text-white/60">Total Hours</div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { BeautifiedIntroduction } from "./BeautifiedIntro";
import TopicNavigationButtons from "./TopicNavigationButtons";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuizModal from "./QuizModal";
import { useState } from "react";

export type LessonResponse = {
  title: string;
  phase_number: number;
  phase_title: string;

  sections: {
    introduction: { markdown: string };

    detailed_core_concepts: {
      title: string;
      markdown: string;
      key_points: string[];
    }[];

    code_examples: {
      title: string;
      language: string;
      code: string;
      explanation_markdown: string;
    }[];

    real_world_examples: { title: string; markdown: string }[];

    hypothetical_scenario: { title: string; markdown: string };

    key_characteristics: string[];
  };

  why_important: string;
  key_concepts: string[];
  learning_objectives: string[];

  learning_resources: {
    title: string;
    type: string;
    url: string | null;
    estimated_time: string;
  }[];

  practice_exercises: {
    title: string;
    difficulty: string;
    description: string;
    estimated_time: string;
  }[];

  related_topics: string[];
  estimated_hours: number;
  difficulty_level: string;
  doc_links: string[];
};

export function Md({ children }: { children: string }) {
  return (
    <section
      className="
        prose prose-invert max-w-none
        prose-h1:font-extrabold prose-h2:font-bold prose-h3:font-semibold
        prose-h1:mt-8 prose-h1:mb-4 prose-h2:mt-8 prose-h2:mb-3 prose-h3:mt-6 prose-h3:mb-2
        prose-p:leading-relaxed prose-p:my-4
        prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-4
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {children}
      </ReactMarkdown>
    </section>
  );
}

export interface LessonPageProps {
  lesson: LessonResponse;
  currentPhaseId: string;
  currentTopicId: string;
  currentTopicTitle: string;
  roadmapId: string;
}

export default function LessonPage({
  lesson,
  currentPhaseId,
  currentTopicId,
  currentTopicTitle,
  roadmapId,
}: LessonPageProps) {
  const s = lesson.sections;
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <header className="space-y-2">
        <div className="flex justify-between">
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          <Button onClick={() => setIsQuizOpen(true)} className="gap-2">
            <Trophy size={16} />
            Take Quiz
          </Button>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span>
              Phase {lesson.phase_number}: {lesson.phase_title}
            </span>
            <span>• {lesson.difficulty_level}</span>
            <span>• {lesson.estimated_hours} hours</span>
          </div>
        </div>
      </header>

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        roadmapId={roadmapId}
        phaseId={currentPhaseId}
        topicId={currentTopicId}
        topicTitle={lesson.title}
      />

      {/* Introduction */}
      {s?.introduction?.markdown && (
        <BeautifiedIntroduction
          markdown={s.introduction.markdown}
          onNextTopic={(t) => console.log("go to", t)}
        />
      )}
      {/* Detailed Core Concepts */}
      {!!s?.detailed_core_concepts?.length && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Detailed Core Concepts</h2>

          {s.detailed_core_concepts.map((c) => (
            <div key={c.title} className="rounded-xl border p-5 space-y-4">
              <div className="text-lg font-semibold">{c.title}</div>

              {c.markdown && <Md>{c.markdown}</Md>}

              {!!c.key_points?.length && (
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  {c.key_points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Code Examples */}
      {!!s?.code_examples?.length && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Code Examples</h2>

          {s.code_examples.map((ex) => (
            <div key={ex.title} className="rounded-xl border p-5 space-y-4">
              <div className="text-lg font-semibold">{ex.title}</div>

              <Md>{`~~~${ex.language}\n${ex.code}\n~~~`}</Md>

              {ex.explanation_markdown && <Md>{ex.explanation_markdown}</Md>}
            </div>
          ))}
        </section>
      )}

      {/* Real-world Examples */}
      {!!s?.real_world_examples?.length && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Real-World Examples</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {s.real_world_examples.map((rw) => (
              <div key={rw.title} className="rounded-xl border p-5 space-y-3">
                <div className="font-semibold">{rw.title}</div>
                {rw.markdown && <Md>{rw.markdown}</Md>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Hypothetical Scenario */}
      {s?.hypothetical_scenario?.markdown && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            {s.hypothetical_scenario.title || "Hypothetical Scenario"}
          </h2>
          <Md>{s.hypothetical_scenario.markdown}</Md>
        </section>
      )}

      {/* Key Characteristics */}
      {!!s?.key_characteristics?.length && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Key Characteristics</h2>
          <div className="flex flex-wrap gap-2">
            {s.key_characteristics.map((c) => (
              <span
                key={c}
                className="px-3 py-1 rounded-full bg-secondary text-black text-sm"
              >
                {c}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Key Concepts */}
      {!!lesson.key_concepts?.length && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Key Concepts</h2>
          <div className="flex flex-wrap gap-2">
            {lesson.key_concepts.map((c) => (
              <span
                key={c}
                className="px-3 py-1 rounded-full bg-secondary text-black text-sm"
              >
                {c}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Why Important */}
      {lesson.why_important && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Why This Matters</h2>
          <p className="text-muted-foreground">{lesson.why_important}</p>
        </section>
      )}

      {/* Learning Objectives */}
      {!!lesson.learning_objectives?.length && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Learning Objectives</h2>
          <ul className="list-disc pl-6 space-y-1">
            {lesson.learning_objectives.map((obj) => (
              <li key={obj}>{obj}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Learning Resources */}
      {!!lesson.learning_resources?.length && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Learning Resources</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {lesson.learning_resources.map((res) => (
              <a
                key={`${res.title}-${res.url ?? "null"}`}
                href={res.url ?? undefined}
                target={res.url ? "_blank" : undefined}
                rel={res.url ? "noreferrer" : undefined}
                className={`block p-4 rounded-lg border transition ${
                  res.url ? "hover:bg-accent" : "opacity-70 cursor-default"
                }`}
                onClick={(e) => {
                  if (!res.url) e.preventDefault();
                }}
              >
                <div className="font-medium">{res.title}</div>
                <div className="text-sm text-muted-foreground">
                  {res.type} • {res.estimated_time}
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Practice Exercises */}
      {!!lesson.practice_exercises?.length && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Practice Exercises</h2>
          <div className="space-y-4">
            {lesson.practice_exercises.map((ex) => (
              <div key={ex.title} className="p-4 rounded-lg border">
                <div className="font-medium">{ex.title}</div>
                <div className="text-sm text-muted-foreground mb-2">
                  {ex.difficulty} • {ex.estimated_time}
                </div>
                <p className="text-sm">{ex.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Topics */}
      {!!lesson.related_topics?.length && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Related Topics</h2>
          <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
            {lesson.related_topics.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Doc Links */}
      {!!lesson.doc_links?.length && (
        <footer className="pt-6 border-t space-y-3">
          <div className="text-sm text-muted-foreground">Doc Links</div>
          <div className="grid gap-2">
            {lesson.doc_links.map((u) => (
              <a
                key={u}
                href={u}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-400 hover:underline break-all"
              >
                {u}
              </a>
            ))}
          </div>
        </footer>
      )}
      <TopicNavigationButtons
        currentPhaseId={currentPhaseId}
        currentTopicId={currentTopicId}
        currentTopicTitle={currentTopicTitle}
      />
    </div>
  );
}

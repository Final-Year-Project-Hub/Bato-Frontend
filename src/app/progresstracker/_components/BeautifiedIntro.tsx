import React, { useMemo } from "react";
import { Md } from "./LessonPage";

type Block = { title: string; body: string };

function splitByH2(markdown: string): Block[] {
  // splits on lines like: ## Something
  const parts = markdown.split(/\n##\s+/g);

  // First part may start with "## Introduction"
  // Normalize so every part becomes {title, body}
  const blocks: Block[] = [];

  for (let i = 0; i < parts.length; i++) {
    const chunk = parts[i].trim();
    if (!chunk) continue;

    if (i === 0 && chunk.startsWith("## ")) {
      // if it still includes ## (edge case)
      const cleaned = chunk.replace(/^##\s+/, "");
      const [title, ...rest] = cleaned.split("\n");
      blocks.push({ title: title.trim(), body: rest.join("\n").trim() });
      continue;
    }

    if (i === 0 && !chunk.startsWith("## ")) {
      // first chunk should be "Introduction\n\n...."
      const [title, ...rest] = chunk.split("\n");
      blocks.push({ title: title.trim(), body: rest.join("\n").trim() });
      continue;
    }

    // normal: "Core Philosophy\n\n...."
    const [title, ...rest] = chunk.split("\n");
    blocks.push({ title: title.trim(), body: rest.join("\n").trim() });
  }

  return blocks;
}

function extractMeta(blocks: Block[]) {
  const getSingleBullet = (title: string) => {
    const b = blocks.find((x) => x.title.toLowerCase() === title.toLowerCase());
    if (!b) return null;
    const m = b.body.match(/\*\s*(.+)/); // first bullet
    return m?.[1]?.trim() ?? null;
  };

  return {
    nextTopic: getSingleBullet("Next Topic"),
    hours: getSingleBullet("Estimated Hours"),
    difficulty: getSingleBullet("Difficulty Level"),
  };
}

export function BeautifiedIntroduction({
  markdown,
  onNextTopic,
}: {
  markdown: string;
  onNextTopic?: (topic: string) => void;
}) {
  const blocks = useMemo(() => splitByH2(markdown), [markdown]);
  const meta = useMemo(() => extractMeta(blocks), [blocks]);

  const visibleBlocks = blocks.filter(
    (b) =>
      !["Estimated Hours", "Difficulty Level", "Next Topic"].includes(b.title),
  );

  const intro =
    visibleBlocks.find((b) => b.title === "Introduction") ?? visibleBlocks[0];
  const rest = visibleBlocks.filter((b) => b !== intro);

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {meta.hours && (
            <span className="rounded-full border px-3 py-1 text-sm font-medium">
               {meta.hours}
            </span>
          )}
          {meta.difficulty && (
            <span className="rounded-full border px-3 py-1 text-sm font-medium">
               {meta.difficulty}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight">{intro.title}</h1>

        {intro.body && (
          <div className="prose max-w-none">
            <Md>{intro.body}</Md>
          </div>
        )}
      </div>

      {/* CONTENT BLOCKS */}
      <div className="space-y-7">
        {rest.map((b) => (
          <div key={b.title} className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">{b.title}</h2>
            <div className="prose max-w-none">
              <Md>{b.body}</Md>
            </div>
          </div>
        ))}
      </div>

      {/* NEXT TOPIC CTA */}
      {meta.nextTopic && (
        <button
          type="button"
          onClick={() => onNextTopic?.(meta.nextTopic!)}
          className="w-full rounded-xl border px-4 py-3 text-left hover:bg-muted/40 transition"
        >
          <div className="text-sm opacity-70">Next topic</div>
          <div className="font-semibold">→ {meta.nextTopic}</div>
        </button>
      )}
    </div>
  );
}

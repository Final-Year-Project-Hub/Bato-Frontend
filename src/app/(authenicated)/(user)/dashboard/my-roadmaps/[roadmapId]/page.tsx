import Link from "next/link";
import RoadmapDetailClient from "../../_components/RoadmapDetailClient";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ roadmapId: string }>;
}) {
  const { roadmapId } = await params;
  return (
    <main className="min-h-screen bg-grey p-4 sm:p-8">
      <div className="max-w-5xl mx-auto flex flex-col">
        <RoadmapDetailClient roadmapId={roadmapId} />
      </div>
    </main>
  );
}

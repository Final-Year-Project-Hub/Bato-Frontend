"use client";

import { useEffect, useState } from "react";
import RoadmapDetail from "./RoadmapDetail";
import { useRouter } from "next/navigation";
import CustomSkeleton from "@/components/ui/CustomSkeleton";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://bato-backend-a9x8.onrender.com";

export default function RoadmapDetailClient({
  roadmapId,
}: {
  roadmapId: string;
}) {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  const [pageLoading, setPageLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setPageLoading(true);
        setErr(null);

        const res = await fetch(`${baseUrl}/api/roadmap/${roadmapId}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) {
          const msg = await res.text().catch(() => "");
          throw new Error(`${res.status} ${res.statusText} ${msg}`);
        }

        const json = await res.json();
        const roadmapData = json?.roadmapData;

        if (!roadmapData?.phases) {
          console.log("Unexpected roadmap response:", json);
          throw new Error("roadmapData missing or invalid");
        }
        const merged = {
          ...roadmapData,
          isSelected: Boolean(json?.isSelected),
        };

        if (!cancelled) setData(roadmapData);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Failed to load roadmap");
      } finally {
        if (!cancelled) setPageLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [roadmapId]);

  if (pageLoading) {
    return <CustomSkeleton />;
  }

  if (err)
    return <div className="text-red-400 dark:text-red-500">Error: {err}</div>;
  if (!data)
    return <div className="text-muted-foreground">No roadmap found.</div>;

  return (
    <>
      <RoadmapDetail data={data} roadmapId={roadmapId} />
    </>
  );
}

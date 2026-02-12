import ProgressPage from "../_components/ProgressPage";

export default async function ProgresssPage({
  params,
}: {
  params: Promise<{ roadmapId: string }>;
}) {
  const { roadmapId } = await params;
  
  // ProgressShell already provides the layout, just render ProgressPage
  return <ProgressPage roadmapId={roadmapId} />;
}
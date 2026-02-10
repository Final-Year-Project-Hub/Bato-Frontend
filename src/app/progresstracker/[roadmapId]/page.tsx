import ProgressPage from "../_components/ProgressPage";

export default async function ProgresssPage({
  params,
}: {
  params: Promise<{ roadmapId: string }>;
}) {
  const { roadmapId } = await params;
  return (
    <main className="">
      <div className="">
        <ProgressPage roadmapId={roadmapId} />
      </div>
    </main>
  );
}

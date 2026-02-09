import TopicClient from "@/app/progresstracker/_components/TopicClient";

export default async function TopicPage({
  params,
}: {
  params: Promise<{ roadmapId: string; topicId: string }>;
}) {
  const { roadmapId, topicId } = await params;
  return <TopicClient roadmapId={roadmapId} topicId={topicId} />;
}

import ProgressShell from "../_components/ProgressShell";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ roadmapId: string }>;
}) {
  const { roadmapId } = await params;
  return <ProgressShell roadmapId={roadmapId}>{children}</ProgressShell>;
}
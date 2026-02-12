// types/user.ts (ya same file ma)
export type ApiUser = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean; // ← string | null hoina, boolean ho
  image: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  roadmaps: Array<{
    id: string;
    userId: string;
    chatSessionId: string;
    title: string;
    goal: string;
    intent: string;
    proFiciency: string;
    roadmapData: Record<string, unknown>;
    message: string;
    isSelected: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
};

export type User = {
  id: string; // number bata string ma change garau
  name: string;
  email: string;
  roadmaps: number;
  joined: string;
  status: "Verified" | "Not Verified";
  image: string | null; // Add this for avatar
};
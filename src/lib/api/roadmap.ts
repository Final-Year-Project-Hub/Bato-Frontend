export const getRoadmapById = async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/roadmap/${id}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  return data;
};

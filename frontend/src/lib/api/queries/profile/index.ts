import { useQuery } from "@tanstack/react-query";

export const useProfileQuery = (userId: number) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const res = await fetch(`http://127.0.0.1:8000/api/profile/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch profile stats");
      return res.json();
    },
  });
};

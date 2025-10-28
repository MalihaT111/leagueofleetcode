import { useQuery } from "@tanstack/react-query";

export const useLeaderboardQuery = () => {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: fetchLeaderboard,
  });
};

async function fetchLeaderboard() {
  // ✅ use your real FastAPI route — note the prefix /api/users/leaderboard
  const response = await fetch("http://127.0.0.1:8000/api/leaderboard", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
  }

  return response.json();
}

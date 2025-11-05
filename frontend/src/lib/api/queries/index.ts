import { useQuery } from "@tanstack/react-query";

// Match result interfaces
export interface MatchResultData {
  match_id: number;
  winner: {
    id: number;
    username: string;
    elo: number;
    runtime: number; // in milliseconds
    memory: number; // in MB
  };
  loser: {
    id: number;
    username: string;
    elo: number;
    runtime: number; // in milliseconds
    memory: number; // in MB
  };
  problem: string; // problem slug
  match_duration: number; // in seconds
  elo_change: number;
}

export const useMatchResults = (matchId: number) => {
  return useQuery({
    queryKey: ["results", matchId],
    queryFn: () => fetchMatchResults(matchId),
    enabled: !!matchId,
    retry: false,
  });
};

async function fetchMatchResults(matchId: number): Promise<MatchResultData> {
  const response = await fetch(
    `http://127.0.0.1:8000/matchmaking/result/${matchId}`,
    {
      method: "GET",
    },
  );

  if (response.status === 404) {
    throw new Error("Match not found");
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch match result: ${response.statusText}`);
  }

  return response.json();
}

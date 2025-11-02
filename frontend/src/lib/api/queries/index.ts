import { useQuery } from "@tanstack/react-query";

// Match result interfaces
export interface MatchResultData {
  match_id: number;
  winner: {
    id: number;
    username: string;
    elo_before: number;
    elo_after: number;
    elo_change: number;
    runtime: number; // in milliseconds
    memory: number; // in MB
  };
  loser: {
    id: number;
    username: string;
    elo_before: number;
    elo_after: number;
    elo_change: number;
    runtime: number; // in milliseconds
    memory: number; // in MB
  };
  problem: {
    slug: string;
    title: string;
    url: string;
  };
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
    `http://localhost:8000/api/match-result/${matchId}`,
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

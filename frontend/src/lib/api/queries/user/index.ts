import { User } from "@/utils/auth";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const usePersonalUserQuery = (): UseQueryResult<User, Error> => {
  return useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: fetchPersonalUser,
  });
};

async function fetchPersonalUser(): Promise<User> {
  const response = await fetch("http://127.0.0.1:8000/me", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch leaderboard: ${response.statusText}`);
  }

  return response.json() as Promise<User>;
}

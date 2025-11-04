import { useMutation, useQuery } from "@tanstack/react-query";
import { joinQueue, leaveQueue, getMatchStatus, submitSolution, getRecentUserSubmission } from "../matchmaking";

export const useJoinQueue = () => {
  return useMutation({
    mutationFn: (userId: number) => joinQueue(userId),
  });
};

export const useLeaveQueue = () => {
  return useMutation({
    mutationFn: (userId: number) => leaveQueue(userId),
  });
};

export const useMatchStatus = (userId: number, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["matchStatus", userId],
    queryFn: () => getMatchStatus(userId),
    enabled: enabled, // Only run when enabled
    refetchInterval: enabled ? 2000 : false, // Poll every 2 seconds when enabled
    refetchIntervalInBackground: true,
  });
};

export const useSubmitSolution = () => {
  return useMutation({
    mutationFn: ({ matchId, userId }: { matchId: number; userId: number }) => 
      submitSolution(matchId, userId),
  });
};

export const useRecentUserSubmission = (username: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: ["recentSubmission", username],
    queryFn: () => getRecentUserSubmission(username),
    enabled: enabled && !!username,
    refetchOnWindowFocus: false,
  });
};

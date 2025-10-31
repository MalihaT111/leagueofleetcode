import { useMutation } from "@tanstack/react-query";
import { joinQueue, leaveQueue } from "../matchmaking";

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

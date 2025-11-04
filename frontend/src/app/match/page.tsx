"use client";
import { useEffect, useState, useRef } from "react";
import {
  useLeaveQueue,
  useMatchStatus,
  useJoinQueue,
} from "@/lib/api/queries/matchmaking";
import { useRouter } from "next/navigation";
import { AuthService, User } from "@/utils/auth";
import Matchmaking from "@/components/match/Matchmaking";
import MatchFound from "@/components/match/MatchFound";

// Type definitions for match data

interface Problem {
    id: number,
    title: string,
    titleSlug: string,
    slug: string,
    difficulty: string,
    content: string,
    tags: string[],
    acceptance_rate: string
}

interface MatchData {
  match_id: number;
  opponent: string;
  opponent_elo: number;
  problem: Problem
}

interface QueueResponse {
  status: string;
  match: MatchData | null;
}

export default function MatchmakingPage() {
  const [seconds, setSeconds] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [inQueue, setInQueue] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const hasJoinedQueueRef = useRef(false);

  const leaveQueueMutation = useLeaveQueue();
  const joinQueueMutation = useJoinQueue();
  const router = useRouter();

  // Poll for match status when user is in queue
  const { data: matchStatus } = useMatchStatus(
    user?.id || 0,
    inQueue && user?.id !== null,
  );

  // Get current user and join queue on component mount
  useEffect(() => {
    if (hasJoinedQueueRef.current) return; // Prevent running multiple times
    hasJoinedQueueRef.current = true;

    const getCurrentUserAndJoinQueue = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (!currentUser) {
          console.warn("No user found — redirecting to home...");
          router.push("/");
          return;
        }
        setUser(currentUser);

        // Join queue immediately when page loads
        const result = await joinQueueMutation.mutateAsync(currentUser.id);

        console.log("Join queue result:", result);

        if (result.status === "matched" && result.match) {
          // Immediate match found
          console.log("Immediate match found!", result.match);
          setMatchData(result.match);
          setMatchFound(true);
        } else if (result.status === "queued") {
          // Start polling for matches after a short delay
          console.log("Added to queue, starting polling...");
          setTimeout(() => {
            setInQueue(true);
          }, 1000); // Wait 1 second before starting to poll
        } else {
          console.error("Unexpected join queue result:", result);
          console.log("Result status:", result.status);
          console.log("Result match:", result.match);
        }
      } catch (error) {
        console.error("Failed to get current user or join queue:", error);
        console.error(
          "Error details:",
          error instanceof Error ? error.message : String(error),
        );
      }
    };

    getCurrentUserAndJoinQueue();
  }, []); // Empty dependency array - only run once on mount

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Cleanup: Remove user from queue when component unmounts or page is closed
  useEffect(() => {
    // Handle page refresh/close
    const handleBeforeUnload = () => {
      if (user?.id && (inQueue || !matchFound)) {
        // Use navigator.sendBeacon for reliable cleanup on page unload
        navigator.sendBeacon('/api/matchmaking/leave', JSON.stringify({ userId: user.id }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Only cleanup if user is still in queue and hasn't found a match
      if (user?.id && (inQueue || !matchFound)) {
        // Use a synchronous approach for cleanup on unmount
        leaveQueueMutation.mutate(user.id);
      }
    };
  }, []); // Empty dependency array to prevent infinite loops

  // Check for match status updates
  useEffect(() => {
    if (matchStatus?.status === "matched" && matchStatus.match && !matchFound) {
      console.log("Match found via polling!", matchStatus.match);
      setInQueue(false);
      setMatchData(matchStatus.match);
      setMatchFound(true);
    }
  }, [matchStatus, matchFound]);

  // Handle leaving queue
  const handleLeaveQueue = async () => {
    if (!user?.id) return;

    try {
      await leaveQueueMutation.mutateAsync(user.id);
      setInQueue(false);
      router.push("/"); // Navigate back to home or previous page
    } catch (error) {
      console.error("Failed to leave queue:", error);
    }
  };

  // Conditional rendering based on match status
  if (matchFound && matchData && user) {
    return <MatchFound match={matchData} user={user} />;
  }

  // Show matchmaking component while searching
  if (user) {
    return (
      <Matchmaking
        user={user}
        seconds={seconds}
        handleLeaveQueue={handleLeaveQueue}
        leaveQueueMutation={leaveQueueMutation}
      />
    );
  }

  // Loading state while getting user
  return null;
}

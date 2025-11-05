"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService, User } from "@/utils/auth";
import Matchmaking from "@/components/match/Matchmaking";
import MatchFound from "@/components/match/MatchFound";
import { useMatchmakingWebSocket } from "@/lib/hooks/useMatchmakingWebSocket";

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
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  // WebSocket hook for real-time matchmaking
  const {
    isConnected,
    isInQueue,
    matchFound,
    matchData,
    error,
    joinQueue,
    leaveQueue,
    submitSolution,
    resignMatch,
    timerPhase,
    countdown,
    matchSeconds,
    formattedTime
  } = useMatchmakingWebSocket(user?.id || null, () => {
    setIsRedirecting(true);
  });

  // Get current user and join queue on component mount
  useEffect(() => {
    const getCurrentUserAndJoinQueue = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (!currentUser) {
          console.warn("No user found — redirecting to home...");
          router.push("/");
          return;
        }
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to get current user:", error);
        router.push("/signin");
      }
    };

    getCurrentUserAndJoinQueue();
  }, [router]);

  // Auto-join queue when user is loaded and WebSocket is connected
  useEffect(() => {
    if (user && isConnected && !isInQueue && !matchFound) {
      console.log("🚀 Auto-joining queue via WebSocket");
      joinQueue();
    }
  }, [user, isConnected, isInQueue, matchFound, joinQueue]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Cleanup: WebSocket handles disconnection automatically
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user?.id && isInQueue) {
        leaveQueue();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user?.id, isInQueue, leaveQueue]);

  // Handle leaving queue
  const handleLeaveQueue = async () => {
    leaveQueue();
    router.push("/");
  };

  // Show error state
  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        Error: {error}
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  // Conditional rendering based on match status
  // Keep showing MatchFound even during redirect phase
  if ((matchFound || isRedirecting) && matchData && user) {
    return (
      <MatchFound 
        match={{
          match_id: matchData.match_id,
          opponent: matchData.opponent.username,
          opponent_elo: matchData.opponent.elo,
          problem: {
            title: matchData.problem.title,
            titleSlug: matchData.problem.slug,
            difficulty: matchData.problem.difficulty,
          }
        }} 
        user={user}
        onSubmit={() => {
          setIsRedirecting(true);
          submitSolution(matchData.match_id);
        }}
        onResign={() => {
          setIsRedirecting(true);
          resignMatch(matchData.match_id);
        }}
        timerPhase={timerPhase}
        countdown={countdown}
        matchSeconds={matchSeconds}
        formattedTime={formattedTime}
        error={error}
      />
    );
  }

  // Show matchmaking component while searching
  if (user) {
    return (
      <Matchmaking
        user={user}
        seconds={seconds}
        handleLeaveQueue={handleLeaveQueue}
        isLeaving={false}
        connectionStatus={isConnected ? 'Connected' : 'Connecting...'}
      />
    );
  }

  // Loading state while getting user
  return <div>Loading...</div>;
}

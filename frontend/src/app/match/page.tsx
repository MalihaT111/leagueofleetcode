"use client";
import Navbar from "@/components/navbar";
import { useEffect, useState, useRef } from "react";
import { Flex, Stack, Title, Text, Button } from "@mantine/core";
import { ProfileBox } from "@/components/profilebox";
import { orbitron } from "../fonts";
import {
  useLeaveQueue,
  useMatchStatus,
  useJoinQueue,
} from "@/lib/api/queries/matchmaking";
import { useRouter } from "next/navigation";
import { AuthService } from "@/utils/auth";

// Type definitions for match data

interface Problem {
    id: number,
    title: string,
    slug: string,
    difficulty: string,
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
  const [userId, setUserId] = useState<number | null>(null);
  const [inQueue, setInQueue] = useState(false);
  const [matchFound, setMatchFound] = useState(false);
  const [queueData, setQueueData] = useState<QueueResponse | null>();
  const hasJoinedQueueRef = useRef(false);

  const leaveQueueMutation = useLeaveQueue();
  const joinQueueMutation = useJoinQueue();
  const router = useRouter();

  // Poll for match status when user is in queue
  const { data: matchStatus } = useMatchStatus(
    userId || 0,
    inQueue && userId !== null,
  );

  // Get current user and join queue on component mount
  useEffect(() => {
    if (hasJoinedQueueRef.current) return; // Prevent running multiple times
    hasJoinedQueueRef.current = true;

    const getCurrentUserAndJoinQueue = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setUserId(user.id);

        // Join queue immediately when page loads
        const result = await joinQueueMutation.mutateAsync(user.id);

        console.log("Join queue result:", result);

        if (result.status === "matched" && result.match) {
          // Immediate match found
          console.log("Immediate match found!", result.match);
          setMatchFound(true);
          setQueueData(result);
          
          console.log(queueData);

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
        // Don't redirect to signin immediately, let user see the error
        // router.push("/signin");
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

  // Check for match status updates
  useEffect(() => {
    if (matchStatus?.status === "matched" && matchStatus.match && !matchFound) {
      console.log("Match found via polling!", matchStatus.match);
      setInQueue(false);
      setMatchFound(true);
      setQueueData(matchStatus);
      console.log(queueData?.match?.problem);
      
    }
  }, [matchStatus, router, matchFound]);

  // Handle leaving queue
  const handleLeaveQueue = async () => {
    if (!userId) return;

    try {
      await leaveQueueMutation.mutateAsync(userId);
      setInQueue(false);
      router.push("/"); // Navigate back to home or previous page
    } catch (error) {
      console.error("Failed to leave queue:", error);
    }
  };

  // format as MM:SS
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  return (
    <Flex
      h="100vh"
      w="100%"
      direction="column"
      align="center"
      justify="center"
      bg="dark"
      c="white"
      gap="xl"
    >
      <Navbar />
      <Title
        style={{
          fontSize: "70px",
          fontStyle: "italic",
          fontWeight: 700,
          lineHeight: "1",
          fontFamily: "var(--font-montserrat), sans-serif",
        }}
        order={1}
      >
        MATCHMAKING
      </Title>

      {/* Profile Row */}
      <Flex align="center" justify="center" gap="xl">
        <Stack align="center" gap="xs">
          <ProfileBox username="Username" rating={1500} />
        </Stack>

        <Stack align="center" gap="xs">
          <Text
            style={{
              fontSize: "30px",
              fontStyle: "italic",
              fontWeight: 700,
              lineHeight: "1",
              fontFamily: "var(--font-montserrat), sans-serif",
            }}
            size="sm"
            c="dimmed"
            ta="center"
          >
            finding a worthy opponent...
          </Text>
          <div
            style={{
              width: 60,
              height: 60,
              border: "4px solid white",
              borderRadius: "50%",
            }}
          />
          <Text
            size="sm"
            className={orbitron.className}
            style={{
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "2px",
            }}
          >
            {formatted}
          </Text>
        </Stack>

        <Stack align="center" gap="xs">
          <ProfileBox /> {/* Unknown opponent */}
        </Stack>
      </Flex>

      {/* Cancel button */}
      <Button
        size="xl"
        radius="sm"
        variant="filled"
        color="yellow"
        mt="xl"
        style={{ fontWeight: "bold" }}
        onClick={handleLeaveQueue}
        loading={leaveQueueMutation.isPending}
      >
        Cancel
      </Button>
    </Flex>
  );
}

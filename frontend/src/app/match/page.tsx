"use client";
import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";
import { Flex, Stack, Title, Text, Button } from "@mantine/core";
import { ProfileBox } from "@/components/profilebox";
import { orbitron } from "../fonts";
import { useLeaveQueue } from "@/lib/api/queries/matchmaking";
import { joinQueue } from "@/lib/api/matchmaking";
import { useRouter } from "next/navigation";
import { AuthService } from "@/utils/auth";

// Type definitions for match data
interface MatchData {
  match_id: number;
  opponent: string;
  opponent_elo: number;
}

interface QueueResponse {
  status: string;
  match: MatchData | null;
}

export default function MatchmakingPage() {
  const [seconds, setSeconds] = useState(0);
  const [polling, setPolling] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  
  const leaveQueueMutation = useLeaveQueue();
  const router = useRouter();

  // Get current user on component mount
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setUserId(user.id);
      } catch (error) {
        console.error("Failed to get current user:", error);
        // Redirect to login if not authenticated
        router.push("/signin");
      }
    };

    getCurrentUser();
  }, [router]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Polling effect for matchmaking
  useEffect(() => {
    if (!polling || !userId) return;
    
    const interval = setInterval(async () => {
      try {
        const result: QueueResponse = await joinQueue(userId);
        
        if (result.status === "matched" && result.match) {
          setPolling(false);
          console.log("Match found!", result.match);
          // Redirect to match found page
          router.push("/matchfound");
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [polling, userId, router]);

  // Handle leaving queue
  const handleLeaveQueue = async () => {
    if (!userId) return;
    
    try {
      await leaveQueueMutation.mutateAsync(userId);
      setPolling(false);
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
    <Navbar/>
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

import { useEffect, useState } from "react";
import { Flex, Stack, Title, Text, Button, Loader, Anchor } from "@mantine/core";
import { useRouter } from "next/navigation";
import Navbar from "../navbar";
import { ProfileBox } from "../profilebox";
import { orbitron, montserrat } from "@/app/fonts";
import { useSubmitSolution, useMatchStatus } from "@/lib/api/queries/matchmaking";

interface MatchFoundProps {
  match: {
    match_id: number;
    opponent: string;
    opponent_elo: number;
    problem: {
      difficulty: string,
      title: string,
      titleSlug: string
    };
  };
  user: any;
  onSubmit?: () => void;
  onResign?: () => void;
  timerPhase?: 'countdown' | 'start' | 'active' | null;
  countdown?: number;
  matchSeconds?: number;
  formattedTime?: string;
}

export default function MatchFound({ 
  match, 
  user, 
  onSubmit, 
  onResign, 
  timerPhase, 
  countdown = 3, 
  matchSeconds = 0, 
  formattedTime = "00:00" 
}: MatchFoundProps) {
  const [matchCompleted, setMatchCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResigning, setIsResigning] = useState(false);
  
  const router = useRouter();
  const submitSolutionMutation = useSubmitSolution();
  
  // Poll for match completion (fallback only)
  const { data: matchStatus } = useMatchStatus(user.id, timerPhase === 'active' && !matchCompleted);
  
  // Server handles all timing - no local timer needed

  // Check for match completion
  useEffect(() => {
    if (matchStatus?.status === "completed" && !matchCompleted) {
      setMatchCompleted(true);
      
      // Redirect to existing results page after a short delay
      setTimeout(() => {
        router.push(`/match-result/${match.match_id}`);
      }, 2000);
    }
  }, [matchStatus, matchCompleted, router, match.match_id]);

  // Handle submit solution
  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    if (onSubmit) {
      // Use WebSocket submission - don't change any state, just show loading
      onSubmit();
      // Don't set matchCompleted - let WebSocket handle redirect
    } else {
      // Fallback to REST API
      try {
        await submitSolutionMutation.mutateAsync({
          matchId: match.match_id,
          userId: user.id
        });
        
        // Redirect to existing results page after short delay
        setTimeout(() => {
          router.push(`/match-result/${match.match_id}`);
        }, 2000);
      } catch (error) {
        console.error("Failed to submit solution:", error);
        setIsSubmitting(false); // Reset loading on error
      }
    }
  };

  // Handle resignation
  const handleResign = () => {
    setIsResigning(true);
    
    if (onResign) {
      // Use WebSocket resignation - don't change any state, just show loading
      onResign();
      // Don't set matchCompleted - let WebSocket handle redirect
    } else {
      // Fallback - redirect to results
      router.push(`/match-result/${match.match_id}`);
    }
  };
  

  const problem = match.problem;
  const link = `https://leetcode.com/problems/${problem.titleSlug}`;

  // Server-controlled timer display
  let displayText;
  let fontSize = "60px";
  
  if (matchCompleted) {
    displayText = "MATCH COMPLETED";
  } else if (timerPhase === 'countdown') {
    displayText = countdown;
    fontSize = "80px";
  } else if (timerPhase === 'start') {
    displayText = "START!";
  } else if (timerPhase === 'active') {
    displayText = formattedTime;
  } else {
    // Fallback while waiting for server timer
    displayText = "...";
  }

  return (
    <Flex
      h="100vh"
      w="100%"
      direction="column"
      align="center"
      justify="center"
      bg="dark"
      c="white"
      gap="lg"
    >
      <Navbar />
      {/* Title */}
      <Title
        order={1}
        className={montserrat.className}
        style={{ fontSize: "40px", fontWeight: 700 }}
      >
        MATCH FOUND
      </Title>

      {/* Players row */}
      <Flex align="center" justify="center" gap="6rem">
        <ProfileBox username={user.leetcode_username || "User 1"} rating={user.user_elo} />

        <Text
          className={orbitron.className}
          style={{ fontSize: "40px", fontWeight: 700 }}
        >
          VS
        </Text>

        <ProfileBox username={match.opponent} rating={match.opponent_elo} />
      </Flex>

      {/* Countdown or Match Timer */}
      <Text
        className={orbitron.className}
        style={{
          fontSize: fontSize,
          fontWeight: 700,
          letterSpacing: "4px",
        }}
      >
        {displayText}
      </Text>

      {/* Problem link */}
      <Text size="sm" style={{ fontFamily: "monospace" }}>
        Problem Link:{" "}
        <Anchor
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#1e88e5", // bright blue
            textDecoration: "underline",
            fontWeight: "bold",
          }}
        >
          {link}
        </Anchor>
      </Text>

      {/* Rules */}
      <Text size="sm" c="dimmed">
        win +15 / lose -15 / resign -10
      </Text>

      {/* Buttons */}
      <Flex gap="xl" mt="lg">
        <Button
          size="lg"
          radius="sm"
          variant="filled"
          color="gray"
          style={{
            fontWeight: "bold",
            backgroundColor: "#E5E5E5",
            color: "black",
          }}
          onClick={handleSubmit}
          loading={isSubmitting || submitSolutionMutation.isPending}
          disabled={timerPhase !== 'active' || matchCompleted || isSubmitting || isResigning}
        >
          Submit
        </Button>
        <Button
          size="lg"
          radius="sm"
          variant="filled"
          color="gray"
          style={{
            fontWeight: "bold",
            backgroundColor: "#E5E5E5",
            color: "black",
          }}
          onClick={handleResign}
          loading={isResigning}
          disabled={timerPhase !== 'active' || matchCompleted || isSubmitting || isResigning}
        >
          Resign
        </Button>
      </Flex>
    </Flex>
  );
}
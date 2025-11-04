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
}

export default function MatchFound({ match, user, onSubmit, onResign }: MatchFoundProps) {
  const [countdown, setCountdown] = useState(3);
  const [seconds, setSeconds] = useState(0);
  const [started, setStarted] = useState(false);
  const [matchCompleted, setMatchCompleted] = useState(false);
  
  const router = useRouter();
  const submitSolutionMutation = useSubmitSolution();
  
  // Poll for match completion (in case opponent submits)
  const { data: matchStatus } = useMatchStatus(user.id, started && !matchCompleted);
  // handle countdown first
  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      // when countdown hits 0 → show "START!" briefly, then start match
      const timeout = setTimeout(() => {
        setStarted(true);
      }, 1000); // 1s for the "START!" text
      return () => clearTimeout(timeout);
    }
  }, [countdown]);
  
  // match timer (only runs after countdown ends)
  useEffect(() => {
    if (started && !matchCompleted) {
      const interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [started, matchCompleted]);

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
    if (onSubmit) {
      // Use WebSocket submission
      onSubmit();
      setMatchCompleted(true);
    } else {
      // Fallback to REST API
      try {
        await submitSolutionMutation.mutateAsync({
          matchId: match.match_id,
          userId: user.id
        });
        setMatchCompleted(true);
        
        // Redirect to existing results page after short delay
        setTimeout(() => {
          router.push(`/match-result/${match.match_id}`);
        }, 2000);
      } catch (error) {
        console.error("Failed to submit solution:", error);
      }
    }
  };

  // Handle resignation
  const handleResign = () => {
    if (onResign) {
      // Use WebSocket resignation
      onResign();
      setMatchCompleted(true);
    } else {
      // Fallback - redirect to results
      router.push(`/match-result/${match.match_id}`);
    }
  };
  

  const problem = match.problem;
  console.log(problem);
  const link = `https://leetcode.com/problems/${problem.titleSlug}`;

  console.log(problem.titleSlug);



  // format MM:SS
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formatted = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

  // what to display in timer spot
  let displayText;
  if (matchCompleted) {
    displayText = "MATCH COMPLETED";
  } else if (!started) {
    displayText = countdown > 0 ? countdown : "START!";
  } else {
    displayText = formatted;
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
          fontSize: !started && displayText !== "START!" ? "80px" : "60px",
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
          loading={submitSolutionMutation.isPending}
          disabled={!started || matchCompleted}
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
          disabled={!started || matchCompleted}
        >
          Resign
        </Button>
      </Flex>
    </Flex>
  );
}
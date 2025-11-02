"use client";
import { useParams, useRouter } from "next/navigation";
import {
  Flex,
  Title,
  Text,
  Button,
  Paper,
  Stack,
  Group,
  Loader,
  Alert,
  Divider,
} from "@mantine/core";
import { PlayerResult } from "@/components/playerresult";
import { montserrat } from "../../fonts";
import { useMatchResults } from "@/lib/api/queries";
import { useState } from "react";

export default function MatchResultPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = Number(params.match_id);
  const { data, isLoading, isError, error } = useMatchResults(matchId);
  const [selectedPlayer, setSelectedPlayer] = useState<"winner" | "loser">(
    "winner",
  );

  // Handle invalid matchId
  if (isNaN(matchId)) {
    return <Alert color="red">Invalid match ID.</Alert>;
  }

  // React Query states
  if (isLoading) {
    return (
      <Flex h="100vh" align="center" justify="center" bg="#1a1a1a" c="white">
        <Stack align="center">
          <Loader size="lg" />
          <Text>Loading match results...</Text>
        </Stack>
      </Flex>
    );
  }

  if (isError) {
    const message =
      error instanceof Error && error.message === "Match not found"
        ? "This match ID does not exist."
        : "Failed to load match results.";

    return (
      <Flex h="100vh" align="center" justify="center" bg="#1a1a1a" c="white">
        <Paper bg="dark.6" p="xl" radius="md">
          <Alert color="red" title="Error" mb="md">
            {message}
          </Alert>
          <Group justify="center">
            <Button onClick={() => router.push("/dashboard")}>Dashboard</Button>
            <Button variant="outline" onClick={() => router.back()}>
              Go Back
            </Button>
          </Group>
        </Paper>
      </Flex>
    );
  }

  if (!data) {
    return (
      <Flex h="100vh" align="center" justify="center" bg="#1a1a1a" c="white">
        <Text>No match data found.</Text>
      </Flex>
    );
  }

  // ✅ Derived values (computed once)
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const result = {
    match_id: data.match_id,
    problem: {
      title: data.problem?.title || "Unknown Problem",
      slug: data.problem?.slug || "unknown",
      difficulty: "Medium", // Mock difficulty
    },
    duration: formatDuration(data.match_duration || 0),
    winner: {
      username: data.winner?.username || "Winner",
      runtime: data.winner?.runtime || 0,
      memory: data.winner?.memory || 0,
      elo_change: data.elo_change || 0,
    },
    loser: {
      username: data.loser?.username || "Loser",
      runtime: data.loser?.runtime || 0,
      memory: data.loser?.memory || 0,
    },
  };

  const performanceData = {
    winner: {
      executionTime: `${result.winner.runtime} ms`,
      memoryUsage: `${result.winner.memory} MB`,
      approach: "Optimized Solution",
      description: "Winner’s implementation",
    },
    loser: {
      executionTime: `${result.loser.runtime} ms`,
      memoryUsage: `${result.loser.memory} MB`,
      approach: "Alternative Solution",
      description: "Loser’s implementation",
    },
  };

  return (
    <Flex
      h="100vh"
      w="100%"
      bg="#1a1a1a"
      c="white"
      align="center"
      justify="center"
      direction="column"
      gap="xl"
      p="xl"
    >
      <Title
        order={1}
        className={montserrat.className}
        style={{ fontSize: "56px", fontWeight: 800, letterSpacing: "2px" }}
      >
        RESULTS
      </Title>

      <Flex gap="6rem" align="flex-start" justify="center">
        {/* Left Side */}
        <Stack gap="sm">
          <Text fw={700} size="lg" tt="uppercase" c="dimmed">
            {selectedPlayer === "winner"
              ? `${result.winner.username}'s Performance`
              : `${result.loser.username}'s Performance`}
          </Text>
          <Paper
            shadow="lg"
            radius="md"
            p="lg"
            style={{
              backgroundColor: "#2a2a2a",
              border: "1px solid #444",
              width: "380px",
              height: "260px",
            }}
          >
            <Stack gap="lg" h="100%" justify="space-between">
              {/* Approach */}
              <Stack gap="xs">
                <Text size="sm" c="dimmed" tt="uppercase" fw={600}>
                  Approach
                </Text>
                <Text size="lg" fw={600}>
                  {performanceData[selectedPlayer].approach}
                </Text>
                <Text size="sm" c="gray.4">
                  {performanceData[selectedPlayer].description}
                </Text>
              </Stack>

              {/* Performance Metrics */}
              <Stack gap="md">
                <Flex
                  justify="space-between"
                  align="center"
                  p="sm"
                  style={{ backgroundColor: "#1a1a1a", borderRadius: "8px" }}
                >
                  <Text size="sm" c="dimmed">
                    Runtime ⏱️
                  </Text>
                  <Text
                    size="lg"
                    fw={700}
                    style={{
                      fontFamily: "monospace",
                      color:
                        selectedPlayer === "winner" ? "#06d6a0" : "#ff6b6b",
                    }}
                  >
                    {performanceData[selectedPlayer].executionTime}
                  </Text>
                </Flex>

                <Flex
                  justify="space-between"
                  align="center"
                  p="sm"
                  style={{ backgroundColor: "#1a1a1a", borderRadius: "8px" }}
                >
                  <Text size="sm" c="dimmed">
                    Memory 💾
                  </Text>
                  <Text
                    size="lg"
                    fw={700}
                    style={{
                      fontFamily: "monospace",
                      color: "#ffd166",
                    }}
                  >
                    {performanceData[selectedPlayer].memoryUsage}
                  </Text>
                </Flex>
              </Stack>
            </Stack>
          </Paper>
        </Stack>

        {/* Right Side */}
        <Stack gap="lg">
          <Stack>
            <PlayerResult
              name={result.winner.username}
              tag="W"
              isWinner
              active={selectedPlayer === "winner"}
              onClick={() => setSelectedPlayer("winner")}
            />
            <PlayerResult
              name={result.loser.username}
              tag="L"
              active={selectedPlayer === "loser"}
              onClick={() => setSelectedPlayer("loser")}
            />
          </Stack>

          <Divider my="sm" color="gray.7" />

          <Stack gap="xs">
            <Text>
              <b>Problem:</b>{" "}
              <span style={{ color: "#ffd166" }}>{result.problem.title}</span>
            </Text>
            <Text>
              <b>Duration:</b>{" "}
              <span style={{ color: "#06d6a0" }}>{result.duration}</span>
            </Text>
            <Text>
              <b>ELO Change:</b>{" "}
              <span style={{ color: "#118ab2", fontWeight: 700 }}>
                ±{result.winner.elo_change}
              </span>
            </Text>
          </Stack>
        </Stack>
      </Flex>

      <Group mt="xl" gap="lg">
        <Button onClick={() => router.push("/queue")}>New Game</Button>
        <Button
          variant="light"
          color="blue"
          component="a"
          href={`https://leetcode.com/problems/${result.problem.slug}/`}
          target="_blank"
        >
          View Problem
        </Button>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Main Menu
        </Button>
      </Group>

      <Text size="xs" c="dimmed" mt="md">
        Match ID: {matchId}
      </Text>
    </Flex>
  );
}

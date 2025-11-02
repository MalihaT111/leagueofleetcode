"use client";

import { usePersonalUserQuery } from "@/lib/api/queries/user";
import { Center, Flex, Title, Loader, Text } from "@mantine/core";
import Navbar from "@/components/navbar";
import ProfileStatsCard from "@/components/profilestatscard";
import RecentSubmissionsTable from "@/components/profilesubmissions";
import { montserrat } from "../fonts";

export default function PersonalProfilePage() {
  const { data, isLoading, isError } = usePersonalUserQuery();

  if (isLoading) {
    return (
      <Center mih="60vh">
        <Loader />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center mih="60vh">
        <Text c="red" fz="lg">
          Failed to load profile.
        </Text>
      </Center>
    );
  }

  // ✅ Safely extract data (use fallback if undefined)
  const user = data ?? { id: 0, username: "Unknown", elo: 0 };

  // ✅ If your /me endpoint includes stats and matches:
  const stats = (data as any)?.stats ?? {
    matches_won: 0,
    win_rate: 0,
    win_streak: 0,
  };
  const recent_matches = (data as any)?.recent_matches ?? [];

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      mih="100vh"
      bg="#1a1a1a"
      c="white"
      gap={40}
    >
      <Navbar />
      <Title
        order={1}
        className={montserrat.className}
        style={{ fontSize: "40px", fontWeight: 700 }}
      >
        PROFILE
      </Title>

      <Flex gap={60} align="flex-start" justify="center">
        {/* ✅ Pass user and stats safely */}
        <ProfileStatsCard user={user} stats={stats} />

        {/* ✅ Pass matches safely */}
        <RecentSubmissionsTable matches={recent_matches} />
      </Flex>
    </Flex>
  );
}

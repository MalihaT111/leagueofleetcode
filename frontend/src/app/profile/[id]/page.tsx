"use client";
import React from "react";
import { useProfileQuery } from "@/lib/api/queries/profile";
import { Flex, Title } from "@mantine/core";
import { montserrat } from "../../fonts";
import Navbar from "@/components/navbar";
import ProfileStatsCard from "@/components/profilestatscard";
import RecentSubmissionsTable from "@/components/profilesubmissions";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const { id } = useParams();
  const { data, isLoading, error } = useProfileQuery(id);

  if (isLoading) return <p>Loading...</p>;
  if (error || !data) return <p>Failed to load profile data.</p>;

  // ✅ Destructure to match backend JSON
  const { user, stats, recent_matches } = data;

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
        {/* ✅ Pass both user and stats separately */}
        <ProfileStatsCard user={user} stats={stats} />

        {/* ✅ Pass matches for the table */}
        <RecentSubmissionsTable matches={recent_matches} />
      </Flex>
    </Flex>
  );
}

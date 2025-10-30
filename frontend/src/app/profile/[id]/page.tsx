"use client";
import React from "react";
import { useProfileQuery } from "@/lib/api/queries/profile";
import { Card, Flex, Group, Table, Text, Title } from "@mantine/core";
import { montserrat } from "../../fonts";
import ProfileHeader from "@/components/profilehead";
import Navbar from "@/components/navbar";
import ProfileStatsCard from "@/components/profilestatscard";
import RecentSubmissionsTable from "@/components/profilesubmissions";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const { id } = useParams();
  const { data: userStats, isLoading, error } = useProfileQuery(id);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load profile data.</p>;

  return (
    <Flex direction="column" align="center" justify="center" mih="100vh" bg="#1a1a1a" c="white" gap={40}>
      <Navbar />
      <Title
        order={1}
        className={montserrat.className}
        style={{ fontSize: "40px", fontWeight: 700 }}
      >
        PROFILE
      </Title>

      <Flex gap={60} align="flex-start" justify="center">
        <ProfileStatsCard user={userStats} />
        <RecentSubmissionsTable user={userStats} />
      </Flex>
    </Flex>
  );
}

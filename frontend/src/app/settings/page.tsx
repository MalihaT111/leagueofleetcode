"use client";

import React, { useEffect, useState } from "react";
import { Flex, Title, Loader, Text } from "@mantine/core";
import { montserrat } from "@/app/fonts";
import SettingsToggles from "@/components/settingstoggle";
import FilterTypesCard from "@/components/filtertypes";
import Navbar from "@/components/navbar";
import { AuthService } from "@/utils/auth";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user?.leetcode_username) {
          setUserId(user.id);
        } else {
          console.warn("No user found — redirecting to signin...");
          router.push("/signin");
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        mih="100vh"
        bg="#1a1a1a"
        c="white"
      >
        <Loader color="yellow" size="lg" />
        <Text mt="md" size="lg">
          Loading your settings...
        </Text>
      </Flex>
    );
  }

  if (!userId) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        mih="100vh"
        bg="#1a1a1a"
        c="white"
      >
        <Text size="lg">Please sign in to view your settings.</Text>
      </Flex>
    );
  }

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
        style={{
          fontSize: "40px",
          fontWeight: 700,
          fontStyle: "italic",
        }}
      >
        SETTINGS
      </Title>

      <Flex gap={60} align="flex-start" justify="center">
        {/* ✅ Uses real logged-in user */}
        <SettingsToggles userId={userId} />
        <FilterTypesCard userId={userId}/>
      </Flex>
    </Flex>
  );
}

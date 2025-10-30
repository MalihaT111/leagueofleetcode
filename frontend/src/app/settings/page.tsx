"use client";

import React from "react";
import { Flex, Title } from "@mantine/core";
import { montserrat } from "@/app/fonts";
import SettingsToggles from "@/components/settingstoggle";
import FilterTypesCard from "@/components/filtertypes";
import Navbar from "@/components/navbar";

export default function SettingsPage() {
  const userId = 1; // ✅ Replace later with actual logged-in user

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
        {/* ✅ Pass userId as a prop to both */}
        <SettingsToggles userId={userId} />
        <FilterTypesCard userId={userId} />
      </Flex>
    </Flex>
  );
}

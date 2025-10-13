"use client";

import { Group, Text } from "@mantine/core";
import Link from "next/link";

export default function HomeNavbar() {
  const linkStyle: React.CSSProperties = {
    color: "white",
    fontWeight: 600,
    fontStyle: "italic",
    letterSpacing: 0.5,
    textDecoration: "none",
    transition: "color 0.2s ease",
  };

  return (
    <Group
      gap="xl"
      style={{
        position: "fixed",
        top: 20,
        right: 40,
        zIndex: 1000,
      }}
    >
      <Link
        href="/leaderboard"
        style={linkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#d8a727")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
      >
        <Text fw={600} fz="md" c="inherit">
          LEADERBOARD
        </Text>
      </Link>

      <Link
        href="/profile"
        style={linkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#d8a727")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
      >
        <Text fw={600} fz="md" c="inherit">
          PROFILE
        </Text>
      </Link>
    </Group>
  );
}

"use client";

import { Group, Text } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function HomeNavbar() {
  const router = useRouter();
  const { currentUserId } = useCurrentUser();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentUserId) {
      router.push(`/profile/${currentUserId}`);
    } else {
      router.push("/signin");
    }
  };

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
        href="/friends"
        style={linkStyle}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#d8a727")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
      >
        <Text fw={600} fz="md" c="inherit">
          FRIENDS
        </Text>
      </Link>

      <Text
        fw={600}
        fz="md"
        c="inherit"
        style={{ ...linkStyle, cursor: "pointer" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#d8a727")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
        onClick={handleProfileClick}
      >
        PROFILE
      </Text>
    </Group>
  );
}

"use client";

import { Group, Flex, Text } from "@mantine/core";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  // Fetch current user ID on component mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem('access_token'); // Adjust based on how you store the token
        if (!token) return;

        const response = await fetch('http://127.0.0.1:8000/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUserId(userData.id);
        }
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  const handleProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentUserId) {
      router.push(`/profile/${currentUserId}`);
    } else {
      // Fallback or redirect to login if no user ID
      router.push('/login');
    }
  };

  const links = [
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "Match", href: "/match" },
    { label: "Settings", href: "/settings" },
    { label: "Profile", href: "/profile", onClick: handleProfileClick },
  ];

  const linkStyle: React.CSSProperties = {
    color: "white",
    fontWeight: 600,
    fontStyle: "italic",
    letterSpacing: 0.5,
    textDecoration: "none",
    transition: "color 0.2s ease",
  };

  return (
    <Flex
      align="center"
      justify="space-between"
      px="xl"
      h={60}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#0d0d0d",
        borderBottom: "1px solid #222",
        zIndex: 1000,
      }}
    >
      {/* Logo / Title (Clickable) */}
      <Link href="/home" style={{ textDecoration: "none" }}>
        <Text
          fw={900}
          size="lg"
          c="white"
          style={{
            letterSpacing: 1.5,
            cursor: "pointer",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#d8a727")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
        >
          LEAGUE OF LEETCODE
        </Text>
      </Link>

      {/* Links (Leaderboard, Match, Settings) and Logout */}
      <Group>
        {links.map((link) => (
          link.onClick ? (
            <Text
              key={link.href}
              style={{...linkStyle, cursor: "pointer"}}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d8a727")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
              onClick={link.onClick}
            >
              {link.label.toUpperCase()}
            </Text>
          ) : (
            <Link
              key={link.href}
              href={link.href}
              style={linkStyle}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#d8a727")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
            >
              {link.label.toUpperCase()}
            </Link>
          )
        ))}
        <LogoutButton />
      </Group>
    </Flex>
  );
}

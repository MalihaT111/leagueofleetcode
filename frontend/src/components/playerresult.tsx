"use client";

import { Flex, Box, Text } from "@mantine/core";

interface PlayerResultProps {
  name: string;
  tag: string; // P1, P2
  isWinner?: boolean;
  onClick?: () => void;
  active?: boolean;
}

export function PlayerResult({
  name,
  tag,
  isWinner,
  onClick,
  active,
}: PlayerResultProps) {
  // Size depends ONLY on active state
  const isLarge = !!active;

  return (
    <Flex
      align="center"
      gap="md"
      onClick={onClick}
      style={{
        cursor: "pointer",
        backgroundColor: isWinner
          ? "#FFBD42" // gold if winner
          : active
            ? "#555" // highlight active non-winner
            : "#444",
        padding: isLarge ? "20px 28px" : "14px 22px",
        width: isLarge ? "360px" : "320px",
        height: isLarge ? "70px" : "56px",
        borderRadius: "10px",
        clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0% 100%)",
        color: isWinner ? "#222" : "white",
        fontWeight: isLarge ? 700 : 400,
        boxShadow: isWinner
          ? "0 0 14px rgba(255, 189, 66, 0.6)"
          : active
            ? "0 0 8px rgba(255, 255, 255, 0.2)"
            : "none",
        zIndex: isLarge ? 2 : 1,
        transition: "all 0.25s ease",
      }}
    >
      {isWinner && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#222"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2 19h20l-2-10-5 5-5-9-5 9-5-5z" />
        </svg>
      )}

      <Box
        style={{
          backgroundColor: isWinner ? "#fff" : "#ccc",
          borderRadius: "50%",
          width: isLarge ? "52px" : "44px",
          height: isLarge ? "52px" : "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: isLarge ? "18px" : "15px",
          color: "#222",
          flexShrink: 0,
        }}
      >
        {tag}
      </Box>

      <Text fw={600} size={isLarge ? "xl" : "md"}>
        {name}
      </Text>
    </Flex>
  );
}

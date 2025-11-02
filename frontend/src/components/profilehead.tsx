import React from "react";
import { orbitron, montserrat } from "@/app/fonts";
import { Avatar, Flex, Text } from "@mantine/core";

type ProfileHeaderProps = {
  username: string;
  avatarColor?: string;
};

export default function ProfileHeader({
  username,
  avatarColor = "gray",
}: ProfileHeaderProps) {
  return (
    <Flex
      align="center"
      gap="md"
      bg="gray.3"
      p="md"
      style={{
        borderRadius: 8,
      }}
    >
      <Avatar size={60} radius="xl" color={avatarColor} />
      <Text
        className={montserrat.className}
        c="black"
        style={{ fontSize: "20px", fontWeight: 700 }}
      >
        {username}
      </Text>
    </Flex>
  );
}

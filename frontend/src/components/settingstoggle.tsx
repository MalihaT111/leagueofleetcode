"use client";

import React from "react";
import { Card, Flex, Group, Text, Switch } from "@mantine/core";
import ProfileHeader from "@/components/profilehead";
import { useSettings } from "@/lib/api/queries/settings";

export default function SettingsToggles({ userId = 1 }: { userId?: number }) {
  const {
    settings,
    loading,
    error,
    toggleRepeat,
    toggleDifficulty,
    isDifficultyOn,
  } = useSettings(userId);

  if (loading || !settings)
    return <Text c="gray.4">Loading settings...</Text>;

  if (error)
    return (
      <Text c="red" fw={700}>
        Failed to load settings
      </Text>
    );

  return (
    <Card shadow="sm" radius="md" p="lg" w={280} bg="gray.3">
      <Flex direction="column" gap="lg">
        <ProfileHeader username={settings.username} />

        <Flex direction="column" gap="md" mt="md">
          {/* Repeat */}
          <Group justify="space-between">
            <Text fw={700} c="black">
              Repeat
            </Text>
            <Switch
              size="md"
              color="gray"
              checked={!!settings.repeat}
              onChange={toggleRepeat}
              onLabel="ON"
              offLabel="OFF"
              styles={{
                track: { backgroundColor: "#d1d1d1" },
                label: { fontWeight: 700, color: "#666" },
              }}
            />
          </Group>

          {/* Difficulty */}
          {[
            { label: "Easy", level: 1 },
            { label: "Medium", level: 2 },
            { label: "Hard", level: 3 },
          ].map(({ label, level }) => (
            <Group key={label} justify="space-between">
              <Text fw={700} c="black">
                {label}
              </Text>
              <Switch
                size="md"
                color="gray"
                checked={isDifficultyOn(level)}
                onChange={() => toggleDifficulty(level)}
                onLabel="ON"
                offLabel="OFF"
                styles={{
                  track: { backgroundColor: "#d1d1d1" },
                  label: { fontWeight: 700, color: "#666" },
                }}
              />
            </Group>
          ))}
        </Flex>
      </Flex>
    </Card>
  );
}

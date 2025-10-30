"use client";

import React, { useState, useEffect } from "react";
import { Card, Flex, Group, Text, Switch } from "@mantine/core";
import ProfileHeader from "@/components/profilehead";
import {
  useSettingsQuery,
  useUpdateSettingsMutation,
} from "@/lib/api/queries/settings";

export default function SettingsToggles({ userId = 1 }: { userId?: number }) {
  const { data: settings, isLoading, error } = useSettingsQuery(userId);
  const updateSettings = useUpdateSettingsMutation(userId);

  // 🔹 Keep local UI state in sync with backend
  const [localSettings, setLocalSettings] = useState<any>(null);

  useEffect(() => {
    if (settings) setLocalSettings(settings);
  }, [settings]);

  if (isLoading || !localSettings)
    return <Text c="gray.4">Loading settings...</Text>;
  if (error) return <Text c="red">Failed to load settings</Text>;

  // 🧠 Check difficulty status
  const isDifficultyOn = (level: number) =>
    Array.isArray(localSettings.difficulty) &&
    localSettings.difficulty.includes(level);

  // 🧠 Toggle difficulty (1=Easy, 2=Medium, 3=Hard)
  const handleDifficultyToggle = (level: number) => {
    const current = Array.isArray(localSettings.difficulty)
      ? [...localSettings.difficulty]
      : [];

    const newDifficulty = current.includes(level)
      ? current.filter((l) => l !== level)
      : [...current, level];

    // 🔸 Update UI instantly
    setLocalSettings({ ...localSettings, difficulty: newDifficulty });

    // 🔸 Send update to backend
    updateSettings.mutate({ difficulty: newDifficulty });
  };

  // 🧠 Toggle repeat
  const handleRepeatToggle = () => {
    const newRepeat = !localSettings.repeat;

    setLocalSettings({ ...localSettings, repeat: newRepeat });
    updateSettings.mutate({ repeat: newRepeat });
  };

  return (
    <Card shadow="sm" radius="md" p="lg" w={280} bg="gray.3">
      <Flex direction="column" gap="lg">
        <ProfileHeader username={localSettings.username} />

        <Flex direction="column" gap="md" mt="md">
          {/* Repeat */}
          <Group justify="space-between">
            <Text fw={700} c="black">
              Repeat
            </Text>
            <Switch
              size="md"
              color="gray"
              checked={!!localSettings.repeat}
              onChange={handleRepeatToggle}
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
                onChange={() => handleDifficultyToggle(level)}
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

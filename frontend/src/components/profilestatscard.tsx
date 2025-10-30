"use client";
import { Card, Flex, Group, Text } from "@mantine/core";
import ProfileHeader from "@/components/profilehead";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Group justify="space-between" w="100%">
      <Text fw={600} c="black">{label}</Text>
      <Text fw={600} c="black">{value}</Text>
    </Group>
  );
}

export default function ProfileStatsCard({ user }: { user: any }) {
  return (
    <Card shadow="sm" radius="md" p="lg" w={280} bg="gray.3">
      <Flex direction="column" gap="md" align="flex-start">
        <ProfileHeader username={user.username || `user_${user.id}`} />

        <Flex direction="column" gap={6} w="100%" mt="sm">
          <Stat label="ELO" value={user.user_elo ?? "—"} />
          <Stat label="Won" value={user.matches_won ?? 0} />
          <Stat label="Win Rate" value={`${user.win_rate ?? 0}%`} />
          <Stat label="Streak" value={user.win_streak ?? 0} />
        </Flex>
      </Flex>
    </Card>
  );
}

"use client";

import React, { useState } from "react";
import { Card, Flex, Group, Text, Switch } from "@mantine/core";
import ProfileHeader from "@/components/profilehead";

export default function SettingsToggles() {
    const options = ["Repeat", "Easy", "Hard", "Medium"];
  
    return (
      <Card shadow="sm" radius="md" p="lg" w={280} bg="gray.3">
        <Flex direction="column" gap="lg">
          <ProfileHeader username="maliwali2004" />
  
          <Flex direction="column" gap="md" mt="md">
            {options.map((label) => (
              <Group key={label} justify="space-between">
                <Text fw={700} c="black">
                  {label}
                </Text>
                <Switch
                  size="md"
                  color="gray"
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
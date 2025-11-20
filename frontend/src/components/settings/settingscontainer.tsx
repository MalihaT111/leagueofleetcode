"use client";

import React from "react";
import { Flex } from "@mantine/core";
import SettingsToggles from "./settingstoggle";
import FilterTypesCard from "./filtertypes";
import { ValidationResult } from "@/lib/hooks/useTopicValidation";
import { Settings } from "@/lib/api/queries/settings";

interface SettingsContainerProps {
  userId: number;
  validation: ValidationResult;
  settingsHook: {
    settings: Settings | null;
    loading: boolean;
    error: string | null;
    toggleRepeat: () => void;
    toggleDifficulty: (level: number) => void;
    toggleTopic: (topicId: number) => void;
    isDifficultyOn: (level: number) => boolean;
    isTopicOn: (topicId: number) => boolean;
    updateSettings: (updates: Partial<Settings>) => void;
  };
  topicNames: string[];
}

export default function SettingsContainer({
  userId,
  validation,
  settingsHook,
  topicNames,
}: SettingsContainerProps) {
  return (
    <>
      <Flex gap={60} align="flex-start" justify="center">
        <SettingsToggles
          userId={userId}
          validation={validation}
          settingsHook={settingsHook}
        />
        <FilterTypesCard
          userId={userId}
          validation={validation}
          settingsHook={settingsHook}
          topicNames={topicNames}
        />
      </Flex>

      {/* Soft block summary - shows at bottom */}
      {validation.blockType === "soft" && validation.errorMessage && (
        <div
          style={{
            backgroundColor: "#3b2c0c",
            border: "1px solid #ffa500",
            borderRadius: "8px",
            padding: "16px",
            maxWidth: "700px",
            color: "#ffd699",
            textAlign: "center",
            marginTop: "20px",
          }}
        >
          <div
            style={{ fontSize: "16px", fontWeight: 600, marginBottom: "4px" }}
          >
            ⚠️ {validation.invalidTopics.length} topic(s) incompatible
          </div>
          <div style={{ fontSize: "13px" }}>
            You can still match with your {validation.validTopics.length} valid
            topic(s).
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import { useState, useEffect } from "react";

export interface Settings {
  username: string;
  repeat: boolean;
  difficulty: number[];
  topics?: number[];
}

export function useSettings(userId: number = 1) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch settings
  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/settings/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch settings");
        const data = await res.json();
        setSettings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, [userId]);

  // Update helper
  async function updateSettings(updates: Partial<Settings>) {
    if (!settings) return;
    const updated = { ...settings, ...updates };
    setSettings(updated); // optimistic UI update

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/settings/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update settings");
    } catch (err) {
      setSettings(settings); // rollback on error
    }
  }

  // Simple toggle helpers
  const toggleRepeat = () => updateSettings({ repeat: !settings?.repeat });
  const toggleDifficulty = (level: number) => {
    if (!settings) return;
    const has = settings.difficulty.includes(level);
    const newDiff = has
      ? settings.difficulty.filter((l) => l !== level)
      : [...settings.difficulty, level];
    updateSettings({ difficulty: newDiff });
  };

  const toggleTopic = (topicId: number) => {
    if (!settings) return;
    const currentTopics = settings.topics || [];
    const has = currentTopics.includes(topicId);
    const newTopics = has
      ? currentTopics.filter((t) => t !== topicId)
      : [...currentTopics, topicId];
    updateSettings({ topics: newTopics });
  };

  const isDifficultyOn = (level: number) =>
    !!settings?.difficulty?.includes(level);
  
  const isTopicOn = (topicId: number) =>
    !!settings?.topics?.includes(topicId);

  return {
    settings,
    loading,
    error,
    toggleRepeat,
    toggleDifficulty,
    toggleTopic,
    isDifficultyOn,
    isTopicOn,
  };
}

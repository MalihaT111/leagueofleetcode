"use client";

import React, { useState } from "react";
import {
  Card,
  Title,
  Text,
  TextInput,
  Chip,
  Flex,
  ScrollArea,
  Button,
  Group,
} from "@mantine/core";
import { useSettings } from "@/lib/api/queries/settings";

export default function FilterTypesCard() {
  const [search, setSearch] = useState("");
  const { settings, loading, error, toggleTopic, isTopicOn, updateSettings } =
    useSettings();

  if (loading || !settings) return <Text c="gray.4">Loading settings...</Text>;

  if (error)
    return (
      <Text c="red" fw={700}>
        Failed to load settings
      </Text>
    );

  // 🧠 Available filters
  const filters = [
    "Array",
    "String",
    "Hash Table",
    "Dynamic Programming",
    "Math",
    "Sorting",
    "Greedy",
    "Depth-First Search",
    "Binary Search",
    "Database",
    "Matrix",
    "Bit Manipulation",
    "Tree",
    "Breadth-First Search",
    "Two Pointers",
    "Prefix Sum",
    "Heap (Priority Queue)",
    "Simulation",
    "Binary Tree",
    "Graph",
    "Counting",
    "Stack",
    "Sliding Window",
    "Design",
    "Enumeration",
    "Backtracking",
    "Union Find",
    "Number Theory",
    "Linked List",
    "Ordered Set",
    "Monotonic Stack",
    "Segment Tree",
    "Trie",
    "Combinatorics",
    "Bitmask",
    "Divide and Conquer",
    "Queue",
    "Recursion",
    "Geometry",
    "Binary Indexed Tree",
    "Memoization",
    "Hash Function",
    "Binary Search Tree",
    "Shortest Path",
    "String Matching",
    "Topological Sort",
    "Rolling Hash",
    "Game Theory",
    "Interactive",
    "Data Stream",
    "Monotonic Queue",
    "Brainteaser",
    "Doubly-Linked List",
    "Randomized",
    "Merge Sort",
    "Counting Sort",
    "Iterator",
    "Concurrency",
    "Line Sweep",
    "Probability and Statistics",
    "Quickselect",
    "Suffix Array",
    "Minimum Spanning Tree",
    "Bucket Sort",
    "Shell",
    "Reservoir Sampling",
    "Strongly Connected Component",
    "Eulerian Circuit",
    "Radix Sort",
    "Rejection Sampling",
    "Biconnected Component",
  ];

  // 🔎 Filtered list based on search term
  const filtered = filters.filter((f) =>
    f.toLowerCase().includes(search.toLowerCase()),
  );

  // ✅ “Select All” → sets all topics active
  const handleSelectAll = () => {
    const allIndices = filters.map((_, idx) => idx);
    updateSettings({ topics: allIndices });
  };

  // 🔄 “Reset All” → clears all selected topics
  const handleResetAll = () => {
    updateSettings({ topics: [] });
  };

  return (
    <Card shadow="sm" radius="md" p="lg" w={420} bg="gray.3">
      <Title
        order={3}
        fw={900}
        fz="lg"
        mb="sm"
        c="black"
        ta="center"
        style={{ letterSpacing: 0.5, fontStyle: "italic" }}
      >
        FILTER TYPES
      </Title>

      <Card
        bg="black"
        p="md"
        radius="md"
        withBorder
        style={{
          borderColor: "#2f2f2f",
          minHeight: 250,
          maxHeight: 340,
          overflow: "hidden",
        }}
      >
        <TextInput
          placeholder="search"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          variant="unstyled"
          mb="sm"
          styles={{
            input: {
              backgroundColor: "#1a1a1a",
              color: "white",
              padding: "8px",
              borderRadius: "4px",
            },
          }}
        />

        {/* 🔘 Action Buttons */}
        <Group justify="space-between" mb="sm">
          <Button
            variant="subtle"
            color="gray"
            size="xs"
            radius="xl"
            onClick={handleSelectAll}
            styles={{
              root: {
                backgroundColor: "#2a2a2a",
                color: "white",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#3a3a3a" },
              },
            }}
          >
            Select All
          </Button>

          <Button
            variant="subtle"
            color="gray"
            size="xs"
            radius="xl"
            onClick={handleResetAll}
            styles={{
              root: {
                backgroundColor: "#2a2a2a",
                color: "white",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#3a3a3a" },
              },
            }}
          >
            Reset All
          </Button>
        </Group>

        <ScrollArea
          h={230}
          scrollbarSize={6}
          scrollHideDelay={500}
          styles={{
            scrollbar: { background: "#1a1a1a" },
            thumb: { background: "#444", "&:hover": { background: "#666" } },
          }}
        >
          <Flex wrap="wrap" gap="xs">
            {filtered.map((filter, idx) => (
              <Chip
                key={filter}
                color="gray"
                size="sm"
                radius="xl"
                variant="filled"
                checked={isTopicOn?.(idx)}
                onClick={() => toggleTopic?.(idx)}
                styles={{
                  root: {
                    backgroundColor: isTopicOn?.(idx) ? "#6b7280" : "#2a2a2a",
                    color: "white",
                    fontWeight: 600,
                    textAlign: "center",
                    borderRadius: "9999px",
                    transition: "background-color 150ms ease",
                  },
                }}
              >
                {filter}
              </Chip>
            ))}
          </Flex>
        </ScrollArea>
      </Card>
    </Card>
  );
}

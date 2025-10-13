"use client";

import React, { useState } from "react";
import {
  Card,
  Title,
  TextInput,
  Chip,
  Flex,
  ScrollArea,
} from "@mantine/core";

export default function FilterTypesCard() {
  const [search, setSearch] = useState("");

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

  // ✅ All filters selected by default
  const [selected, setSelected] = useState<string[]>(filters);

  const toggleFilter = (filter: string) => {
    setSelected((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const filtered = filters.filter((f) =>
    f.toLowerCase().includes(search.toLowerCase())
  );

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
          maxHeight: 300,
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
            {filtered.map((f) => (
              <Chip
                key={f}
                color="gray"
                size="sm"
                radius="xl"
                variant="filled"
                checked={selected.includes(f)}
                onClick={() => toggleFilter(f)}
                styles={{
                  root: {
                    backgroundColor: "#2a2a2a", 
                    color: "white",
                    fontWeight: 600,
                    textAlign: "center",
                    borderRadius: "9999px",
                    transition: "background-color 150ms ease",
                  },
                }}
              >
                {f}
              </Chip>
            ))}
          </Flex>
        </ScrollArea>
      </Card>
    </Card>
  );
}

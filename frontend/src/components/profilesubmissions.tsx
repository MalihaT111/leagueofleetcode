"use client";
import React from "react";
import { Card, Title, Table, Text } from "@mantine/core";

type RecentMatch = {
  outcome: string;
  rating_change: number;
  question: string;
};

export default function RecentSubmissionsTable({
  matches,
}: {
  matches: RecentMatch[];
}) {
  const recentMatches = matches || [];

  const rows =
    recentMatches.length > 0 ? (
      recentMatches.map((match, i) => (
        <tr key={i}>
          <td>
            <Text
              fw={600}
              fz="sm"
              c={match.outcome === "win" ? "green" : "red"}
            >
              {match.outcome.toUpperCase()}
            </Text>
          </td>
          <td>
            <Text
              fw={600}
              fz="sm"
              c={match.rating_change >= 0 ? "green" : "red"}
            >
              {match.rating_change >= 0
                ? `+${match.rating_change}`
                : match.rating_change}
            </Text>
          </td>
          <td>
            <Text fw={500} fz="sm" c="white">
              {match.question}
            </Text>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan={3}>
          <Text fz="sm" c="gray.5" ta="center" py="sm">
            No recent submissions
          </Text>
        </td>
      </tr>
    );

  return (
    <Card shadow="sm" radius="md" p="lg" w={380} bg="gray.3">
      <Title
        order={3}
        fw={900}
        fz="lg"
        mb="sm"
        c="black"
        style={{ letterSpacing: 0.5, fontStyle: "italic" }}
      >
        RECENT SUBMISSIONS
      </Title>

      <Table
        withColumnBorders
        withRowBorders
        highlightOnHover={false}
        horizontalSpacing="sm"
        verticalSpacing="xs"
      >
        <thead style={{ backgroundColor: "black" }}>
          <tr>
            <th>
              <Text fw={600} fz="sm" c="white" style={{ fontStyle: "italic" }}>
                OUTCOME
              </Text>
            </th>
            <th>
              <Text fw={600} fz="sm" c="white" style={{ fontStyle: "italic" }}>
                RATING CHANGE
              </Text>
            </th>
            <th>
              <Text fw={600} fz="sm" c="white" style={{ fontStyle: "italic" }}>
                QUESTION
              </Text>
            </th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "black" }}>{rows}</tbody>
      </Table>
    </Card>
  );
}

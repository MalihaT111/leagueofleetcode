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
        <tr 
          key={i}
          style={{
            transition: "background-color 0.2s ease",
            borderBottom: i === recentMatches.length - 1 ? "none" : "1px solid #333"
          }}
        >
          <td style={{ 
            padding: "10px 16px",
            borderBottomLeftRadius: i === recentMatches.length - 1 ? "12px" : "0"
          }}>
            <Text
              fw={600}
              fz="sm"
              c={match.outcome === "win" ? "#22c55e" : "#ef4444"}
            >
              {match.outcome.toUpperCase()}
            </Text>
          </td>
          <td style={{ padding: "10px 16px" }}>
            <Text
              fw={600}
              fz="sm"
              c={match.rating_change >= 0 ? "#22c55e" : "#ef4444"}
            >
              {match.rating_change >= 0
                ? `+${match.rating_change}`
                : match.rating_change}
            </Text>
          </td>
          <td style={{ 
            padding: "10px 16px",
            borderBottomRightRadius: i === recentMatches.length - 1 ? "12px" : "0"
          }}>
            <Text fw={500} fz="sm" c="white">
              {match.question}
            </Text>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td 
          colSpan={3}
          style={{ 
            padding: "20px 16px",
            borderBottomLeftRadius: "12px",
            borderBottomRightRadius: "12px"
          }}
        >
          <Text fz="sm" c="gray.5" ta="center">
            No recent submissions
          </Text>
        </td>
      </tr>
    );

  return (
    <Card shadow={0} radius="md" p="lg" w={450} bg="gray.3">
      <Title
        order={3}
        fw={900}
        fz="lg"
        mb="md"
        c="black"
        style={{ letterSpacing: 0.5, fontStyle: "italic" }}
      >
        RECENT SUBMISSIONS
      </Title>

      <div style={{ 
        borderRadius: "12px", 
        overflow: "hidden",
        border: "2px solid #333"
      }}>
        <Table
          withColumnBorders={false}
          withRowBorders={false}
          highlightOnHover={true}
          horizontalSpacing="md"
          verticalSpacing="sm"
          style={{
            borderRadius: "12px",
            overflow: "hidden"
          }}
          styles={{
            table: {
              '& tbody tr:hover': {
                backgroundColor: '#1f2937 !important'
              }
            }
          }}
        >
          <thead style={{ 
            backgroundColor: "#1a1a1a",
            borderBottom: "2px solid #333"
          }}>
            <tr>
              <th style={{ 
                padding: "12px 16px",
                borderTopLeftRadius: "12px"
              }}>
                <Text fw={600} fz="sm" c="white" style={{ fontStyle: "italic" }}>
                  OUTCOME
                </Text>
              </th>
              <th style={{ padding: "12px 16px" }}>
                <Text fw={600} fz="sm" c="white" style={{ fontStyle: "italic" }}>
                  RATING CHANGE
                </Text>
              </th>
              <th style={{ 
                padding: "12px 16px",
                borderTopRightRadius: "12px"
              }}>
                <Text fw={600} fz="sm" c="white" style={{ fontStyle: "italic" }}>
                  QUESTION
                </Text>
              </th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: "#0d1117" }}>{rows}</tbody>
        </Table>
      </div>
    </Card>
  );
}

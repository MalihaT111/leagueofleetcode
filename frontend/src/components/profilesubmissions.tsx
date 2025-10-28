"use client";
import React from "react";
import { Card, Title, Table, Text } from "@mantine/core";

export default function RecentSubmissionsTable() {
  const rows = [...Array(5)].map((_, i) => (
    <tr key={i}>
      <td />
      <td />
      <td />
    </tr>
  ));

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

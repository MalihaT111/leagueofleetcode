"use client";
import { Card, Title, Table, Text } from "@mantine/core";

export default function RecentSubmissionsTable({ user }: { user: any }) {
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
        horizontalSpacing="sm"
        verticalSpacing="xs"
      >
        <thead style={{ backgroundColor: "black" }}>
          <tr>
            <th><Text fw={600} fz="sm" c="white" style={{ fontStyle: "italic" }}>DIFFICULTY</Text></th>
            <th><Text fw={600} fz="sm" c="white" style={{ fontStyle: "italic" }}>TOPICS</Text></th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "black" }}>
          <tr>
            <td><Text c="white">{user.difficulty.join(", ")}</Text></td>
            <td><Text c="white">{user.topics.slice(0, 8).join(", ")}...</Text></td>
          </tr>
        </tbody>
      </Table>
    </Card>
  );
}

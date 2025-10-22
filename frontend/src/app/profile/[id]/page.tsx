"use client";
import React from "react";
import { Card, Flex, Group, Table, Text, Title } from "@mantine/core";
import { montserrat } from "../../fonts";
import ProfileHeader from "@/components/profilehead";
import Navbar from "@/components/navbar";
import ProfileStatsCard from "@/components/profilestatscard";
// import RecentSubmissionsTable from "@/components/profilesubmissions";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Group justify="space-between" w="100%">
      <Text fw={600} c="black">
        {label}
      </Text>
      <Text fw={600} c="black">
        {value}
      </Text>
    </Group>
  );
}

// function ProfileStatsCard() {
//   return (
//     <Card shadow="sm" radius="md" p="lg" w={280} bg="gray.3">
//       <Flex direction="column" gap="md" align="flex-start">
//         <ProfileHeader username="maliwali2004" />

//         <Flex direction="column" gap={6} w="100%" mt="sm">
//           <Stat label="ELO" value="6547389210" />
//           <Stat label="Won" value="57483" />
//           <Stat label="Win Rate" value="100%" />
//           <Stat label="Streak" value="57483" />
//         </Flex>
//       </Flex>
//     </Card>
//   );
// }

function RecentSubmissionsTable() {
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

export default function ProfilePage() {
  const { id } = useParams(); // grabs dynamic segment from URL
  console.log("Params:", id);
  const [user, setUser] = useState(null);
  const API_BASE_URL = "http://localhost:8000"
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/${id}`);
        console.log(id);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      mih="100vh"
      bg="#1a1a1a"
      c="white"
      gap={40}
    >
      <Navbar/>
      <Title
        order={1}
        className={montserrat.className}
        style={{ fontSize: "40px", fontWeight: 700 }}
      >
        PROFILE
      </Title>

      <Flex gap={60} align="flex-start" justify="center">
      <ProfileStatsCard user={user} />
      <RecentSubmissionsTable user={user} />

      </Flex>
    </Flex>
  );
}

"use client";

import { Button, Center, Container, Flex, Text, Title } from "@mantine/core";
import Link from "next/link";

export default function NotFound() {
  return (
    <Center h="100vh" bg="dark.8">
      <Container size="sm">
        <Flex
          direction="column"
          align="center"
          gap="lg"
          style={{ animation: "fadeIn 1s ease-in-out" }}
        >
          <Title
            order={1}
            style={{
              fontSize: "10rem",
              fontWeight: 900,
              background: "linear-gradient(135deg, #38b2ac, #805ad5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1,
            }}
          >
            404
          </Title>

          <Title order={2} size="3rem" fw={800} c="gray.0" ta="center">
            Page not found
          </Title>

          <Text c="gray.5" size="xl" ta="center" maw={600}>
            The page you're looking for doesn't exist or has been moved.
          </Text>

          <Button
            size="lg"
            radius="md"
            component={Link}
            href="/"
            color="teal"
            mt="lg"
            style={{
              fontSize: "1.25rem",
              padding: "0.75rem 2rem",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 0 20px rgba(56,178,172,0.8)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Go back home
          </Button>
        </Flex>
      </Container>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Center>
  );
}

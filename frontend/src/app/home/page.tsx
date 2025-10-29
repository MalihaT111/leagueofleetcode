"use client";
import HomeNavbar from "@/components/homenav";
import AuthGuard from "@/components/AuthGuard";
import { Button, Flex, Stack, Title, Group, BackgroundImage, Box } from "@mantine/core";
import Link from "next/link"
import { AngledButton } from "@/components/angledbutton";

export default function Home() {
  return (
    <AuthGuard>
      <Flex h="100vh" w="100%" pos="relative">
        <HomeNavbar/>
        <BackgroundImage
          src="/background.png"
          style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundImage: "linear-gradient(to right, black 340px, transparent 340px), url('/background.png')",
              backgroundSize: "cover",
              backgroundPosition: "right center",
              backgroundRepeat: "no-repeat",
              opacity: 0.3,
              zIndex: 0,
          }}
          />

        {/* Foreground content */}
        <Flex
          h="100%"
          w="100%"
          pos="relative"
          justify="space-between"
          align="flex-start"
          p="xl"
          style={{ zIndex: 1 }}
        >
          <Stack justify="center" h="100%" w="100%">
            <Title
              order={1}
              c="white"
              style={{
                fontSize: "110px",
                fontStyle: "italic",
                fontWeight: 700,
                lineHeight: "1",
                fontFamily: "var(--font-montserrat), sans-serif",
              }}
            >
              LEAGUE OF <br /> LEETCODE
            </Title>

          <Stack mt="xl" gap="xl">
              <AngledButton href="/match" label="Start" />
              <AngledButton href="/settings" label="Settings" />
           </Stack>

          </Stack>
        </Flex>
      </Flex>
    </AuthGuard>
  );
}

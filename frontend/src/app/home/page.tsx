"use client";

import { useEffect, useState } from "react";
import { Container, Flex, Stack } from "@mantine/core";
import Link from "next/link";

import styles from "./page.module.css";
import CircleBackground from "./comp";
import TranscendenceSword from "@/components/home/TranscendenceSword";
import Navbar from "@/components/navbar";

const colors = [
  "rgba(154,105,245,0.9)",  // purple
  "rgba(180,130,255,0.9)",  // lavender
  "rgba(120,180,255,0.9)",  // icy blue
  "rgba(255,140,255,0.9)",  // pink-magenta
  "rgba(190,110,255,0.9)",  // neon violet
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <div className={styles.wrapper}>
      {/* NAVBAR */}
      <Navbar />

      {/* PARTICLES */}
      {mounted && (
        <div className={styles.particles}>
          {[...Array(40)].map((_, i) => {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const randomX = (Math.random() * 200 - 100) + "px";
            const randomY = (Math.random() * -200 - 100) + "px";

            return (
              <div
                key={i}
                className={styles.particle}
                style={{
                  background: randomColor,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${10 + Math.random() * 10}s`,
                  opacity: Math.random() * 0.5 + 0.3,
                  transform: `scale(${Math.random() * 1.4 + 0.6})`,
                  "--x-move": randomX,
                  "--y-move": randomY,
                } as React.CSSProperties}
              />
            );
          })}
        </div>
      )}

      {/* MAIN CONTENT */}
      <Container size="lg" px={0} className={styles.techFrame}>
        <Flex justify="space-between" className={styles.headerRow}>
          <span className={styles.topLeftMark}>SYSTEM ONLINE</span>
          <span className={styles.version}>v3.27</span>
        </Flex>

        <Stack align="left">
          <h1 className={styles.title}>
            LEAGUE <br /> OF <br /> LEETCODE
          </h1>

          {/* CENTERPIECE */}
          <div className={styles.centerShape}>
            <CircleBackground />
            <TranscendenceSword />
          </div>
        </Stack>

        {/* FOOTER STATUS */}
        <Flex justify="space-between" className={styles.footerRow}>
          <span>NETWORK: STABLE</span>
          <span>PRESS SWORD TO START</span>
        </Flex>
      </Container>
    </div>
  );
}

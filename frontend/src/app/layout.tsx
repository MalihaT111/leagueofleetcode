import type { Metadata } from "next";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

import { montserrat, orbitron, geistSans, geistMono } from "./fonts";
import ReactQueryProvider from "@/lib/queryProvider";

export const metadata: Metadata = {
  title: "League of LeetCode",
  description: "Compete and practice coding with others",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          ${montserrat.variable}
          ${orbitron.variable}
        `}
      >
        <MantineProvider
          defaultColorScheme="dark"
          theme={{
            fontFamily: "var(--font-geist-sans), sans-serif",
            headings: { fontFamily: "var(--font-geist-sans), sans-serif" },
            fontFamilyMonospace: "var(--font-geist-mono), monospace",
          }}
        >
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </MantineProvider>
      </body>
    </html>
  );
}

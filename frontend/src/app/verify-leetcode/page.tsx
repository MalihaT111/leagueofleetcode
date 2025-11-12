"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  TextInput,
  Button,
  Title,
  Text,
  Flex,
  Stack,
  Alert,
  Box,
  Loader,
} from "@mantine/core";
import { AlertCircle, Check, Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { montserrat } from "../fonts";
import { AuthService } from "@/utils/auth";

export default function VerifyLeetCodePage() {
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [verificationHash, setVerificationHash] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);
  const [checkingUser, setCheckingUser] = useState(true);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // First check if there's a pending registration
        const storedEmail = sessionStorage.getItem("pending_registration_email");
        const storedHash = sessionStorage.getItem("pending_registration_hash");
        
        if (storedEmail && storedHash) {
          // User is completing registration
          setPendingEmail(storedEmail);
          setVerificationHash(storedHash);
          setCheckingUser(false);
          return;
        }
        
        // Otherwise, check if user is already logged in
        const user = await AuthService.getCurrentUser();
        
        // If user already has a leetcode username, redirect to home
        if (user?.leetcode_username) {
          router.push("/");
          return;
        }
        
        // User is logged in but needs to set leetcode username
        if (user?.leetcode_hash) {
          setVerificationHash(user.leetcode_hash);
        }
      } catch (error) {
        // Not logged in and no pending registration - redirect to signup
        console.error("Error fetching user:", error);
        router.push("/signup");
      } finally {
        setCheckingUser(false);
      }
    };

    checkUserStatus();
  }, [router]);

  const copyToClipboard = () => {
    if (verificationHash) {
      navigator.clipboard.writeText(verificationHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!leetcodeUsername.trim()) {
      setError("Please enter your LeetCode username");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (pendingEmail) {
        // Complete registration for new user
        await AuthService.completeRegistration({
          email: pendingEmail,
          leetcode_username: leetcodeUsername,
        });

        // Clear session storage
        sessionStorage.removeItem("pending_registration_email");
        sessionStorage.removeItem("pending_registration_hash");

        setSuccess(true);
        setTimeout(() => {
          router.push("/signin");
        }, 2000);
      } else {
        // Update existing user's leetcode username
        const token = AuthService.getToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/users/verify-leetcode`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              leetcode_username: leetcodeUsername,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Verification failed");
        }

        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to verify LeetCode username");
    } finally {
      setLoading(false);
    }
  };

  if (checkingUser) {
    return (
      <Flex
        h="100vh"
        w="100%"
        justify="center"
        align="center"
        bg="#1a1a1a"
      >
        <Loader color="yellow" size="lg" />
      </Flex>
    );
  }

  if (success) {
    return (
      <Flex
        h="100vh"
        w="100%"
        justify="center"
        align="center"
        p="xl"
        bg="#1a1a1a"
      >
        <Card
          shadow="xl"
          radius="md"
          p="xl"
          w={450}
          bg="gray.9"
          style={{ border: "1px solid #333" }}
        >
          <Stack gap="lg" ta="center">
            <Check size={64} color="#4CAF50" />
            <Title
              order={2}
              c="white"
              className={montserrat.className}
              style={{
                fontSize: "24px",
                fontWeight: 700,
                fontStyle: "italic",
              }}
            >
              {pendingEmail ? "REGISTRATION COMPLETE!" : "VERIFICATION COMPLETE!"}
            </Title>
            <Text c="gray.4">
              {pendingEmail
                ? "Your account has been created. Redirecting to sign in..."
                : "Your LeetCode account has been verified. Redirecting..."}
            </Text>
          </Stack>
        </Card>
      </Flex>
    );
  }

  return (
    <Flex
      h="100vh"
      w="100%"
      justify="center"
      align="center"
      p="xl"
      bg="#1a1a1a"
    >
      <Card
        shadow="xl"
        radius="md"
        p="xl"
        w={550}
        bg="gray.9"
        style={{
          border: "1px solid #333",
        }}
      >
        <Stack gap="lg">
          {/* Title */}
          <Box ta="center">
            <Title
              order={1}
              c="white"
              className={montserrat.className}
              style={{
                fontSize: "32px",
                fontWeight: 700,
                fontStyle: "italic",
                letterSpacing: 1,
                marginBottom: "8px",
              }}
            >
              VERIFY LEETCODE
            </Title>
            <Text c="gray.4" size="sm">
              Link your LeetCode account to continue
            </Text>
          </Box>

          {/* Verification Hash Display */}
          {verificationHash && (
            <Box
              p="md"
              bg="#2d2d2d"
              style={{
                border: "2px solid #FFBD42",
                borderRadius: "8px",
              }}
            >
              <Flex justify="space-between" align="center" mb="sm">
                <Text c="white" fw={600}>
                  Your Verification Hash:
                </Text>
                <Button
                  size="xs"
                  variant="subtle"
                  color="yellow"
                  leftSection={<Copy size={14} />}
                  onClick={copyToClipboard}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </Flex>
              <Text
                c="#FFBD42"
                fw={700}
                size="sm"
                style={{
                  wordBreak: "break-all",
                  fontFamily: "monospace",
                }}
              >
                {verificationHash}
              </Text>
            </Box>
          )}

          {/* Instructions */}
          <Alert
            color="yellow"
            variant="light"
            styles={{
              root: {
                backgroundColor: "rgba(255, 189, 66, 0.1)",
                border: "1px solid #FFBD42",
              },
            }}
          >
            <Text c="white" size="sm" ta="left">
              <strong>Instructions:</strong>
              <br />
              1. Copy the verification hash above
              <br />
              2. Add it to your LeetCode profile bio
              <br />
              3. Enter your LeetCode username below
            </Text>
          </Alert>

          {/* Error Alert */}
          {error && (
            <Alert
              icon={<AlertCircle size={16} />}
              color="red"
              variant="filled"
            >
              {error}
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Stack gap="md">
              <TextInput
                label="LeetCode Username"
                placeholder="Enter your LeetCode username"
                value={leetcodeUsername}
                onChange={(e) => setLeetcodeUsername(e.target.value)}
                required
                styles={{
                  label: {
                    color: "white",
                    fontWeight: 600,
                    marginBottom: "8px",
                  },
                  input: {
                    backgroundColor: "#2d2d2d",
                    border: "1px solid #444",
                    color: "white",
                    "&:focus": {
                      borderColor: "#d8a727",
                    },
                  },
                }}
              />

              <Button
                type="submit"
                loading={loading}
                fullWidth
                size="lg"
                mt="md"
                styles={{
                  root: {
                    backgroundColor: "#FFBD42",
                    color: "black",
                    fontWeight: 700,
                    fontSize: "16px",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    fontStyle: "italic",
                    border: "none",
                    "&:hover": {
                      backgroundColor: "#d8a727",
                    },
                  },
                }}
              >
                {loading ? "Verifying..." : "Verify Account"}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Card>
    </Flex>
  );
}

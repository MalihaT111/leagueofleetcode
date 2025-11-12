"use client";

import React, { useState } from "react";
import {
  Card,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Flex,
  Stack,
  Alert,
  Box,
} from "@mantine/core";
import { AlertCircle, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { montserrat } from "../fonts";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    leetcodeUsername: "",
  });
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState("");
  const [showVerification, setShowVerification] = useState(false);
  const [verificationHash, setVerificationHash] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const { AuthService } = await import("@/utils/auth");
      const response = await AuthService.initiateRegistration(
        formData.email,
        formData.password
      );

      // Store the verification hash and show verification form
      setVerificationHash(response.leetcode_hash);
      setShowVerification(true);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.leetcodeUsername.trim()) {
      setError("Please enter your LeetCode username");
      return;
    }

    setVerifyLoading(true);
    setError("");

    try {
      const { AuthService } = await import("@/utils/auth");
      await AuthService.completeRegistration({
        email: formData.email,
        leetcode_username: formData.leetcodeUsername,
      });

      setRegistrationComplete(true);
      setTimeout(() => {
        router.push("/signin");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to verify LeetCode username");
    } finally {
      setVerifyLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (verificationHash) {
      navigator.clipboard.writeText(verificationHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Registration complete screen
  if (registrationComplete) {
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
              REGISTRATION COMPLETE!
            </Title>
            <Text c="gray.4">
              Your account has been created successfully. Redirecting to sign in...
            </Text>
          </Stack>
        </Card>
      </Flex>
    );
  }

  // Verification step - show hash and collect LeetCode username
  if (showVerification && verificationHash) {
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
          style={{ border: "1px solid #333" }}
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
                Link your LeetCode account to complete registration
              </Text>
            </Box>

            {/* Verification Hash Display */}
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

            {/* Verification Form */}
            <form onSubmit={handleVerification}>
              <Stack gap="md">
                <TextInput
                  label="LeetCode Username"
                  placeholder="Enter your LeetCode username"
                  value={formData.leetcodeUsername}
                  onChange={(e) =>
                    handleInputChange("leetcodeUsername", e.target.value)
                  }
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
                  loading={verifyLoading}
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
                  {verifyLoading ? "Verifying..." : "Complete Registration"}
                </Button>
              </Stack>
            </form>
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
        w={450}
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
              SIGN UP
            </Title>
            <Text c="gray.4" size="sm">
              Join the League of LeetCode
            </Text>
          </Box>

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
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                type="email"
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

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
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
                  innerInput: {
                    backgroundColor: "transparent",
                  },
                }}
              />

              <PasswordInput
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
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
                  innerInput: {
                    backgroundColor: "transparent",
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
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
            </Stack>
          </form>

          {/* Sign In Link */}
          <Box ta="center" mt="md">
            <Text c="gray.4" size="sm">
              Already have an account?{" "}
              <Link
                href="/signin"
                style={{
                  color: "#d8a727",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Sign in here
              </Link>
            </Text>
          </Box>
        </Stack>
      </Card>
    </Flex>
  );
}

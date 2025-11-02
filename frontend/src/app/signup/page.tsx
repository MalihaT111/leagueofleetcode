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
import { AlertCircle, Check } from "lucide-react";
import Link from "next/link";
import { montserrat } from "../fonts";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    leetcodeUsername: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    if (!formData.leetcodeUsername.trim()) {
      setError("LeetCode username is required");
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
      await AuthService.register({
        email: formData.email,
        password: formData.password,
        leetcode_username: formData.leetcodeUsername,
        user_elo: 1200, // Default ELO
      });

      setSuccess(true);
      // Optionally redirect to signin after a delay
      setTimeout(() => {
        window.location.href = "/signin";
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

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
              ACCOUNT CREATED!
            </Title>
            <Text c="gray.4">
              Your account has been successfully created. Redirecting to sign in...
            </Text>
            <Link href="/signin">
              <Button
                fullWidth
                styles={{
                  root: {
                    backgroundColor: "#FFBD42",
                    color: "black",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    "&:hover": {
                      backgroundColor: "#d8a727",
                    },
                  },
                }}
              >
                Go to Sign In
              </Button>
            </Link>
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

              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  handleInputChange("password", e.target.value)
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
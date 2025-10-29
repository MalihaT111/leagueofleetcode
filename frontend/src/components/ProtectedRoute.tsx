"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/utils/auth";
import { Loader, Flex } from "@mantine/core";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = "/signin" 
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!AuthService.isAuthenticated()) {
          router.push(redirectTo);
          return;
        }

        // Optionally verify the token is still valid
        await AuthService.getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        // Token is invalid or expired
        AuthService.removeToken();
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, redirectTo]);

  if (isLoading) {
    return (
      <Flex
        h="100vh"
        w="100%"
        justify="center"
        align="center"
        bg="#1a1a1a"
      >
        <Loader color="#FFBD42" size="lg" />
      </Flex>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <>{children}</>;
}
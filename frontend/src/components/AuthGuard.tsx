"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/utils/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = AuthService.getToken();
        
        if (!token) {
          setIsAuthenticated(false);
          router.push("/signin");
          return;
        }

        // Verify token is valid
        await AuthService.getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        AuthService.removeToken();
        setIsAuthenticated(false);
        router.push("/signin");
      }
    };

    checkAuth();
  }, [router]);

  // Loading state
  if (isAuthenticated === null) {
    return (
      fallback || (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#1a1a1a",
          color: "white"
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px"
          }}>
            <div style={{
              width: "40px",
              height: "40px",
              border: "4px solid #333",
              borderTop: "4px solid #FFBD42",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}></div>
            <p>Checking authentication...</p>
          </div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )
    );
  }

  // Not authenticated - will redirect
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated - render children
  return <>{children}</>;
}
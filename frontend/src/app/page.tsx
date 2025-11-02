"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/utils/auth";

export default function RootPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // Check if user has a token
        const token = AuthService.getToken();

        if (!token) {
          // No token, redirect to sign in
          router.push("/signin");
          return;
        }

        // Token exists, verify it's valid by fetching user data
        try {
          await AuthService.getCurrentUser();
          // Token is valid, redirect to home
          router.push("/home");
        } catch (error) {
          // Token is invalid or expired, redirect to sign in
          AuthService.removeToken();
          router.push("/signin");
        }
      } catch (error) {
        // Any other error, redirect to sign in
        console.error("Auth check failed:", error);
        router.push("/signin");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndRedirect();
  }, [router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#1a1a1a",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #333",
              borderTop: "4px solid #FFBD42",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <p>Loading...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // This should never be reached due to redirects, but just in case
  return null;
}

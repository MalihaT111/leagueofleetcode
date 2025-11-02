"use client";

import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { AuthService } from "@/utils/auth";
import { leaveQueue } from "@/lib/api/matchmaking";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Get current user to leave queue before logging out
      const user = await AuthService.getCurrentUser();
      
      // Leave matchmaking queue if user is authenticated
      try {
        await leaveQueue(user.id);
      } catch (queueError) {
        console.warn("Failed to leave queue during logout:", queueError);
        // Don't block logout if leaving queue fails
      }
      
      // Proceed with logout
      await AuthService.logout();
      router.push("/signin");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, redirect to signin
      router.push("/signin");
    }
  };

  return (
    <Button
      variant="subtle"
      color="red"
      size="sm"
      onClick={handleLogout}
      style={{
        fontWeight: 600,
        fontStyle: "italic",
        letterSpacing: 0.5,
        transition: "all 0.2s ease",
      }}
      styles={{
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            color: '#ff6b6b',
          },
        },
      }}
    >
      LOGOUT
    </Button>
  );
}
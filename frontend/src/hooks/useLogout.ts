"use client";

import { useRouter } from "next/navigation";
import { AuthService } from "@/utils/auth";

export const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      // Get current user to leave queue before logging out
      const user = await AuthService.getCurrentUser();
      
      // Leave matchmaking queue if user is authenticated
      try {
        const { leaveQueue } = await import("@/lib/api/matchmaking");
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

  return { logout };
};
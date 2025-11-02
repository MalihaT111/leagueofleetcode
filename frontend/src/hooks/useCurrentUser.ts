"use client";

import { useState, useEffect } from "react";
import { AuthService, User } from "@/utils/auth";

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!AuthService.isAuthenticated()) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      const userData = await AuthService.getCurrentUser();
      setCurrentUser(userData);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch user data');
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return {
    currentUser,
    currentUserId: currentUser?.id || null,
    loading,
    error,
    refetch: fetchCurrentUser
  };
};
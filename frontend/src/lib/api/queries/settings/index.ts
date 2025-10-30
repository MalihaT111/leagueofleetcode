import { useQuery } from "@tanstack/react-query";

export const useSettingsQuery = (userId: number) => {
  return useQuery({
    queryKey: ["settings", userId], // 🔹 use "settings" not "profile"
    queryFn: async () => {
      if (!userId) throw new Error("No user ID provided");
      const res = await fetch(`http://127.0.0.1:8000/api/settings/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch settings data");
      return res.json();
    },
    enabled: !!userId, // 🔹 prevents the query from running if userId is undefined
    staleTime: 1000 * 60 * 2, // optional: cache for 2 minutes
  });
};

import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateSettingsMutation = (userId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: any) => {
      const res = await fetch(`http://127.0.0.1:8000/api/settings/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update settings");
      return res.json();
    },
    // useUpdateSettingsMutation.ts
    onSuccess: (data) => {
      queryClient.setQueryData(["settings", userId], data); // ✅ fixed key
      queryClient.invalidateQueries({ queryKey: ["settings", userId] }); // optional: forces a refetch
    },

  });
};

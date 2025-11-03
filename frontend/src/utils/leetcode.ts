import { useQuery } from "@tanstack/react-query";

export function useRandomQuestion() {
  return useQuery({
    queryKey: ["randomQuestion"],
    queryFn: fetchRandomQuestion,
  });
}

/**
 * 🔹 1️⃣ Plain fetch function — handles the HTTP request
 */
export async function fetchRandomQuestion() {
  const response = await fetch(`http://localhost:8000/api/leetcode/random-question`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch random LeetCode question: ${response.statusText}`);
  }

  // Parse and return JSON directly
  return response.json();
}


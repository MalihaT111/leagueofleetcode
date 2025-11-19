const BASE_URL = "http://127.0.0.1:8000";

export async function joinQueue(userId) {
  const response = await fetch(`${BASE_URL}/matchmaking/queue/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to join queue");
  return await response.json();
}

export async function leaveQueue(userId) {
  const response = await fetch(`${BASE_URL}/matchmaking/leave/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to leave queue");
  return await response.json();
}

export async function getMatchStatus(userId) {
  const response = await fetch(`${BASE_URL}/matchmaking/status/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to get match status");
  return await response.json();
}

export async function submitSolution(matchId, userId) {
  const response = await fetch(`${BASE_URL}/matchmaking/submit/${matchId}/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to submit solution");
  return await response.json();
}

export async function getRecentUserSubmission(username) {
  const response = await fetch(`${BASE_URL}/api/leetcode/user/${username}/recent-submission`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to get recent submission");
  return await response.json();
}

export async function getRatingPreview(userId, opponentId) {
  const response = await fetch(`${BASE_URL}/matchmaking/rating-preview/${userId}/${opponentId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to get rating preview");
  return await response.json();
}

export async function getMatchRatingPreview(matchId) {
  const response = await fetch(`${BASE_URL}/matchmaking/match-rating-preview/${matchId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to get match rating preview");
  return await response.json();
}

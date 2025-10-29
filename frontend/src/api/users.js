const BASE_URL = "http://127.0.0.1:8000"; // or your deployed backend URL

export async function createUser(userData) {
  const response = await fetch(`${BASE_URL}/users/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Failed to create user");
  return await response.json();
}

export async function getUser(userId) {
  const response = await fetch(`${BASE_URL}/users/${userId}`);
  if (!response.ok) throw new Error("User not found");
  return await response.json();
}

export async function updateUser(userId, userData) {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Failed to update user");
  return await response.json();
}

export async function deleteUser(userId) {
  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete user");
  return await response.json();
}

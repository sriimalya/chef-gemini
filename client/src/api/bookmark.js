import { getAccessToken } from "../auth/tokenStore";

export async function addBookmark(id) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/bookmark/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to bookmark");
}

export async function removeBookmark(id) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/bookmark/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  });

  if (!res.ok) throw new Error("Failed to unbookmark");
}

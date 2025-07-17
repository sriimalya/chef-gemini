import { getAccessToken } from "../auth/tokenStore";

export async function fetchRecipe(ingredients, signal) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/get-recipe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
    },
    body: JSON.stringify({ ingredients }),
    signal,
  });
  if (res.status === 401) throw new Error("Session timed out. Please refesh.");
  if (res.status === 429) throw new Error("You've hit the limit. Please try again after some time.");
  if (!res.ok) throw new Error("Failed to fetch recipe");
  return res.body?.pipeThrough(new TextDecoderStream()).getReader();
}

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiFetch(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const CATEGORIES = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

export const AMENITIES = [
  "Lighting Kit",
  "Soundproofing",
  "Green Screen",
  "Cyc Wall",
  "Podcast Mics",
  "Instruments",
  "Backdrops",
  "Wi-Fi",
  "Parking",
  "Air Conditioning",
];

export function studioIdOf(item) {
  if (!item) return null;
  if (typeof item === "string") return item;
  return item.studioId || item.studio?._id || item._id || null;
}

export function studioOf(item) {
  if (!item) return null;
  if (item.title) return item;
  if (item.studio) return item.studio;
  return item;
}

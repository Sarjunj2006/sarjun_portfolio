// Base URL of your portfolio-backend server.
// - Locally, defaults to your uvicorn dev server.
// - In production (Vercel), set VITE_API_BASE in your Vercel project's
//   environment variables to your deployed Render backend URL, e.g.
//   https://your-backend.onrender.com
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

/**
 * Fetches JSON from the backend. If the backend is unreachable, times out,
 * or returns an error, silently falls back to the provided default data
 * so the site still renders normally (e.g. when deployed without a
 * running backend).
 */
export async function fetchContent(endpoint, fallback) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${API_BASE}${endpoint}`, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) throw new Error(`Bad response: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`[CMS] Could not load ${endpoint}, using default content.`, err.message);
    return fallback;
  }
}

/**
 * Builds a full image URL from a stored value. Handles both:
 * - A Cloudinary URL (already a full https:// link) - used as-is.
 * - A local filename (dev mode) - prefixed with the backend's /uploads/ path.
 */
export function imageUrl(value) {
  if (!value) return null;
  if (value.startsWith("http")) return value;
  return `${API_BASE}/uploads/${value}`;
}

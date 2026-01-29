// api.js
const DEFAULT_API = "http://localhost:4000";
export const API = import.meta.env.VITE_API_URL || DEFAULT_API;

export function authHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getContent() {
  const res = await fetch(`${API}/content`, {
    headers: { ...authHeaders() },
  });
  return res.json();
}

export async function putContentValue(key, value) {
  const res = await fetch(`${API}/content/${encodeURIComponent(key)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ value: value ?? "" }),
  });

  const data = await res.json();
  return { ok: res.ok, data };
}

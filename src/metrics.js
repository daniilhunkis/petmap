// metrics.js

const BACKEND_URL = "https://petmap-backend.onrender.com"; // ← меняй на свой, если другой

export function logEvent(event, details = {}) {
  const time = new Date().toISOString();
  const payload = { event, time, ...details };
  fetch(`${BACKEND_URL}/metrics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => {});
  console.log("[METRIC]", payload);
}

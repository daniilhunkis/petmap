// src/metrics.js

export function logEvent(event, details = {}) {
  const time = new Date().toISOString();
  const payload = { event, time, ...details };
  fetch("http://localhost:8000/api/metrics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => {});
  console.log("[METRIC]", payload);
}

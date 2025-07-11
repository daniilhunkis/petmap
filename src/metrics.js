// src/metrics.js
import { BACKEND_URL } from "./api"; 

export function logEvent(event, info) {
  fetch(`${BACKEND_URL}/metrics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ event, info }),
  });
}

// src/api.js

// Укажи твой backend адрес:
export const BACKEND_URL = "https://petmap-backend.onrender.com";

// Везде в коде используй так:
export function sendMetric(data) {
  return fetch(`${BACKEND_URL}/metrics`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

// Пример запроса обратной связи:
export function sendFeedback(data) {
  return fetch(`${BACKEND_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

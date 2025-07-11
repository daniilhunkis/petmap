import React, { useState } from "react";

const BACKEND_URL = "https://petmap-backend.onrender.com"; // ← тот же адрес

const FeedbackForm = ({ onBack }) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      contact,
      message,
      time: new Date().toISOString()
    };
    try {
      await fetch(`${BACKEND_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      setSent(true);
      setName(""); setContact(""); setMessage("");
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      alert("Ошибка отправки. Попробуйте ещё раз!");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 420, margin: "0 auto" }}>
      <h2 style={{ color: "#4c38f2" }}>📩 Связь с нами</h2>
      {!sent ? (
        <form onSubmit={handleSend} style={{
          background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px #e7e5fb", padding: 22, margin: "22px 0"
        }}>
          <input
            type="text"
            placeholder="Ваше имя"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 12, borderRadius: 8, border: "1px solid #e0dfff", padding: "10px" }}
          />
          <input
            type="text"
            placeholder="Телеграм или e-mail"
            value={contact}
            onChange={e => setContact(e.target.value)}
            required
            style={{ width: "100%", marginBottom: 12, borderRadius: 8, border: "1px solid #e0dfff", padding: "10px" }}
          />
          <textarea
            placeholder="Ваше сообщение"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            rows={4}
            style={{ width: "100%", borderRadius: 8, border: "1px solid #e0dfff", padding: "10px" }}
          />
          <button
            type="submit"
            style={{
              marginTop: 14, background: "#4c38f2", color: "#fff", border: "none",
              borderRadius: 8, padding: "10px 24px", fontWeight: 600, cursor: "pointer"
            }}>
            Отправить
          </button>
        </form>
      ) : (
        <div style={{
          background: "#fff", borderRadius: 14, boxShadow: "0 2px 12px #e7e5fb",
          padding: 32, margin: "22px 0", textAlign: "center", color: "#4c38f2"
        }}>
          Спасибо! Ваше сообщение отправлено.
        </div>
      )}
      <button onClick={onBack} style={{ marginTop: 8 }}>Назад</button>
    </div>
  );
};

export default FeedbackForm;

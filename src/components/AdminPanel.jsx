import React from "react";

const AdminPanel = ({ onClose }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "#fff",
      zIndex: 2000,
      padding: 40,
      overflowY: "auto",
    }}
  >
    <button
      onClick={onClose}
      style={{
        position: "absolute",
        top: 16,
        right: 20,
        fontSize: 20,
        background: "transparent",
        border: "none",
        color: "#4c38f2",
        cursor: "pointer",
      }}
    >
      ✕
    </button>
    <h2>Админка PetMap</h2>
    <p>Здесь будут метрики, обратная связь, сторисы и всё, что захочешь!</p>
  </div>
);

export default AdminPanel;

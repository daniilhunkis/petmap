import React from "react";

const MainMenu = ({ onNavigate }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "12px", margin: "24px" }}>
    <button onClick={() => onNavigate("map")}>🗺️ Карта клиник</button>
    <button onClick={() => onNavigate("materials")}>📚 Полезные материалы</button>
    <button onClick={() => onNavigate("consult")}>💬 Консультации (скоро)</button>
    <button onClick={() => onNavigate("hotel")}>🐶 Передержка (скоро)</button>
    <button onClick={() => onNavigate("parks")}>🌳 Места для выгула (скоро)</button>
    <button onClick={() => onNavigate("feedback")}>📩 Связь с нами</button>
  </div>
);

export default MainMenu;

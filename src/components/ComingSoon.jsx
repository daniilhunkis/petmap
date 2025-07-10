import React from "react";

const ComingSoon = ({ title, onBack }) => (
  <div style={{ padding: "24px", textAlign: "center" }}>
    <h2>{title}</h2>
    <p>Этот раздел появится совсем скоро!</p>
    <button onClick={onBack} style={{ marginTop: 20 }}>Назад</button>
  </div>
);

export default ComingSoon;

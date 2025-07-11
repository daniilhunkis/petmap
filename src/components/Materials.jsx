import React, { useState, useEffect } from "react";
import { logEvent } from "../metrics";
import { BACKEND_URL } from "../config";

const Materials = ({ onBack }) => {
  const [opened, setOpened] = useState(null);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/materials`)
      .then(r => r.json())
      .then(setMaterials);
  }, []);

  const handleOpenMaterial = (i) => {
    logEvent("open_material", { index: i, title: materials[i].title });
    setOpened(i);
  };

  return (
    <div style={{ padding: 24, maxWidth: 440, margin: "0 auto" }}>
      <h2 style={{ color: "#4c38f2" }}>📚 Полезные материалы</h2>
      {opened === null ? (
        <ul style={{ padding: 0, listStyle: "none" }}>
          {materials.map((mat, i) => (
            <li
              key={mat.id}
              onClick={() => handleOpenMaterial(i)}
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 1px 6px #e7e5fb",
                margin: "16px 0",
                padding: "18px 18px",
                cursor: "pointer",
                fontWeight: 600,
                color: "#4c38f2",
                transition: "background 0.2s"
              }}
            >
              {mat.title}
            </li>
          ))}
        </ul>
      ) : (
        <div style={{
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 1px 6px #e7e5fb",
          margin: "16px 0",
          padding: "24px 18px",
        }}>
          <h3 style={{ color: "#4c38f2", fontWeight: 700, marginBottom: 10 }}>{materials[opened].title}</h3>
          <div style={{ whiteSpace: "pre-line", color: "#222" }}>{materials[opened].text}</div>
          <button onClick={() => setOpened(null)} style={{ marginTop: 24 }}>Назад к списку</button>
        </div>
      )}
      <button onClick={onBack} style={{ marginTop: 20 }}>Назад</button>
    </div>
  );
};

export default Materials;

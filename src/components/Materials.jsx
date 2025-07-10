import React, { useState } from "react";
import { logEvent } from "../metrics";

const materials = [
  {
    title: "Как выбрать ветклинику?",
    text: "Выбирайте клинику с хорошими отзывами, современным оборудованием и опытными специалистами. Всегда обращайте внимание на чистоту и атмосферу в помещении. Не стесняйтесь задавать вопросы врачу!"
  },
  {
    title: "Календарь прививок для собак и кошек",
    text: "1. Первая прививка — 2 месяца\n2. Вторая — 3 месяца\n3. Ежегодные повторные прививки — раз в год\n(Подробности уточняйте у ветеринара)"
  },
  {
    title: "Первая помощь при отравлении",
    text: "Если ваш питомец отравился: 1) Не давайте еду и воду. 2) Срочно обратитесь в клинику. 3) Не пытайтесь лечить самостоятельно. Запомните симптомы (рвота, слабость, судороги)."
  },
  {
    title: "Что положить в аптечку для питомца",
    text: "Стерильные салфетки, бинт, перекись водорода, активированный уголь, средства от клещей, телефон круглосуточной ветклиники."
  },
  {
    title: "Правила выгула в городе",
    text: "Используйте поводок и намордник, убирайте за питомцем, уважайте других людей и животных. Помните о правилах выгула в вашем городе."
  }
];

const Materials = ({ onBack }) => {
  const [opened, setOpened] = useState(null);

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
              key={i}
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

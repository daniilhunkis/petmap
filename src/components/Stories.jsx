import React from "react";

const stories = [
  {
    title: "Вакцинация летом",
    image: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
    text: "Не забывайте делать сезонные прививки! Защитите своего питомца.",
  },
  {
    title: "5 ошибок при выборе ветклиники",
    image: "https://cdn-icons-png.flaticon.com/512/616/616430.png",
    text: "Сохрани наши советы, чтобы выбрать лучшую клинику.",
  },
  {
    title: "Что делать при укусах клещей?",
    image: "https://cdn-icons-png.flaticon.com/512/616/616494.png",
    text: "Чек-лист по первой помощи для питомцев."
  },
];

const Stories = () => (
  <div style={{ display: "flex", overflowX: "auto", gap: 12, margin: "16px 0 24px 0", padding: "0 12px" }}>
    {stories.map((story, i) => (
      <div key={i} style={{
        minWidth: 170, maxWidth: 170,
        borderRadius: 16,
        background: "#fff",
        boxShadow: "0 2px 12px 0 #e7e5fb",
        padding: 12,
        flex: "0 0 auto"
      }}>
        <div style={{ textAlign: "center" }}>
          <img src={story.image} alt="" width={64} height={64} style={{ marginBottom: 10 }} />
          <div style={{ fontWeight: 600, marginBottom: 6, color: "#4c38f2" }}>{story.title}</div>
          <div style={{ fontSize: 14, color: "#222" }}>{story.text}</div>
        </div>
      </div>
    ))}
  </div>
);

export default Stories;

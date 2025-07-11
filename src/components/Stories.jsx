import React, { useState } from "react";

// Моковые данные, заменишь на свои/из админки
const storiesData = [
  { id: 1, img: "https://placekitten.com/120/120", title: "Лето с питомцем", viewed: false, likes: 0 },
  { id: 2, img: "https://placekitten.com/121/120", title: "Чеклист для поездки", viewed: true, likes: 3 },
  { id: 3, img: "https://placekitten.com/122/120", title: "Что делать при жаре", viewed: false, likes: 5 },
];

function Stories() {
  const [stories, setStories] = useState(storiesData);

  const handleView = (id) => {
    setStories(stories.map(s => s.id === id ? { ...s, viewed: true } : s));
  };
  const handleLike = (id) => {
    setStories(stories.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s));
  };

  return (
    <div style={{
      display: "flex", overflowX: "auto", gap: 16, padding: "20px 12px 12px 18px",
      marginBottom: 2
    }}>
      {stories.map(story => (
        <div key={story.id} style={{ textAlign: "center", minWidth: 68 }}>
          <div
            onClick={() => handleView(story.id)}
            style={{
              border: `3.3px solid ${story.viewed ? "#c7c7d6" : "#4c38f2"}`,
              borderRadius: "50%", width: 63, height: 63, overflow: "hidden",
              boxShadow: story.viewed ? "none" : "0 2px 7px #e6e4f7", cursor: "pointer",
              transition: "border 0.23s"
            }}>
            <img src={story.img} alt={story.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ fontSize: 12, marginTop: 7, color: "#444" }}>{story.title}</div>
          <button onClick={() => handleLike(story.id)}
            style={{
              border: "none", background: "none", cursor: "pointer",
              color: "#4c38f2", fontSize: 15, marginTop: 2
            }}>❤️ {story.likes}</button>
        </div>
      ))}
    </div>
  );
}

export default Stories;

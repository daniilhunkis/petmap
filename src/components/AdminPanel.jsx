import React, { useState, useEffect } from "react";
import { BACKEND_URL } from "../config"; // если вынесешь url в config.js

function TabButton({ active, onClick, children }) {
  return (
    <button onClick={onClick}
      style={{
        background: active ? "#4c38f2" : "#fff",
        color: active ? "#fff" : "#4c38f2",
        border: "2px solid #4c38f2",
        borderRadius: 22,
        fontWeight: 700,
        fontFamily: "Inter, sans-serif",
        fontSize: 15,
        padding: "8px 25px",
        margin: "0 6px 0 0",
        marginBottom: 12,
        boxShadow: active ? "0 2px 10px #e0dfff" : undefined,
        cursor: "pointer",
        transition: "all .17s"
      }}>
      {children}
    </button>
  );
}

function AdminPanel() {
  const [tab, setTab] = useState("materials");
  const [materials, setMaterials] = useState([]);
  const [stories, setStories] = useState([]);
  const [matForm, setMatForm] = useState({ title: "", img: "", text: "" });
  const [storyForm, setStoryForm] = useState({ title: "", img: "", url: "" });

  // Загрузка существующих материалов/сторис
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/materials`).then(r => r.json()).then(setMaterials);
    fetch(`${BACKEND_URL}/api/stories`).then(r => r.json()).then(setStories);
  }, []);

  // Добавить статью
  const handleAddMaterial = (e) => {
    e.preventDefault();
    fetch(`${BACKEND_URL}/api/materials`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(matForm)
    }).then(res => res.json())
      .then(mat => setMaterials([mat, ...materials]));
    setMatForm({ title: "", img: "", text: "" });
  };

  // Добавить сторис
  const handleAddStory = (e) => {
    e.preventDefault();
    fetch(`${BACKEND_URL}/api/stories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(storyForm)
    }).then(res => res.json())
      .then(story => setStories([story, ...stories]));
    setStoryForm({ title: "", img: "", url: "" });
  };

  // Удаление
  const handleDelMat = (id) => {
    fetch(`${BACKEND_URL}/api/materials/${id}`, { method: "DELETE" }).then(() =>
      setMaterials(materials.filter(m => m.id !== id))
    );
  };
  const handleDelStory = (id) => {
    fetch(`${BACKEND_URL}/api/stories/${id}`, { method: "DELETE" }).then(() =>
      setStories(stories.filter(s => s.id !== id))
    );
  };

  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: 24, fontFamily: "Inter, sans-serif" }}>
      <h1 style={{ color: "#4c38f2" }}>Админка</h1>
      <div>
        <TabButton active={tab === "materials"} onClick={() => setTab("materials")}>Статьи</TabButton>
        <TabButton active={tab === "stories"} onClick={() => setTab("stories")}>Сторисы</TabButton>
      </div>
      {tab === "materials" &&
        <div>
          <h3>Добавить статью</h3>
          <form onSubmit={handleAddMaterial} style={{ marginBottom: 22 }}>
            <input placeholder="Заголовок" value={matForm.title} onChange={e => setMatForm(f => ({ ...f, title: e.target.value }))} required style={{ marginRight: 8, padding: 8, borderRadius: 8 }} />
            <input placeholder="Картинка (URL)" value={matForm.img} onChange={e => setMatForm(f => ({ ...f, img: e.target.value }))} required style={{ marginRight: 8, padding: 8, borderRadius: 8 }} />
            <input placeholder="Текст (коротко)" value={matForm.text} onChange={e => setMatForm(f => ({ ...f, text: e.target.value }))} required style={{ marginRight: 8, padding: 8, borderRadius: 8, width: 220 }} />
            <button type="submit" style={{ background: "#4c38f2", color: "#fff", borderRadius: 8, padding: "8px 20px", marginLeft: 8 }}>Добавить</button>
          </form>
          <div>
            {materials.map(mat => (
              <div key={mat.id} style={{
                background: "#fff", borderRadius: 20, boxShadow: "0 1px 10px #edeafd",
                marginBottom: 13, padding: 16, display: "flex", alignItems: "center"
              }}>
                <img src={mat.img} alt="" style={{ width: 62, height: 62, borderRadius: 12, objectFit: "cover", marginRight: 15 }} />
                <div>
                  <div style={{ color: "#4c38f2", fontWeight: 700, fontSize: 17 }}>{mat.title}</div>
                  <div style={{ color: "#6d6791", fontSize: 14 }}>{mat.text}</div>
                </div>
                <button onClick={() => handleDelMat(mat.id)} style={{
                  background: "#eee1ff", color: "#aa73f4", border: "none", borderRadius: 12,
                  marginLeft: "auto", fontWeight: 700, fontSize: 16, cursor: "pointer", padding: "6px 13px"
                }}>Удалить</button>
              </div>
            ))}
          </div>
        </div>
      }
      {tab === "stories" &&
        <div>
          <h3>Добавить сторис</h3>
          <form onSubmit={handleAddStory} style={{ marginBottom: 22 }}>
            <input placeholder="Заголовок" value={storyForm.title} onChange={e => setStoryForm(f => ({ ...f, title: e.target.value }))} required style={{ marginRight: 8, padding: 8, borderRadius: 8 }} />
            <input placeholder="Картинка (URL)" value={storyForm.img} onChange={e => setStoryForm(f => ({ ...f, img: e.target.value }))} required style={{ marginRight: 8, padding: 8, borderRadius: 8 }} />
            <input placeholder="Ссылка (фото/видео)" value={storyForm.url} onChange={e => setStoryForm(f => ({ ...f, url: e.target.value }))} required style={{ marginRight: 8, padding: 8, borderRadius: 8, width: 200 }} />
            <button type="submit" style={{ background: "#4c38f2", color: "#fff", borderRadius: 8, padding: "8px 20px", marginLeft: 8 }}>Добавить</button>
          </form>
          <div>
            {stories.map(story => (
              <div key={story.id} style={{
                background: "#fff", borderRadius: 20, boxShadow: "0 1px 10px #edeafd",
                marginBottom: 13, padding: 16, display: "flex", alignItems: "center"
              }}>
                <img src={story.img} alt="" style={{ width: 62, height: 62, borderRadius: 12, objectFit: "cover", marginRight: 15 }} />
                <div>
                  <div style={{ color: "#4c38f2", fontWeight: 700, fontSize: 17 }}>{story.title}</div>
                  <div style={{ color: "#6d6791", fontSize: 14 }}>{story.url}</div>
                </div>
                <button onClick={() => handleDelStory(story.id)} style={{
                  background: "#eee1ff", color: "#aa73f4", border: "none", borderRadius: 12,
                  marginLeft: "auto", fontWeight: 700, fontSize: 16, cursor: "pointer", padding: "6px 13px"
                }}>Удалить</button>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  );
}

export default AdminPanel;

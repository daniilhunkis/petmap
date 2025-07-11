import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

Chart.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

const BACKEND_URL = "https://petmap-backend.onrender.com";

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}

function AdminPanel({ onClose }) {
  const [metrics, setMetrics] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [stories, setStories] = useState([]);
  const [stats, setStats] = useState({metrics: 0, feedback: 0, stories: 0});
  const [loading, setLoading] = useState(true);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyContent, setStoryContent] = useState("");

  const loadData = async () => {
    setLoading(true);
    const [metricsRes, feedbackRes, storiesRes, statsRes] = await Promise.all([
      fetch(`${BACKEND_URL}/metrics`).then(r => r.json()),
      fetch(`${BACKEND_URL}/feedback`).then(r => r.json()),
      fetch(`${BACKEND_URL}/stories`).then(r => r.json()),
      fetch(`${BACKEND_URL}/admin_stats`).then(r => r.json())
    ]);
    setMetrics(metricsRes.reverse());
    setFeedback(feedbackRes.reverse());
    setStories(storiesRes.reverse());
    setStats(statsRes);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line
  }, []);

  const handleAddStory = async (e) => {
    e.preventDefault();
    if (!storyTitle.trim() || !storyContent.trim()) return;
    await fetch(`${BACKEND_URL}/stories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: storyTitle,
        content: storyContent,
        time: new Date().toISOString()
      }),
    });
    setStoryTitle(""); setStoryContent("");
    await loadData();
  };

  const handleDeleteStory = async (id) => {
    await fetch(`${BACKEND_URL}/stories/${id}`, { method: "DELETE" });
    await loadData();
  };

  const handleDownloadCSV = async (type) => {
    const url = type === "metrics" ? "/metrics_csv" : "/feedback_csv";
    const res = await fetch(BACKEND_URL + url);
    const data = await res.json();
    downloadCSV(data.csv, `${type}_${Date.now()}.csv`);
  };

  // График: кол-во событий/отзывов по дням
  const dayCounts = {};
  metrics.forEach(m => {
    const day = (m.time || "").slice(0, 10);
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  const days = Object.keys(dayCounts).sort();
  const counts = days.map(d => dayCounts[d]);

  return (
    <div style={{ padding: 32, background: "#fff", minHeight: "100vh" }}>
      <button onClick={onClose} style={{ float: "right", fontSize: 18, color: "#4c38f2" }}>Выйти ✕</button>
      <h2>Админка PetMap</h2>

      <div style={{marginBottom: 24, display: "flex", gap: 32, flexWrap: "wrap"}}>
        <div style={{background:"#f3f1fc", padding:16, borderRadius:12}}>
          <b>Метрик:</b> {stats.metrics}
        </div>
        <div style={{background:"#f3f1fc", padding:16, borderRadius:12}}>
          <b>Обратной связи:</b> {stats.feedback}
        </div>
        <div style={{background:"#f3f1fc", padding:16, borderRadius:12}}>
          <b>Сторис:</b> {stats.stories}
        </div>
        <button onClick={loadData} style={{
          marginLeft: "auto", background:"#4c38f2", color:"#fff", border:"none",
          borderRadius:8, padding:"10px 18px", fontWeight:600, cursor:"pointer"
        }}>Обновить</button>
      </div>

      <h3>График активности (метрики по дням)</h3>
      <div style={{ maxWidth: 600, marginBottom: 36 }}>
        <Line
          data={{
            labels: days,
            datasets: [{ label: "Метрик за день", data: counts, borderColor: "#4c38f2" }]
          }}
        />
      </div>

      <h3>Stories</h3>
      <form onSubmit={handleAddStory} style={{
        display: "flex", gap: 12, marginBottom: 16, alignItems: "center"
      }}>
        <input
          type="text"
          placeholder="Заголовок"
          value={storyTitle}
          onChange={e => setStoryTitle(e.target.value)}
          required
          style={{borderRadius:8, border:"1px solid #e0dfff", padding: "8px 12px", flex: "0 0 160px"}}
        />
        <input
          type="text"
          placeholder="Текст"
          value={storyContent}
          onChange={e => setStoryContent(e.target.value)}
          required
          style={{borderRadius:8, border:"1px solid #e0dfff", padding: "8px 12px", flex: "1 1 auto"}}
        />
        <button type="submit" style={{
          background:"#4c38f2", color:"#fff", border:"none", borderRadius:8, padding:"10px 18px", fontWeight:600, cursor:"pointer"
        }}>Добавить</button>
      </form>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: 36 }}>
        {stories.map(story => (
          <li key={story.id} style={{
            background: "#f3f1fc", borderRadius: 10, padding: "12px 20px", marginBottom: 10,
            display: "flex", alignItems: "center", justifyContent: "space-between"
          }}>
            <div>
              <b>{story.title}</b> — {story.content}
              <div style={{fontSize:12, color:"#aaa"}}>{story.time?.replace("T", " ").slice(0, 16)}</div>
            </div>
            <button onClick={() => handleDeleteStory(story.id)} style={{
              background: "none", color: "#ff595a", border: "none", fontSize: 18, cursor: "pointer"
            }}>🗑</button>
          </li>
        ))}
      </ul>

      <h3>Метрики <button onClick={() => handleDownloadCSV("metrics")} style={{
        marginLeft: 8, background: "#e0dfff", border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer"
      }}>Скачать CSV</button></h3>
      <div style={{ overflowX: "auto", marginBottom: 32 }}>
        <table border="1" cellPadding={6} style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Время</th>
              <th>Событие</th>
              <th>Детали</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m, i) => (
              <tr key={i}>
                <td>{m.time}</td>
                <td>{m.event}</td>
                <td>{JSON.stringify(m)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Обратная связь <button onClick={() => handleDownloadCSV("feedback")} style={{
        marginLeft: 8, background: "#e0dfff", border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer"
      }}>Скачать CSV</button></h3>
      <div style={{ overflowX: "auto" }}>
        <table border="1" cellPadding={6} style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Время</th>
              <th>Имя</th>
              <th>Контакт</th>
              <th>Сообщение</th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((f, i) => (
              <tr key={i}>
                <td>{f.time}</td>
                <td>{f.name}</td>
                <td>{f.contact}</td>
                <td>{f.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && <div style={{marginTop:32}}>Загрузка...</div>}
    </div>
  );
}

export default AdminPanel;

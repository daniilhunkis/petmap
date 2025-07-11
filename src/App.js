import React, { useState } from "react";
import BottomMenu from "./components/BottomMenu";
import MapScreen from "./components/MapScreen";
import Materials from "./components/Materials";
import FeedbackForm from "./components/FeedbackForm";
import ComingSoon from "./components/ComingSoon";
import WelcomeSlides from "./components/WelcomeSlides";
import Stories from "./components/Stories";

// Флаг обучалки (localStorage)
const WELCOME_KEY = "petmap_welcome_seen";

function App() {
  // Страница: main, map, materials, consult, feedback
  const [page, setPage] = useState("main");
  const [showWelcome, setShowWelcome] = useState(
    !localStorage.getItem(WELCOME_KEY)
  );

  // После обучалки
  const handleWelcomeDone = () => {
    setShowWelcome(false);
    localStorage.setItem(WELCOME_KEY, "1");
  };

  return (
    <div style={{ background: "#f8f7ff", minHeight: "100vh" }}>
      {/* Обучалка только для первого входа */}
      {showWelcome ? (
        <WelcomeSlides onDone={handleWelcomeDone} />
      ) : (
        <>
          {page === "main" && (
            <>
              {/* Сторисы */}
              <Stories />

              {/* Кнопка На карту */}
              <button
                onClick={() => setPage("map")}
                style={{
                  background: "#4c38f2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 18,
                  padding: "16px 0",
                  fontWeight: 800,
                  fontSize: 20,
                  width: "93%",
                  margin: "20px 3.5%",
                  marginBottom: 12,
                  boxShadow: "0 4px 18px #e0dfff",
                  letterSpacing: 0.3,
                  cursor: "pointer"
                }}>
                🗺️ Открыть карту ветклиник
              </button>

              {/* Полезные материалы */}
              <h3 style={{ color: "#4c38f2", fontWeight: 700, margin: "0 0 12px 22px" }}>
                Полезные материалы
              </h3>
              <div style={{
                display: "flex", flexWrap: "wrap", gap: 18, padding: "0 13px 76px 13px"
              }}>
                {/* Материалы — пример статей, заменишь потом из админки */}
                <div style={{
                  background: "#fff", borderRadius: 17, boxShadow: "0 1px 12px #edeafd",
                  width: 160, minHeight: 135, overflow: "hidden"
                }}>
                  <img src="https://placekitten.com/160/85" alt="" style={{
                    width: "100%", height: 85, objectFit: "cover"
                  }} />
                  <div style={{
                    padding: "7px 10px", fontWeight: 600, fontSize: 14, color: "#4c38f2"
                  }}>
                    Клещи и защита летом
                  </div>
                </div>
                {/* Добавь ещё превью статей аналогично */}
              </div>
            </>
          )}
          {page === "map" && <MapScreen onBack={() => setPage("main")} />}
          {page === "materials" && <Materials onBack={() => setPage("main")} />}
          {page === "feedback" && <FeedbackForm onBack={() => setPage("main")} />}
          {page === "consult" && (
            <ComingSoon title="💬 Консультации (скоро)" onBack={() => setPage("main")} />
          )}

          {/* Нижнее меню */}
          <BottomMenu active={page === "main" ? "materials" : page} onSelect={setPage} />
        </>
      )}
    </div>
  );
}

export default App;

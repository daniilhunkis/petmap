import React, { useState } from "react";
import BottomMenu from "./components/BottomMenu";
import MapScreen from "./components/MapScreen";
import Materials from "./components/Materials";
import FeedbackForm from "./components/FeedbackForm";
import ComingSoon from "./components/ComingSoon";
import WelcomeSlides from "./components/WelcomeSlides";
import Stories from "./components/Stories";

const WELCOME_KEY = "petmap_welcome_seen";
function App() {
  const [page, setPage] = useState("main");
  const [showWelcome, setShowWelcome] = useState(
    !localStorage.getItem(WELCOME_KEY)
  );
  const handleWelcomeDone = () => {
    setShowWelcome(false);
    localStorage.setItem(WELCOME_KEY, "1");
  };
  return (
    <div style={{ background: "#f8f7ff", minHeight: "100vh" }}>
      {/* Обучалка на весь экран */}
      {showWelcome ? (
        <div style={{
          position: "fixed",
          top: 0, left: 0, width: "100vw", height: "100vh",
          zIndex: 500,
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <WelcomeSlides onDone={handleWelcomeDone} />
        </div>
      ) : (
        <>
          {page === "main" && (
            <>
              <Stories />
              <button
                onClick={() => setPage("map")}
                style={{
                  background: "#4c38f2",
                  color: "#fff",
                  border: "none",
                  borderRadius: 22,
                  padding: "16px 0",
                  fontWeight: 800,
                  fontFamily: "Inter, sans-serif",
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
              <h3 style={{ color: "#4c38f2", fontWeight: 700, margin: "0 0 12px 22px" }}>
                Полезные материалы
              </h3>
              <div style={{
                display: "flex", flexWrap: "wrap", gap: 18, padding: "0 13px 76px 13px"
              }}>
                {/* Пример статей */}
                <div style={{
                  background: "#fff", borderRadius: 22, boxShadow: "0 1px 12px #edeafd",
                  width: 160, minHeight: 135, overflow: "hidden"
                }}>
                  <img src="https://placekitten.com/160/85" alt="" style={{
                    width: "100%", height: 85, objectFit: "cover"
                  }} />
                  <div style={{
                    padding: "7px 10px", fontWeight: 600, fontSize: 14, color: "#4c38f2",
                    fontFamily: "Inter, sans-serif"
                  }}>
                    Клещи и защита летом
                  </div>
                </div>
                {/* Ещё статьи добавь по аналогии */}
              </div>
            </>
          )}
          {page === "map" && <MapScreen onBack={() => setPage("main")} />}
          {page === "materials" && <Materials onBack={() => setPage("main")} />}
          {page === "feedback" && <FeedbackForm onBack={() => setPage("main")} />}
          {page === "consult" && (
            <ComingSoon title="💬 Консультации (скоро)" onBack={() => setPage("main")} />
          )}
          {/* BottomMenu везде кроме welcome */}
          <BottomMenu active={page} onSelect={setPage} />
        </>
      )}
    </div>
  );
}
export default App;

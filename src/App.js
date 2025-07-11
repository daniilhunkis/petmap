import React, { useState, useEffect } from "react";
import MainMenu from "./components/MainMenu";
import MapScreen from "./components/MapScreen";
import Materials from "./components/Materials";
import FeedbackForm from "./components/FeedbackForm";
import ComingSoon from "./components/ComingSoon";
import WelcomeSlides from "./components/WelcomeSlides";
import Stories from "./components/Stories";
import { logEvent } from "./metrics";

// Константы для доступа к админке
const ADMIN_USER_ID = 776430926;
const ADMIN_PASSWORD = "petmap2024"; // Можешь поменять пароль

function AdminPanel({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "#fff",
        zIndex: 2000,
        padding: 40,
        overflowY: "auto",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          right: 20,
          fontSize: 20,
          background: "transparent",
          border: "none",
          color: "#4c38f2",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
      <h2>Админка PetMap</h2>
      <p>Здесь будет таблица метрик, обратной связи и управление материалами/сторисами.</p>
      {/* Таблицы, формы, экспорт и прочее — потом */}
    </div>
  );
}

function App() {
  const [page, setPage] = useState("welcome");
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Проверяем user_id в Telegram Mini App
  useEffect(() => {
    if (
      window.Telegram &&
      window.Telegram.WebApp &&
      window.Telegram.WebApp.initDataUnsafe &&
      window.Telegram.WebApp.initDataUnsafe.user
    ) {
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      if (user && user.id === ADMIN_USER_ID) {
        setShowAdminButton(true);
      }
    }
  }, []);

  // Логируем каждый переход по разделам
  const handleNavigate = (to) => {
    logEvent("open_section", { section: to });
    setPage(to);
  };

  // Вход в админку (пароль)
  const handleAdminLogin = () => {
    const password = window.prompt("Введите пароль для входа в админку:");
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
    } else {
      alert("Неверный пароль!");
    }
  };

  // Выход из админки
  const handleAdminLogout = () => {
    setIsAdmin(false);
  };

  // Если в админке — показываем только её
  if (isAdmin) {
    return <AdminPanel onClose={handleAdminLogout} />;
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#f8f7ff", minHeight: "100vh", color: "#2d2a32" }}>
      <h1 style={{ textAlign: "center", color: "#4c38f2" }}>🐾 PetMap</h1>

      {/* Кнопка админки (появляется только для тебя) */}
      {showAdminButton && (
        <button
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            padding: "10px 18px",
            background: "#4c38f2",
            color: "#fff",
            borderRadius: "12px",
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            zIndex: 1000,
          }}
          onClick={handleAdminLogin}
        >
          Админка
        </button>
      )}

      {page === "welcome" && <WelcomeSlides onDone={() => handleNavigate("main")} />}
      {page === "main" && (
        <>
          <Stories />
          <MainMenu onNavigate={handleNavigate} />
        </>
      )}
      {page === "map" && <MapScreen onBack={() => handleNavigate("main")} />}
      {page === "materials" && <Materials onBack={() => handleNavigate("main")} />}
      {page === "feedback" && <FeedbackForm onBack={() => handleNavigate("main")} />}
      {page === "consult" && <ComingSoon title="💬 Консультации" onBack={() => handleNavigate("main")} />}
      {page === "hotel" && <ComingSoon title="🐶 Передержка" onBack={() => handleNavigate("main")} />}
      {page === "parks" && <ComingSoon title="🌳 Места для выгула" onBack={() => handleNavigate("main")} />}
    </div>
  );
}

export default App;

import React, { useState } from "react";
import MainMenu from "./components/MainMenu";
import MapScreen from "./components/MapScreen";
import Materials from "./components/Materials";
import FeedbackForm from "./components/FeedbackForm";
import ComingSoon from "./components/ComingSoon";
import WelcomeSlides from "./components/WelcomeSlides";
import Stories from "./components/Stories";
import AdminPanel from "./components/AdminPanel"; // смотри ниже

import { logEvent } from "./metrics";

function App() {
  const [page, setPage] = useState("welcome");
  const [isAdmin, setIsAdmin] = useState(false);

  // "секретный" способ входа в админку — по урлу + паролю
  React.useEffect(() => {
    if (window.location.pathname === "/admin" || window.location.hash === "#/admin") {
      // Можно сделать автологин из localStorage
      if (window.localStorage.getItem("isAdmin") === "yes") setIsAdmin(true);
      else {
        const password = window.prompt("Введите пароль для входа в админку:");
        if (password === "petmap2024") {
          setIsAdmin(true);
          window.localStorage.setItem("isAdmin", "yes");
        } else {
          alert("Неверный пароль!");
          window.location.replace("/"); // редирект на главную
        }
      }
    }
  }, []);

  const handleNavigate = (to) => {
    logEvent("open_section", { section: to });
    setPage(to);
  };

  if (isAdmin) {
    return <AdminPanel onClose={() => { setIsAdmin(false); window.location.replace("/"); }} />;
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#f8f7ff", minHeight: "100vh", color: "#2d2a32" }}>
      <h1 style={{ textAlign: "center", color: "#4c38f2" }}>🐾 PetMap</h1>
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

import React, { useState } from "react";
import MainMenu from "./components/MainMenu";
import MapScreen from "./components/MapScreen";
import Materials from "./components/Materials";
import FeedbackForm from "./components/FeedbackForm";
import ComingSoon from "./components/ComingSoon";
import WelcomeSlides from "./components/WelcomeSlides";
import Stories from "./components/Stories";
import { logEvent } from "./metrics";

function App() {
  const [page, setPage] = useState("welcome");

  // Логируем каждый переход по разделам
  const handleNavigate = (to) => {
    logEvent("open_section", { section: to });
    setPage(to);
  };

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

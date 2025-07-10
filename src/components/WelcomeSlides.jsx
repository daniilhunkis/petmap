import React, { useState } from "react";

const slides = [
  {
    title: "🐾 Добро пожаловать в PetMap!",
    text: "Ищи ближайшие ветклиники, читай полезные советы и следи за актуальными сторисами прямо в Telegram.",
  },
  {
    title: "🗺️ Карта ветклиник",
    text: "Используй карту, чтобы быстро найти нужную клинику в любом городе России. Всё просто и удобно!",
  },
  {
    title: "📚 Полезные материалы и сторисы",
    text: "Читайте советы, листайте сторисы и будьте в курсе важных новостей и лайфхаков для питомцев.",
  },
];

const WelcomeSlides = ({ onDone }) => {
  const [step, setStep] = useState(0);

  return (
    <div style={{
      maxWidth: 350,
      margin: "40px auto",
      padding: "32px 24px",
      background: "#fff",
      borderRadius: 20,
      boxShadow: "0 2px 24px 0 #e7e5fb"
    }}>
      <h2 style={{ color: "#4c38f2", marginBottom: 10 }}>{slides[step].title}</h2>
      <div style={{ marginBottom: 24, color: "#2d2a32" }}>{slides[step].text}</div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button
          disabled={step === 0}
          onClick={() => setStep(s => Math.max(0, s - 1))}
        >Назад</button>
        {step === slides.length - 1 ? (
          <button style={{ background: "#4c38f2", color: "#fff", borderRadius: 8, padding: "8px 20px" }} onClick={onDone}>Готово</button>
        ) : (
          <button style={{ background: "#4c38f2", color: "#fff", borderRadius: 8, padding: "8px 20px" }} onClick={() => setStep(s => s + 1)}>Далее</button>
        )}
      </div>
      <div style={{ marginTop: 20, textAlign: "center" }}>
        {slides.map((_, i) => (
          <span key={i} style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: i === step ? "#4c38f2" : "#e0dfff",
            margin: "0 3px"
          }}></span>
        ))}
      </div>
    </div>
  );
};

export default WelcomeSlides;

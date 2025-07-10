import React from "react";

const mapSrc =
  "https://yandex.ru/map-widget/v1/?um=constructor%3Afcc0e38e52b24c5552cbd1f86a7e9ebf74fceae857b0a1d9ad4138b4c5404b57&amp;source=constructor";

const MapScreen = ({ onBack }) => (
  <div style={{ padding: "24px" }}>
    <h2 style={{ color: "#4c38f2" }}>🗺️ Карта ветклиник</h2>
    <div style={{
      width: "100%",
      maxWidth: 430,
      height: 330,
      borderRadius: 18,
      overflow: "hidden",
      margin: "0 auto 18px auto",
      boxShadow: "0 2px 12px 0 #e7e5fb"
    }}>
      <iframe
        src={mapSrc}
        title="Yandex Map"
        width="100%"
        height="330"
        style={{ border: "none" }}
        allowFullScreen
        loading="lazy"
      />
    </div>
    <button onClick={onBack} style={{ marginTop: 10 }}>Назад</button>
    <div style={{ margin: "18px 0", color: "#888", fontSize: 13 }}>
      Используется карта Яндекс. Можно искать клиники по адресу или переключаться между городами.
    </div>
  </div>
);

export default MapScreen;

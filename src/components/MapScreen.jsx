import React, { useEffect, useRef, useState } from "react";

const YMAPS_API_KEY = "590a209d-e5ce-4f23-bca5-27a57772be40";
const PAW_ICON = "https://cdn-icons-png.flaticon.com/512/616/616408.png";

function MapScreen({ onBack }) {
  const mapRef = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Для красивой кнопки с иконкой
  function OpenButton({ checked, onClick }) {
    return (
      <button
        onClick={onClick}
        style={{
          position: "absolute",
          right: 24,
          bottom: 32,
          background: checked ? "#4c38f2" : "#fff",
          color: checked ? "#fff" : "#4c38f2",
          border: "2px solid #4c38f2",
          borderRadius: 32,
          boxShadow: "0 4px 22px #b9b5f33d",
          padding: "10px 22px 10px 18px",
          display: "flex",
          alignItems: "center",
          fontWeight: 700,
          fontSize: 16,
          zIndex: 1000,
          cursor: "pointer",
          transition: "all 0.22s",
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 21,
            height: 21,
            borderRadius: "50%",
            background: checked ? "#fff" : "#4c38f2",
            color: checked ? "#4c38f2" : "#fff",
            marginRight: 10,
            textAlign: "center",
            lineHeight: "23px",
            fontSize: 16,
            fontWeight: 900,
            boxShadow: checked ? "0 2px 10px #dedbfd" : "",
          }}
        >
          {checked ? "🔓" : "🔒"}
        </span>
        {checked ? "Только открытые" : "Показать все"}
      </button>
    );
  }

  useEffect(() => {
    if (mapRef.current) mapRef.current.innerHTML = "";
    const scriptId = "yandex-maps-script";
    let script = document.getElementById(scriptId);

    function initMap() {
      window.ymaps.ready(() => {
        let defaultCenter = [55.751244, 37.618423];
        const map = new window.ymaps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 13,
          controls: ["zoomControl", "searchControl", "geolocationControl"],
          type: "yandex#map",
        });

        // Минимализм: убираем лишнее
        map.controls.remove('trafficControl');
        map.controls.remove('fullscreenControl');
        map.controls.get('zoomControl').options.set({ size: "small" });

        // Геолокация
        map.controls.get('geolocationControl').events.add('locationchange', (e) => {
          const coords = e.get('geoObjects').get(0).geometry.getCoordinates();
          map.setCenter(coords, 14, { duration: 400 });
        });

        // Поиск организаций (ветклиник)
        const searchControl = map.controls.get('searchControl');
        searchControl.options.set('provider', 'yandex#search');
        searchControl.events.add("resultshow", () => {
          const results = searchControl.getResultsArray();
          results.forEach(obj => {
            const meta = obj.properties.get("CompanyMetaData");
            if (meta && meta.Categories) {
              const isVet = meta.Categories.some(cat =>
                /ветеринар|ветклиника|питомц|зоосалон/i.test(cat.name)
              );
              if (isVet) {
                const hours = meta.Hours;
                const isOpen = hours && hours.isCurrent;
                if (filterOpen && !isOpen) return;

                obj.options.set({
                  iconLayout: "default#image",
                  iconImageHref: PAW_ICON,
                  iconImageSize: [40, 40],
                  iconImageOffset: [-20, -20],
                  iconColor: isOpen ? "#4c38f2" : "#bbbbbb",
                  opacity: isOpen ? 1 : 0.5,
                });

                const rating = meta.Ratings && meta.Ratings[0] && meta.Ratings[0].value;
                const phones = meta.Phones && meta.Phones.length ? meta.Phones.map((p) => p.formatted).join(", ") : "";
                const reviews = meta.Reviews && meta.Reviews[0] && meta.Reviews[0].text;

                let balloonContent = `
                  <div style="
                    background: #fff;
                    border-radius: 20px;
                    box-shadow: 0 2px 16px #eee;
                    padding: 18px 18px 14px 18px;
                    max-width: 290px;
                    font-family: Inter, sans-serif;
                    min-width:200px;
                  ">
                    <div style="font-size:20px; font-weight:700; color:#4c38f2; margin-bottom:2px;">${meta.name}</div>
                    <div style="font-size:14px;color:#7d7b90; margin-bottom:6px;">${meta.address}</div>
                    <div style="display:flex;align-items:center;gap:8px;">
                      <span style="font-size:15px; color:${isOpen ? "#27ae60" : "#999"};">
                        <b>${isOpen ? "🟢 Открыто сейчас" : "🔴 Закрыто"}</b>
                      </span>
                      <span style="font-size:13px;color:#aaa">${hours ? hours.text : ""}</span>
                    </div>
                    ${rating ? `<div style="font-size:14px; margin:5px 0 0 0; color:#e7bb28;">⭐️ ${rating}</div>` : ""}
                    ${phones ? `
                      <button style="margin:10px 0 0 0;display:block;width:100%;background:#4c38f2;color:#fff;border:none;padding:8px 0 8px 0;border-radius:12px;font-weight:600;font-size:15px;cursor:pointer;"
                        onclick="window.open('tel:${phones.replace(/[^+\d]/g, '')}', '_self')">
                        Позвонить
                      </button>
                    ` : ""}
                    ${reviews ? `<div style="font-size:13px;color:#7d7b90; margin-top:7px; max-height:60px; overflow:hidden;"><i>“${reviews.slice(0,120)}...”</i></div>` : ""}
                  </div>
                `;
                obj.properties.set("balloonContent", balloonContent);
              }
            }
          });
        });

        // Поиск сразу ветклиник
        searchControl.search("ветеринарная клиника");
      });
    }

    if (!script) {
      script = document.createElement("script");
      script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YMAPS_API_KEY}&lang=ru_RU`;
      script.type = "text/javascript";
      script.id = scriptId;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      if (window.ymaps && window.ymaps.ready) {
        initMap();
      } else {
        script.onload = initMap;
      }
    }

    return () => {
      if (mapRef.current) mapRef.current.innerHTML = "";
    };
  }, [filterOpen]);

  // Стили full screen
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, width: "100vw", height: "100vh",
      zIndex: 100,
      background: "#f8f7ff"
    }}>
      <div ref={mapRef}
        style={{
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          boxShadow: "none",
        }} />
      <OpenButton
        checked={filterOpen}
        onClick={() => setFilterOpen(o => !o)}
      />
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          left: 24,
          top: 24,
          background: "#fff",
          color: "#4c38f2",
          border: "2px solid #4c38f2",
          borderRadius: 16,
          padding: "8px 32px",
          fontWeight: 700,
          fontSize: 17,
          boxShadow: "0 2px 10px #e6e4f7",
          cursor: "pointer",
          zIndex: 1001,
        }}>
        Назад
      </button>
    </div>
  );
}

export default MapScreen;

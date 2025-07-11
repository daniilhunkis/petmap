import React, { useEffect, useRef, useState } from "react";

const YMAPS_API_KEY = "590a209d-e5ce-4f23-bca5-27a57772be40";
const PAW_ICON = "https://cdn-icons-png.flaticon.com/512/616/616408.png"; // замени на свою SVG лапы

function MapScreen({ onBack }) {
  const mapRef = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [mapObject, setMapObject] = useState(null);

  // Получение геолокации пользователя (точно)
  const handleGeolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUserCoords(coords);
          if (mapObject) {
            mapObject.setCenter(coords, 14, { duration: 400 });
            // Добавим маркер "Вы здесь"
            const userPlacemark = new window.ymaps.Placemark(coords, {
              iconCaption: "Вы здесь"
            }, {
              preset: "islands#violetCircleDotIcon",
              iconColor: "#4c38f2"
            });
            mapObject.geoObjects.add(userPlacemark);
          }
        },
        err => alert("Геолокация недоступна или запрещена!")
      );
    }
  };

  // Основная инициализация карты
  useEffect(() => {
    if (mapRef.current) mapRef.current.innerHTML = "";
    const scriptId = "yandex-maps-script";
    let script = document.getElementById(scriptId);

    function initMap() {
      window.ymaps.ready(() => {
        const center = userCoords || [55.751244, 37.618423];
        const map = new window.ymaps.Map(mapRef.current, {
          center,
          zoom: 13,
          controls: [], // Убираем все стандартные контролы!
          type: "yandex#map",
        });
        setMapObject(map);

        // Кастомный маркер "Вы здесь"
        if (userCoords) {
          const userPlacemark = new window.ymaps.Placemark(userCoords, {
            iconCaption: "Вы здесь"
          }, {
            preset: "islands#violetCircleDotIcon",
            iconColor: "#4c38f2"
          });
          map.geoObjects.add(userPlacemark);
        }

        // Поиск ветклиник (через встроенный поиск Яндекса, либо вручную)
        // Для MVP: ищем "ветеринарная клиника" вокруг центра карты
        window.ymaps.geocode({
          kind: "biz",
          boundedBy: [
            [center[0] - 0.09, center[1] - 0.14],
            [center[0] + 0.09, center[1] + 0.14]
          ],
          results: 80,
          query: "ветеринарная клиника"
        }).then(res => {
          map.geoObjects.each(obj => map.geoObjects.remove(obj)); // очищаем старые маркеры
          if (userCoords) {
            const userPlacemark = new window.ymaps.Placemark(userCoords, {
              iconCaption: "Вы здесь"
            }, {
              preset: "islands#violetCircleDotIcon",
              iconColor: "#4c38f2"
            });
            map.geoObjects.add(userPlacemark);
          }
          res.geoObjects.each(obj => {
            const meta = obj.properties.get("CompanyMetaData");
            if (!meta) return;
            const hours = meta.Hours;
            const isOpen = hours && hours.isCurrent;
            if (filterOpen && !isOpen) return;

            obj.options.set({
              iconLayout: "default#image",
              iconImageHref: PAW_ICON,
              iconImageSize: [40, 40],
              iconImageOffset: [-20, -20],
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
            map.geoObjects.add(obj);
          });
        });
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

    return () => { if (mapRef.current) mapRef.current.innerHTML = ""; };
    // eslint-disable-next-line
  }, [filterOpen, userCoords]);

  // Фиксируем body на всю высоту (чтобы не скроллилось)
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
      {/* Кнопка геолокации */}
      <button
        onClick={handleGeolocate}
        style={{
          position: "absolute",
          right: 24,
          top: 24,
          background: "#fff",
          borderRadius: 20,
          border: "2px solid #4c38f2",
          color: "#4c38f2",
          padding: "12px 24px",
          boxShadow: "0 2px 10px #e6e4f7",
          zIndex: 101,
          fontWeight: 700,
          fontSize: 17,
          display: "flex",
          alignItems: "center"
        }}>
        <span role="img" aria-label="geo" style={{marginRight:8}}>📍</span> Геолокация
      </button>
      {/* Кнопка "Открыто сейчас" */}
      <button
        onClick={() => setFilterOpen(o => !o)}
        style={{
          position: "absolute",
          right: 24,
          bottom: 96,
          background: filterOpen ? "#4c38f2" : "#fff",
          color: filterOpen ? "#fff" : "#4c38f2",
          border: "2px solid #4c38f2",
          borderRadius: 32,
          boxShadow: "0 4px 22px #b9b5f33d",
          padding: "13px 27px 13px 20px",
          fontWeight: 700,
          fontSize: 16,
          zIndex: 101,
          display: "flex",
          alignItems: "center",
          transition: "all 0.22s",
        }}>
        <span style={{
          marginRight: 10,
          fontWeight: 900,
        }}>🔓</span> Открыто сейчас
      </button>
      {/* Кнопки "Передержка" и "Места для выгула" */}
      <div style={{
        position: "absolute",
        left: 24,
        bottom: 100,
        display: "flex",
        flexDirection: "column",
        gap: 14,
        zIndex: 101,
      }}>
        <button style={{
          background:"#fff",
          borderRadius:20,
          border:"2px solid #bbb",
          color:"#bbb",
          padding:"12px 22px",
          fontWeight:700,
          fontSize:15,
          boxShadow:"0 4px 16px #e6e4f7",
          display: "flex", alignItems: "center"
        }}>
          🏨 Передержка <span style={{
            marginLeft:7, background:"#f1e4ff", color:"#a58ee9", borderRadius:8, padding:"1px 7px", fontSize:12
          }}>скоро</span>
        </button>
        <button style={{
          background:"#fff",
          borderRadius:20,
          border:"2px solid #bbb",
          color:"#bbb",
          padding:"12px 22px",
          fontWeight:700,
          fontSize:15,
          boxShadow:"0 4px 16px #e6e4f7",
          display: "flex", alignItems: "center"
        }}>
          🌳 Места для выгула <span style={{
            marginLeft:7, background:"#f1e4ff", color:"#a58ee9", borderRadius:8, padding:"1px 7px", fontSize:12
          }}>скоро</span>
        </button>
      </div>
      {/* Кнопка "Назад" */}
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          left: 24,
          top: 100,
          background: "#fff",
          color: "#4c38f2",
          border: "2px solid #4c38f2",
          borderRadius: 16,
          padding: "8px 32px",
          fontWeight: 700,
          fontSize: 17,
          boxShadow: "0 2px 10px #e6e4f7",
          cursor: "pointer",
          zIndex: 101,
        }}>
        Назад
      </button>
    </div>
  );
}

export default MapScreen;

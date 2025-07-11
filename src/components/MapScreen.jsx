import React, { useEffect, useRef, useState } from "react";

const YMAPS_API_KEY = "590a209d-e5ce-4f23-bca5-27a57772be40";

function MapScreen({ onBack }) {
  const mapRef = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YMAPS_API_KEY}&lang=ru_RU`;
    script.type = "text/javascript";
    script.onload = () => {
      window.ymaps.ready(() => {
        // По умолчанию центр Москва
        let map = new window.ymaps.Map(mapRef.current, {
          center: [55.751244, 37.618423],
          zoom: 13,
          controls: ["zoomControl", "geolocationControl", "searchControl"],
        });

        // Попробуем получить геолокацию пользователя и центрировать карту
        map.controls.get('geolocationControl').events.add('locationchange', (e) => {
          const coords = e.get('geoObjects').get(0).geometry.getCoordinates();
          map.setCenter(coords, 14, { duration: 400 });
          loadClinics(coords);
        });

        // Если пользователь не дал разрешение, используем центр по умолчанию
        loadClinics([55.751244, 37.618423]);

        function loadClinics(centerCoords) {
          // Удаляем старые маркеры (если есть)
          map.geoObjects.removeAll();
          // Добавляем геометку пользователя
          map.geoObjects.add(new window.ymaps.GeoObject({
            geometry: { type: "Point", coordinates: centerCoords },
            properties: { iconCaption: "Вы здесь" }
          }, {
            preset: "islands#blueCircleDotIcon"
          }));

          // Поиск ветклиник рядом
          window.ymaps.geocode({
            kind: "biz",
            // Привязываем поиск к области вокруг пользователя
            boundedBy: [
              [centerCoords[0] - 0.1, centerCoords[1] - 0.2],
              [centerCoords[0] + 0.1, centerCoords[1] + 0.2]
            ],
            results: 100,
            query: "ветеринарная клиника"
          }).then(res => {
            res.geoObjects.each(obj => {
              const meta = obj.properties.get("CompanyMetaData");
              if (!meta) return;
              const hours = meta.Hours;
              const isOpen = hours && hours.isCurrent;
              if (filterOpen && !isOpen) return;

              // Рейтинг и отзывы
              const rating = meta.Ratings && meta.Ratings[0] && meta.Ratings[0].value;
              const reviews = meta.Reviews && meta.Reviews[0] && meta.Reviews[0].text;

              obj.options.set("preset", isOpen ? "islands#greenDotIcon" : "islands#grayDotIcon");
              let balloonContent = `<b>${meta.name}</b><br/>${meta.address}`;
              if (hours) {
                balloonContent += `<br/><b>${isOpen ? "🟢 Открыто сейчас" : "🔴 Закрыто"}</b> (${hours.text})`;
              }
              if (rating) {
                balloonContent += `<br/>⭐️ <b>${rating}</b>`;
              }
              if (meta.Phones && meta.Phones.length) {
                balloonContent += `<br/>☎️ ${meta.Phones.map((p) => p.formatted).join(", ")}`;
              }
              if (reviews) {
                balloonContent += `<br/><i>“${reviews.slice(0, 120)}...”</i>`;
              }
              obj.properties.set("balloonContent", balloonContent);
              map.geoObjects.add(obj);
            });
          });
        }
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [filterOpen]);

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ color: "#4c38f2" }}>🐾 Карта ветклиник (Яндекс)</h2>
      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight: 500 }}>
          <input
            type="checkbox"
            checked={filterOpen}
            onChange={e => setFilterOpen(e.target.checked)}
            style={{ marginRight: 6 }}
          />
          Показать только открытые сейчас
        </label>
      </div>
      <div ref={mapRef} style={{ width: "100%", height: "65vh", borderRadius: 18, boxShadow: "0 2px 14px #e6e4f7" }} />
      <button onClick={onBack} style={{ marginTop: 16 }}>Назад</button>
      <p style={{ color: "#999", marginTop: 10, fontSize: 13 }}>
        Позволяет искать клиники рядом, видеть рейтинг, отзывы, расписание.<br />
        Яркие метки — открытые, тусклые — закрытые. Кликните для подробностей.
      </p>
    </div>
  );
}

export default MapScreen;

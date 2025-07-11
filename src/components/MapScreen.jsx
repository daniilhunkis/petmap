import React, { useEffect, useRef, useState } from "react";

const YMAPS_API_KEY = "590a209d-e5ce-4f23-bca5-27a57772be40";

function MapScreen({ onBack }) {
  const mapRef = useRef(null);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    // Удаляем предыдущую карту (если есть)
    if (mapRef.current) mapRef.current.innerHTML = "";
    // Проверяем нет ли уже подключенного скрипта
    const scriptId = "yandex-maps-script";
    let script = document.getElementById(scriptId);

    function initMap() {
      window.ymaps.ready(() => {
        // Центр по умолчанию
        let defaultCenter = [55.751244, 37.618423];
        // Создаём карту
        const map = new window.ymaps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 13,
          controls: ["zoomControl", "geolocationControl", "searchControl"],
        });

        // Ставим обработчик на геолокацию — центрируем карту
        map.controls.get('geolocationControl').events.add('locationchange', (e) => {
          const coords = e.get('geoObjects').get(0).geometry.getCoordinates();
          map.setCenter(coords, 14, { duration: 400 });
        });

        // Подключаем обработчик поиска (searchControl)
        const searchControl = map.controls.get('searchControl');
        searchControl.options.set('provider', 'yandex#search');

        // При поиске — фильтруем по открытым, выделяем маркеры
        searchControl.events.add("resultshow", () => {
          const results = searchControl.getResultsArray();
          results.forEach(obj => {
            const meta = obj.properties.get("CompanyMetaData");
            if (meta && meta.Categories) {
              // Проверяем, ветклиника ли
              const isVet = meta.Categories.some(cat => 
                /ветеринар|ветклиника|питомц|зоосалон/i.test(cat.name)
              );
              if (isVet) {
                const hours = meta.Hours;
                const isOpen = hours && hours.isCurrent;
                if (filterOpen && !isOpen) return;
                obj.options.set("preset", isOpen ? "islands#greenDotIcon" : "islands#grayDotIcon");

                let balloonContent = `<b>${meta.name}</b><br/>${meta.address}`;
                if (hours) {
                  balloonContent += `<br/><b>${isOpen ? "🟢 Открыто сейчас" : "🔴 Закрыто"}</b> (${hours.text})`;
                }
                if (meta.Ratings && meta.Ratings[0]) {
                  balloonContent += `<br/>⭐️ <b>${meta.Ratings[0].value}</b>`;
                }
                if (meta.Phones && meta.Phones.length) {
                  balloonContent += `<br/>☎️ ${meta.Phones.map((p) => p.formatted).join(", ")}`;
                }
                if (meta.Reviews && meta.Reviews[0]) {
                  balloonContent += `<br/><i>“${meta.Reviews[0].text.slice(0, 120)}...”</i>`;
                }
                obj.properties.set("balloonContent", balloonContent);
              }
            }
          });
        });

        // При загрузке сразу ищем "ветеринарная клиника"
        searchControl.search("ветеринарная клиника");
      });
    }

    // Если скрипта нет, добавляем
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

    // cleanup
    return () => {
      if (mapRef.current) mapRef.current.innerHTML = "";
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
        Центрируется по тебе, ищет ветклиники через поиск Яндекса.<br />
        Яркие метки — открытые, тусклые — закрытые.<br />
        Можно искать по любому адресу или вручную в поиске!
      </p>
    </div>
  );
}

export default MapScreen;

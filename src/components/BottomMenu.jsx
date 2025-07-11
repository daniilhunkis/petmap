import React from "react";
const menuItems = [
  { key: "main", icon: "🏠", label: "Главная" },
  { key: "map", icon: "🗺️", label: "Карта" },
  { key: "consult", icon: "💬", label: "Консультации", soon: true },
  { key: "feedback", icon: "✉️", label: "Связаться" },
];
function BottomMenu({ active, onSelect }) {
  return (
    <div style={{
      position: "fixed",
      left: 0, bottom: 0, width: "100vw", zIndex: 200,
      background: "#fff",
      boxShadow: "0 -1px 15px #e0e0ee", borderTopLeftRadius: 22, borderTopRightRadius: 22,
      display: "flex", justifyContent: "space-around", alignItems: "center", padding: "6px 0",
      minHeight: 68
    }}>
      {menuItems.map(item => (
        <div key={item.key} onClick={() => !item.soon && onSelect(item.key)} style={{
          flex: 1, textAlign: "center", cursor: item.soon ? "not-allowed" : "pointer",
          opacity: item.soon ? 0.5 : (active === item.key ? 1 : 0.7),
          position: "relative"
        }}>
          <div style={{
            fontSize: 27,
            color: active === item.key ? "#4c38f2" : "#bbb",
            borderRadius: "50%", padding: "6px 0"
          }}>{item.icon}</div>
          {item.soon &&
            <span style={{
              position: "absolute", top: 10, right: "28%", background: "#eee1ff", color: "#8c7bfa",
              fontSize: 11, borderRadius: 7, padding: "2px 7px"
            }}>скоро</span>
          }
        </div>
      ))}
    </div>
  );
}
export default BottomMenu;

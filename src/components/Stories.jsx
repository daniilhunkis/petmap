import React, { useState, useEffect } from "react";
import StoriesLib from "react-insta-stories";

const API_URL = "https://petmap-backend.onrender.com/api/stories";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        setStories(data.map(s => ({
          url: s.url,
          header: {
            heading: s.title,
            subheading: "PetMap",
            profileImage: s.img,
          },
        })));
      });
  }, []);

  return (
    <div style={{ padding: "20px 0 8px 16px", display: "flex", alignItems: "center" }}>
      {stories.map((s, i) => (
        <div key={i} style={{
          border: `3.3px solid #4c38f2`,
          borderRadius: "50%", width: 63, height: 63, overflow: "hidden",
          marginRight: 12, cursor: "pointer"
        }} onClick={() => setShow(true)}>
          <img src={s.header.profileImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      ))}
      {show && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          background: "#2227", zIndex: 400
        }}>
          <StoriesLib
            stories={stories}
            defaultInterval={4800}
            width={"100vw"}
            height={"100vh"}
            onAllStoriesEnd={() => setShow(false)}
            storyStyles={{ borderRadius: 0 }}
          />
          <button onClick={() => setShow(false)} style={{
            position: "absolute", top: 34, right: 22, background: "#fff", color: "#4c38f2",
            border: "2px solid #4c38f2", borderRadius: 22, padding: "8px 22px", fontWeight: 700, fontFamily: "Inter, sans-serif"
          }}>Закрыть</button>
        </div>
      )}
    </div>
  );
}

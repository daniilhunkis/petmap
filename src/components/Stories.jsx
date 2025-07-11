import React, { useState, useEffect } from "react";
import StoriesLib from "react-insta-stories";
import { BACKEND_URL } from "../config";

export default function Stories() {
  const [show, setShow] = useState(false);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/stories`)
      .then(r => r.json())
      .then(data => {
        setStories(
          data.map(story => ({
            url: story.url,
            header: {
              heading: story.title,
              subheading: "PetMap",
              profileImage: story.img
            }
          }))
        );
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

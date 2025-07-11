import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AdminPanel from "./components/AdminPanel";

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

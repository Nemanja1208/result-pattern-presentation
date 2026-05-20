import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

import S01 from "./slides/01_Hero";
import S02 from "./slides/02_Problem";
import S03 from "./slides/03_WhatIsResult";
import S04 from "./slides/04_ResultType";
import S05 from "./slides/05_ErrorTypes";
import S06 from "./slides/06_CreatingResults";
import S07 from "./slides/07_MatchingResults";
import S08 from "./slides/08_Chaining";
import S09 from "./slides/09_MediatRResult";
import S10 from "./slides/10_ApiTranslation";
import S11 from "./slides/11_ValidationResult";
import S12 from "./slides/12_FullExample";
import S13 from "./slides/13_Summary";

const SLIDES = [
  { id: "hero", label: "Intro", Component: S01, color: "#fb7185" },
  { id: "problem", label: "The Problem", Component: S02, color: "#f43f5e" },
  { id: "what", label: "What Is Result", Component: S03, color: "#fb923c" },
  { id: "type", label: "Result<T> Type", Component: S04, color: "#fbbf24" },
  { id: "errors", label: "Error Types", Component: S05, color: "#a78bfa" },
  {
    id: "creating",
    label: "Creating Results",
    Component: S06,
    color: "#34d399",
  },
  { id: "matching", label: "Match & Unwrap", Component: S07, color: "#38bdf8" },
  { id: "chaining", label: "Chaining", Component: S08, color: "#818cf8" },
  { id: "mediatr", label: "MediatR", Component: S09, color: "#a78bfa" },
  { id: "api", label: "API Layer", Component: S10, color: "#38bdf8" },
  { id: "validation", label: "+ Validation", Component: S11, color: "#34d399" },
  { id: "full", label: "Full Example", Component: S12, color: "#fb923c" },
  { id: "summary", label: "Summary", Component: S13, color: "#fb7185" },
];

const v = {
  enter: (d) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (d) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
};

export default function App() {
  const [cur, setCur] = useState(0);
  const [dir, setDir] = useState(1);

  const go = (i) => {
    if (i === cur) return;
    setDir(i > cur ? 1 : -1);
    setCur(i);
  };
  const next = () => cur < SLIDES.length - 1 && go(cur + 1);
  const prev = () => cur > 0 && go(cur - 1);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  });

  const { Component, color } = SLIDES[cur];

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#060912",
        fontFamily: "Space Grotesk, sans-serif",
        position: "relative",
      }}
    >
      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(${color}04 1px,transparent 1px),linear-gradient(90deg,${color}04 1px,transparent 1px)`,
          backgroundSize: "56px 56px",
          transition: "background-image 0.8s",
        }}
      />
      {/* Glow orb */}
      <motion.div
        key={color}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
        style={{
          position: "absolute",
          top: "-25%",
          left: "25%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: `radial-gradient(circle,${color}12 0%,transparent 65%)`,
          filter: "blur(70px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Slide */}
      <AnimatePresence custom={dir} mode="wait">
        <motion.div
          key={cur}
          custom={dir}
          variants={v}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.36, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            overflowY: "auto",
          }}
        >
          <Component onNext={next} onPrev={prev} />
        </motion.div>
      </AnimatePresence>

      {/* Top bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "9px 20px",
          background: "rgba(6,9,18,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: `1px solid ${color}1e`,
          transition: "border-color 0.6s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <motion.div
            animate={{ opacity: [1, 0.25, 1], scale: [1, 1.3, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 8px ${color}`,
            }}
          />
          <span
            style={{
              color,
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              transition: "color 0.5s",
              fontFamily: "Fira Code, monospace",
            }}
          >
            Operation Result Pattern · .NET
          </span>
        </div>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          {SLIDES.map((s, i) => (
            <button
              key={s.id}
              onClick={() => go(i)}
              title={s.label}
              style={{
                width: i === cur ? 20 : 6,
                height: 6,
                borderRadius: 3,
                border: "none",
                padding: 0,
                background: i === cur ? s.color : "rgba(255,255,255,0.1)",
                boxShadow: i === cur ? `0 0 8px ${s.color}` : "none",
                transition: "all 0.28s",
              }}
            />
          ))}
        </div>
        <span style={{ color: "rgba(255,255,255,0.28)", fontSize: 10 }}>
          {cur + 1}/{SLIDES.length} · {SLIDES[cur].label}
        </span>
      </div>

      {/* Arrows */}
      {cur > 0 && (
        <motion.button
          onClick={prev}
          whileHover={{ scale: 1.12, x: -2 }}
          style={{
            position: "fixed",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 100,
            width: 36,
            height: 36,
            borderRadius: 8,
            border: `1px solid ${color}28`,
            background: `${color}0a`,
            color,
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ‹
        </motion.button>
      )}
      {cur < SLIDES.length - 1 && (
        <motion.button
          onClick={next}
          whileHover={{ scale: 1.12, x: 2 }}
          style={{
            position: "fixed",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 100,
            width: 36,
            height: 36,
            borderRadius: 8,
            border: `1px solid ${color}28`,
            background: `${color}0a`,
            color,
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ›
        </motion.button>
      )}
    </div>
  );
}

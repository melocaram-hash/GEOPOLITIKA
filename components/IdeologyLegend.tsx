"use client";

import { useGlobeStore } from "@/lib/store";
import { IDEOLOGY_COLORS, type IdeologyLabel } from "@/lib/classification";

const LABELS: { key: IdeologyLabel; label: string }[] = [
  { key: "extrema-esquerda", label: "Ext. Esq." },
  { key: "esquerda",         label: "Esquerda" },
  { key: "centro-esquerda",  label: "C. Esq." },
  { key: "centro",           label: "Centro" },
  { key: "centro-direita",   label: "C. Dir." },
  { key: "direita",          label: "Direita" },
  { key: "extrema-direita",  label: "Ext. Dir." },
];

export default function IdeologyLegend() {
  const showIdeology   = useGlobeStore((s) => s.showIdeology);
  const toggleIdeology = useGlobeStore((s) => s.toggleIdeology);

  return (
    <>
      {/* ── Toolbar de camadas — centro superior ───────────────────── */}
      <div style={{
        position: "fixed",
        top: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 30,
        display: "flex",
        alignItems: "center",
        gap: "4px",
        background: "rgba(8,11,18,0.78)",
        border: "1px solid #1e2d42",
        borderRadius: "10px",
        padding: "5px 6px",
        backdropFilter: "blur(16px)",
      }}>
        {/* Chip: Padrão */}
        <button
          onClick={() => showIdeology && toggleIdeology()}
          style={{
            background: !showIdeology ? "rgba(58,123,213,0.18)" : "transparent",
            border: `1px solid ${!showIdeology ? "#3a7bd5" : "transparent"}`,
            borderRadius: "6px",
            padding: "5px 12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.18s ease",
            color: !showIdeology ? "#a8c4f0" : "#4a5568",
          }}
          onMouseEnter={(e) => {
            if (showIdeology) e.currentTarget.style.color = "#6b7fa3";
          }}
          onMouseLeave={(e) => {
            if (showIdeology) e.currentTarget.style.color = "#4a5568";
          }}
        >
          {/* ícone globo */}
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.1"/>
            <ellipse cx="5.5" cy="5.5" rx="2" ry="4.5" stroke="currentColor" strokeWidth="1.1"/>
            <line x1="1" y1="5.5" x2="10" y2="5.5" stroke="currentColor" strokeWidth="1.1"/>
          </svg>
          <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Padrão
          </span>
        </button>

        {/* Divisor */}
        <div style={{ width: "1px", height: "16px", background: "#1e2d42", margin: "0 2px" }} />

        {/* Chip: Ideologia */}
        <button
          onClick={() => !showIdeology && toggleIdeology()}
          style={{
            background: showIdeology ? "rgba(58,123,213,0.18)" : "transparent",
            border: `1px solid ${showIdeology ? "#3a7bd5" : "transparent"}`,
            borderRadius: "6px",
            padding: "5px 12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.18s ease",
            color: showIdeology ? "#a8c4f0" : "#4a5568",
          }}
          onMouseEnter={(e) => {
            if (!showIdeology) e.currentTarget.style.color = "#6b7fa3";
          }}
          onMouseLeave={(e) => {
            if (!showIdeology) e.currentTarget.style.color = "#4a5568";
          }}
        >
          {/* ícone espectro */}
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <rect x="0.5" y="2.5" width="4.2" height="6" rx="1" fill="#c0392b" opacity="0.85"/>
            <rect x="6.3" y="2.5" width="4.2" height="6" rx="1" fill="#1a5276" opacity="0.85"/>
          </svg>
          <span style={{ fontSize: "10px", fontWeight: 500, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Ideologia
          </span>
        </button>
      </div>

      {/* ── Legenda flutuante — aparece só quando ideologia ativa ──── */}
      {showIdeology && (
        <div style={{
          position: "fixed",
          top: "76px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 30,
          background: "rgba(8,11,18,0.82)",
          border: "1px solid #1e2d42",
          borderRadius: "8px",
          padding: "10px 16px",
          backdropFilter: "blur(16px)",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          pointerEvents: "none",
        }}>
          {LABELS.map(({ key, label }) => (
            <div key={key} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{
                width: "8px",
                height: "8px",
                borderRadius: "2px",
                background: IDEOLOGY_COLORS[key],
                flexShrink: 0,
              }} />
              <span style={{ fontSize: "10px", color: "#8a9ab8", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </div>
          ))}
          <div style={{ width: "1px", height: "12px", background: "#1e2d42" }} />
          <span style={{ fontSize: "10px", color: "#3a4455", whiteSpace: "nowrap" }}>
            Cinza = sem dados
          </span>
        </div>
      )}
    </>
  );
}

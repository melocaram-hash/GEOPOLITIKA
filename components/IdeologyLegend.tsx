"use client";

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
  return (
    <div style={{
      position: "fixed",
      top: "24px",
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
  );
}

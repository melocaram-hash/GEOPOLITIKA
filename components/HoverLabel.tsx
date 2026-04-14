"use client";

import { useGlobeStore } from "@/lib/store";

export default function HoverLabel() {
  const hovered = useGlobeStore((s) => s.hoveredCountry);
  const { x, y } = useGlobeStore((s) => s.mousePosition);

  if (!hovered) return null;

  return (
    <div style={{
      position: "fixed",
      left: x,
      top: y - 16,
      transform: "translate(-50%, -100%)",
      background: "rgba(8,11,18,0.85)",
      border: "1px solid #1e2d42",
      borderRadius: "6px",
      padding: "5px 11px",
      fontSize: "12px",
      fontWeight: 400,
      letterSpacing: "0.04em",
      color: "#e8f0fe",
      pointerEvents: "none",
      zIndex: 50,
      backdropFilter: "blur(8px)",
      whiteSpace: "nowrap",
    }}>
      {hovered.name}
    </div>
  );
}

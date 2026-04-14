export default function Header() {
  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      padding: "24px 32px",
      zIndex: 30,
      pointerEvents: "none",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {/* Ícone minimalista */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="8" stroke="#3a7bd5" strokeWidth="1.2"/>
          <ellipse cx="9" cy="9" rx="3.5" ry="8" stroke="#3a7bd5" strokeWidth="1.2"/>
          <line x1="1" y1="9" x2="17" y2="9" stroke="#3a7bd5" strokeWidth="1.2"/>
        </svg>
        <span style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "13px",
          fontWeight: 500,
          letterSpacing: "0.28em",
          color: "#e8f0fe",
          textTransform: "uppercase",
        }}>
          Geopolitika
        </span>
      </div>
    </header>
  );
}

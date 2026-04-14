"use client";

import { useGlobeStore } from "@/lib/store";
import {
  COUNTRY_CLASSIFICATIONS,
  IDEOLOGY_COLORS,
  DEMOCRACY_COLORS,
  type IdeologyLabel,
  type DemocracyLabel,
} from "@/lib/classification";

// ─── Labels legíveis ──────────────────────────────────────────────────────────
const EIXO1_LABEL: Record<IdeologyLabel, string> = {
  "extrema-esquerda": "Extrema-Esquerda",
  "esquerda":         "Esquerda",
  "centro-esquerda":  "Centro-Esquerda",
  "centro":           "Centro",
  "centro-direita":   "Centro-Direita",
  "direita":          "Direita",
  "extrema-direita":  "Extrema-Direita",
};

const EIXO2_LABEL: Record<DemocracyLabel, string> = {
  "libertário":             "Libertário",
  "democracia consolidada": "Democracia Consolidada",
  "democracia com falhas":  "Democracia com Falhas",
  "regime híbrido":         "Regime Híbrido",
  "semi-autoritário":       "Semi-Autoritário",
  "autoritário":            "Autoritário",
};

// ─── Ícone spectrum (eixo 1) ──────────────────────────────────────────────────
function SpectrumBar({ value, color }: { value: number; color: string }) {
  // value: 0–100, 0=esquerda, 100=direita
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div style={{ position: "relative", height: "6px", borderRadius: "3px", overflow: "hidden",
      background: "linear-gradient(to right, #8B0000, #c0392b, #e57373, #78909c, #5b8fd4, #1a5276, #0a2744)" }}>
      {/* marcador de posição */}
      <div style={{
        position: "absolute",
        left: `calc(${pct}% - 5px)`,
        top: "-3px",
        width: "10px",
        height: "12px",
        borderRadius: "2px",
        background: color,
        border: "2px solid #e8f0fe",
        boxShadow: `0 0 8px ${color}80`,
        transition: "left 0.4s ease",
      }} />
    </div>
  );
}

// ─── Ícone democracia (eixo 2) ────────────────────────────────────────────────
function DemocracyBar({ value, color }: { value: number; color: string }) {
  // value: 0=livre, 100=autoritário
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div style={{ position: "relative", height: "6px", borderRadius: "3px", overflow: "hidden",
      background: "linear-gradient(to right, #27ae60, #2ecc71, #f39c12, #e67e22, #c0392b, #7b241c)" }}>
      <div style={{
        position: "absolute",
        left: `calc(${pct}% - 5px)`,
        top: "-3px",
        width: "10px",
        height: "12px",
        borderRadius: "2px",
        background: color,
        border: "2px solid #e8f0fe",
        boxShadow: `0 0 8px ${color}80`,
        transition: "left 0.4s ease",
      }} />
    </div>
  );
}

// ─── Mini barra horizontal para os blocos ────────────────────────────────────
function MiniBar({ label, value, color, inverted = false }: {
  label: string; value: number; color: string; inverted?: boolean;
}) {
  const pct = inverted ? 100 - value : value;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "9px", color: "#4a5568", letterSpacing: "0.06em" }}>{label}</span>
        <span style={{ fontSize: "9px", color: "#4a5568" }}>{value}/100</span>
      </div>
      <div style={{ height: "3px", background: "#1e2d42", borderRadius: "2px" }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: color,
          borderRadius: "2px",
          opacity: 0.75,
          transition: "width 0.4s ease",
        }} />
      </div>
    </div>
  );
}

// ─── Chip badge ──────────────────────────────────────────────────────────────
function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      background: `${color}22`,
      border: `1px solid ${color}55`,
      borderRadius: "5px",
      padding: "3px 10px",
      fontSize: "10px",
      fontWeight: 500,
      letterSpacing: "0.12em",
      color: color,
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    }}>
      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: color, flexShrink: 0 }} />
      {label}
    </span>
  );
}

// ─── Separador ───────────────────────────────────────────────────────────────
function Sep() {
  return <div style={{ height: "1px", background: "#1e2d42", margin: "2px 0" }} />;
}

// ─── Painel principal ─────────────────────────────────────────────────────────
export default function CountryPanel() {
  const selected    = useGlobeStore((s) => s.selectedCountry);
  const setSelected = useGlobeStore((s) => s.setSelected);
  const open = !!selected;

  const data = selected ? COUNTRY_CLASSIFICATIONS[selected.iso] : null;
  const isState = selected?.iso.startsWith("BR-");

  return (
    <aside style={{
      position: "fixed",
      top: 0,
      right: 0,
      height: "100%",
      width: "420px",
      background: "rgba(8,11,18,0.94)",
      borderLeft: "1px solid #1e2d42",
      backdropFilter: "blur(20px)",
      zIndex: 40,
      transform: open ? "translateX(0)" : "translateX(100%)",
      transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
    }}>

      {/* ── Cabeçalho ─────────────────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px 28px 20px",
        borderBottom: "1px solid #1e2d42",
        position: "sticky",
        top: 0,
        background: "rgba(8,11,18,0.97)",
        zIndex: 1,
      }}>
        <span style={{ fontSize: "9px", letterSpacing: "0.22em", color: "#6b7fa3", textTransform: "uppercase" }}>
          {isState ? "Estado — Brasil" : "Análise Política"}
        </span>
        <button
          onClick={() => setSelected(null)}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#6b7fa3",
            padding: "4px", display: "flex", alignItems: "center", borderRadius: "4px" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#e8f0fe")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7fa3")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2L12 12M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {selected && (
        <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", gap: "22px" }}>

          {/* ── Nome do país ───────────────────────────────────────── */}
          <div>
            <p style={{ fontSize: "28px", fontWeight: 300, color: "#e8f0fe", lineHeight: 1.2, margin: 0 }}>
              {selected.name}
            </p>
            {selected.capital && (
              <p style={{ fontSize: "11px", color: "#4a5568", marginTop: "4px" }}>
                Capital: <span style={{ color: "#8a9ab8" }}>{selected.capital}</span>
                {selected.continent && (
                  <> · <span style={{ color: "#8a9ab8" }}>{selected.continent}</span></>
                )}
              </p>
            )}
          </div>

          {/* ── Sem dados políticos (estado BR ou país sem classificação) ── */}
          {!data && (
            <div style={{
              background: "#0f1520",
              border: "1px solid #1e2d42",
              borderRadius: "8px",
              padding: "16px",
              textAlign: "center",
            }}>
              <span style={{ fontSize: "11px", color: "#3a4455" }}>
                {isState
                  ? "Análise estadual em desenvolvimento"
                  : "País sem classificação registrada"}
              </span>
            </div>
          )}

          {/* ── Dados políticos ────────────────────────────────────── */}
          {data && (
            <>
              {/* Presidente */}
              <div style={{ background: "#0d1625", borderRadius: "8px", padding: "14px", border: "1px solid #1e2d42" }}>
                <p style={{ fontSize: "9px", color: "#4a5568", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 6px" }}>
                  Governo Atual
                </p>
                <p style={{ fontSize: "18px", fontWeight: 400, color: "#e8f0fe", margin: "0 0 4px" }}>
                  {data.presidente}
                </p>
                <p style={{ fontSize: "10px", color: "#6b7fa3", margin: 0 }}>
                  {data.partido}
                </p>
                <p style={{ fontSize: "9px", color: "#3a4455", margin: "4px 0 0" }}>
                  Desde {data.desde}
                </p>
              </div>

              <Sep />

              {/* EIXO 1 — Econômico/Social */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "9px", color: "#4a5568", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                    Espectro Econômico
                  </span>
                  <Badge label={EIXO1_LABEL[data.labelEixo1]} color={IDEOLOGY_COLORS[data.labelEixo1]} />
                </div>

                {/* Barra gradiente */}
                <SpectrumBar value={data.eixo1} color={IDEOLOGY_COLORS[data.labelEixo1]} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "8px", color: "#3a4455" }}>← Esq.</span>
                  <span style={{ fontSize: "8px", color: "#3a4455" }}>Dir. →</span>
                </div>

                {/* Blocos detalhados */}
                <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginTop: "2px" }}>
                  <MiniBar
                    label="Estado vs. Mercado"
                    value={data.blocos.estadoMercado}
                    color={IDEOLOGY_COLORS[data.labelEixo1]}
                  />
                  <MiniBar
                    label="Proteção Social"
                    value={data.blocos.protecaoSocial}
                    color={IDEOLOGY_COLORS[data.labelEixo1]}
                    inverted
                  />
                  <MiniBar
                    label="Conservadorismo Cultural"
                    value={data.blocos.valoresCulturais}
                    color={IDEOLOGY_COLORS[data.labelEixo1]}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                  <span style={{ fontSize: "8px", color: "#3a4455" }}>← mais estatal · mais liberal →</span>
                  <span style={{ fontSize: "9px", fontWeight: 500, color: IDEOLOGY_COLORS[data.labelEixo1] }}>
                    {data.eixo1.toFixed(1)}/100
                  </span>
                </div>
              </div>

              <Sep />

              {/* EIXO 2 — Político/Institucional */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "9px", color: "#4a5568", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                    Qualidade Democrática
                  </span>
                  <Badge label={EIXO2_LABEL[data.labelEixo2]} color={DEMOCRACY_COLORS[data.labelEixo2]} />
                </div>

                <DemocracyBar value={data.eixo2} color={DEMOCRACY_COLORS[data.labelEixo2]} />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "8px", color: "#3a4455" }}>← Livre</span>
                  <span style={{ fontSize: "8px", color: "#3a4455" }}>Autoritário →</span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginTop: "2px" }}>
                  <MiniBar
                    label="Alternância de Poder"
                    value={data.democracia.alternancia}
                    color={DEMOCRACY_COLORS[data.labelEixo2]}
                  />
                  <MiniBar
                    label="Independência Judicial"
                    value={data.democracia.judiciario}
                    color={DEMOCRACY_COLORS[data.labelEixo2]}
                  />
                  <MiniBar
                    label="Liberdade de Imprensa"
                    value={data.democracia.imprensa}
                    color={DEMOCRACY_COLORS[data.labelEixo2]}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                  <span style={{ fontSize: "8px", color: "#3a4455" }}>← democrático · autoritário →</span>
                  <span style={{ fontSize: "9px", fontWeight: 500, color: DEMOCRACY_COLORS[data.labelEixo2] }}>
                    {data.eixo2.toFixed(1)}/100
                  </span>
                </div>
              </div>

              <Sep />

              {/* Resumo */}
              <div>
                <p style={{ fontSize: "9px", color: "#4a5568", letterSpacing: "0.18em", textTransform: "uppercase", margin: "0 0 8px" }}>
                  Contexto
                </p>
                <p style={{ fontSize: "12px", color: "#6b7fa3", lineHeight: 1.7, margin: 0 }}>
                  {data.resumo}
                </p>
              </div>

              {/* Rodapé */}
              <div style={{ textAlign: "center", paddingTop: "4px" }}>
                <span style={{ fontSize: "8px", color: "#252f3e", letterSpacing: "0.1em" }}>
                  GEOPOLITIKA · ABR/2026
                </span>
              </div>

            </>
          )}
        </div>
      )}
    </aside>
  );
}

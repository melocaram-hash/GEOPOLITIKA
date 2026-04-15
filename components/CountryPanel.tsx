"use client";

import { useGlobeStore } from "@/lib/store";
import {
  COUNTRY_CLASSIFICATIONS,
  IDEOLOGY_COLORS,
  DEMOCRACY_COLORS,
  type IdeologyLabel,
  type DemocracyLabel,
} from "@/lib/classification";

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

// Barra de espectro simples — sem marcador flutuante, só fill colorido
function ScoreBar({ value, color, max = 100 }: { value: number; color: string; max?: number }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ height: "8px", background: "#141c2a", borderRadius: "4px", overflow: "hidden" }}>
      <div style={{
        height: "100%",
        width: `${pct}%`,
        background: color,
        borderRadius: "4px",
        transition: "width 0.4s ease",
      }} />
    </div>
  );
}

// Linha de métrica: rótulo + barra + valor
function MetricRow({ label, value, color, max = 100 }: {
  label: string; value: number; color: string; max?: number;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontSize: "13px", color: "#8a9ab8" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: 500, color: "#c8d8f0" }}>{value}</span>
      </div>
      <ScoreBar value={value} color={color} max={max} />
    </div>
  );
}

function Divider() {
  return <div style={{ height: "1px", background: "#1a2336" }} />;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: "11px",
      fontWeight: 600,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: "#3d5070",
      margin: 0,
    }}>
      {children}
    </p>
  );
}

export default function CountryPanel() {
  const selected    = useGlobeStore((s) => s.selectedCountry);
  const setSelected = useGlobeStore((s) => s.setSelected);
  const open = !!selected;

  const data    = selected ? COUNTRY_CLASSIFICATIONS[selected.iso] : null;
  const isState = selected?.iso.startsWith("BR-");

  const ideologyColor  = data ? IDEOLOGY_COLORS[data.labelEixo1]  : "#78909c";
  const democracyColor = data ? DEMOCRACY_COLORS[data.labelEixo2] : "#78909c";

  return (
    <aside style={{
      position: "fixed",
      top: 0,
      right: 0,
      height: "100%",
      width: "460px",
      background: "#0b111d",
      borderLeft: "1px solid #1a2336",
      zIndex: 40,
      transform: open ? "translateX(0)" : "translateX(100%)",
      transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1)",
      display: "flex",
      flexDirection: "column",
      overflowY: "auto",
    }}>

      {/* ── Topo colorido com nome do país ───────────────────────── */}
      <div style={{
        padding: "32px 36px 28px",
        borderBottom: "1px solid #1a2336",
        position: "relative",
      }}>
        {/* Faixa de cor ideológica no topo */}
        {data && (
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "4px",
            background: ideologyColor,
          }} />
        )}

        {/* Botão fechar */}
        <button
          onClick={() => setSelected(null)}
          style={{
            position: "absolute", top: "20px", right: "24px",
            background: "none", border: "none", cursor: "pointer",
            color: "#3d5070", padding: "6px",
            display: "flex", alignItems: "center", borderRadius: "4px",
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#e8f0fe")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#3d5070")}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Nome */}
        <h1 style={{
          fontSize: "32px",
          fontWeight: 300,
          color: "#e8f0fe",
          margin: "12px 0 6px",
          lineHeight: 1.1,
        }}>
          {selected?.name}
        </h1>

        {/* Capital · Continente */}
        {selected?.capital && (
          <p style={{ fontSize: "14px", color: "#4a6080", margin: 0 }}>
            {selected.capital}
            {selected.continent && <> &middot; {selected.continent}</>}
          </p>
        )}
      </div>

      {/* ── Conteúdo ──────────────────────────────────────────────── */}
      {selected && (
        <div style={{ padding: "28px 36px", display: "flex", flexDirection: "column", gap: "28px" }}>

          {/* Sem dados */}
          {!data && (
            <p style={{ fontSize: "14px", color: "#3d5070", margin: 0 }}>
              {isState
                ? "Análise estadual em desenvolvimento."
                : "Nenhuma classificação registrada para este país."}
            </p>
          )}

          {data && (
            <>
              {/* ── Governo ──────────────────────────────────────── */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <SectionTitle>Governo</SectionTitle>
                <div>
                  <p style={{ fontSize: "20px", fontWeight: 400, color: "#e8f0fe", margin: "0 0 4px" }}>
                    {data.presidente}
                  </p>
                  <p style={{ fontSize: "14px", color: "#5a7090", margin: "0 0 2px" }}>
                    {data.partido}
                  </p>
                  <p style={{ fontSize: "13px", color: "#3d5070", margin: 0 }}>
                    No poder desde {data.desde}
                  </p>
                </div>
              </div>

              <Divider />

              {/* ── Posição Ideológica ────────────────────────────── */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <SectionTitle>Posição Ideológica</SectionTitle>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: ideologyColor,
                    letterSpacing: "0.04em",
                  }}>
                    {EIXO1_LABEL[data.labelEixo1]}
                  </span>
                </div>

                {/* Barra espectro esq → dir */}
                <div>
                  <div style={{
                    height: "10px",
                    borderRadius: "5px",
                    background: "linear-gradient(to right, #8B0000, #c0392b, #e57373, #78909c, #5b8fd4, #1a5276, #0a2744)",
                    position: "relative",
                    marginBottom: "6px",
                  }}>
                    <div style={{
                      position: "absolute",
                      left: `calc(${data.eixo1}% - 7px)`,
                      top: "-4px",
                      width: "14px",
                      height: "18px",
                      borderRadius: "3px",
                      background: "#0b111d",
                      border: `2px solid ${ideologyColor}`,
                      boxShadow: `0 0 10px ${ideologyColor}88`,
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", color: "#3d5070" }}>Esquerda</span>
                    <span style={{ fontSize: "12px", color: "#3d5070" }}>Direita</span>
                  </div>
                </div>

                {/* Três métricas */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <MetricRow label="Intervenção do Estado" value={100 - data.blocos.estadoMercado} color={ideologyColor} />
                  <MetricRow label="Proteção Social"       value={100 - data.blocos.protecaoSocial} color={ideologyColor} />
                  <MetricRow label="Conservadorismo Cultural" value={data.blocos.valoresCulturais} color={ideologyColor} />
                </div>
              </div>

              <Divider />

              {/* ── Qualidade Democrática ─────────────────────────── */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <SectionTitle>Qualidade Democrática</SectionTitle>
                  <span style={{
                    fontSize: "13px",
                    fontWeight: 600,
                    color: democracyColor,
                    letterSpacing: "0.04em",
                  }}>
                    {EIXO2_LABEL[data.labelEixo2]}
                  </span>
                </div>

                {/* Barra democracia → autoritarismo */}
                <div>
                  <div style={{
                    height: "10px",
                    borderRadius: "5px",
                    background: "linear-gradient(to right, #27ae60, #f39c12, #c0392b, #7b241c)",
                    position: "relative",
                    marginBottom: "6px",
                  }}>
                    <div style={{
                      position: "absolute",
                      left: `calc(${data.eixo2}% - 7px)`,
                      top: "-4px",
                      width: "14px",
                      height: "18px",
                      borderRadius: "3px",
                      background: "#0b111d",
                      border: `2px solid ${democracyColor}`,
                      boxShadow: `0 0 10px ${democracyColor}88`,
                    }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "12px", color: "#3d5070" }}>Democracia Plena</span>
                    <span style={{ fontSize: "12px", color: "#3d5070" }}>Autoritarismo</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <MetricRow label="Alternância de Poder"   value={100 - data.democracia.alternancia} color={democracyColor} />
                  <MetricRow label="Independência Judicial" value={100 - data.democracia.judiciario}  color={democracyColor} />
                  <MetricRow label="Liberdade de Imprensa"  value={100 - data.democracia.imprensa}    color={democracyColor} />
                </div>
              </div>

              <Divider />

              {/* ── Contexto ──────────────────────────────────────── */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <SectionTitle>Contexto</SectionTitle>
                <p style={{
                  fontSize: "14px",
                  color: "#7a90b0",
                  lineHeight: 1.75,
                  margin: 0,
                }}>
                  {data.resumo}
                </p>
              </div>

              {/* Rodapé */}
              <p style={{ fontSize: "11px", color: "#1e2d42", textAlign: "center", margin: 0 }}>
                GEOPOLITIKA · Abril 2026
              </p>
            </>
          )}
        </div>
      )}
    </aside>
  );
}

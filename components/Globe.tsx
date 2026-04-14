"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import GlobeGL from "react-globe.gl";
import { useGlobeStore } from "@/lib/store";
import { getCountryMeta, getStateMeta } from "@/lib/countries";
import { getIdeologyColor, IDEOLOGY_COLORS } from "@/lib/classification";

// ─── tipos ────────────────────────────────────────────────────────────────────
type CountryFeature = {
  _type: "country";
  properties: { ISO_A3?: string; ADM0_A3?: string; NAME?: string; ADMIN?: string };
};
type StateFeature = {
  _type: "state";
  properties: { UF?: string; ESTADO?: string };
};
type AnyFeature = CountryFeature | StateFeature;

// ─── helpers ──────────────────────────────────────────────────────────────────
const OCEAN_COLOR   = "#0a1628"; // azul-marinho escuro
const COUNTRY_COLOR = "#2c3340"; // cinza-escuro neutro
const STATE_COLOR   = "#252b38"; // cinza ligeiramente diferente para estados BR
const BORDER_COLOR  = "#3a4455"; // fronteiras sutis
const HOVER_COLOR   = "#5b8fd4"; // azul médio no hover

function getKey(f: AnyFeature): string {
  if (f._type === "state") return `BR-${f.properties.UF ?? ""}`;
  const iso = f.properties.ISO_A3 ?? "";
  return iso === "-99" ? (f.properties.ADM0_A3 ?? "") : iso;
}

export default function Globe() {
  const globeEl = useRef<typeof GlobeGL.prototype>(null);
  const [features, setFeatures]     = useState<AnyFeature[]>([]);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [ready, setReady]           = useState(false);

  const setHoveredStore = useGlobeStore((s) => s.setHovered);
  const setSelected     = useGlobeStore((s) => s.setSelected);
  const setMousePos     = useGlobeStore((s) => s.setMousePosition);
  const showIdeology    = useGlobeStore((s) => s.showIdeology);

  // ── carrega GeoJSONs ────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetch("/countries.geojson").then((r) => r.json()),
      fetch("/brazil-states.geojson").then((r) => r.json()),
    ]).then(([world, br]) => {
      // Países sem o Brasil (ISO BRA) — substituído pelos estados
      const countries: AnyFeature[] = world.features
        .filter((f: { properties: { ISO_A3?: string; ADM0_A3?: string } }) => {
          const iso = f.properties.ISO_A3 ?? "";
          const iso2 = f.properties.ADM0_A3 ?? "";
          return iso !== "BRA" && iso2 !== "BRA";
        })
        .map((f: object) => ({ ...f, _type: "country" as const }));

      const states: AnyFeature[] = br.features.map((f: object) => ({
        ...f,
        _type: "state" as const,
      }));

      setFeatures([...countries, ...states]);
      setReady(true);
    });
  }, []);

  // ── mouse position para o label ─────────────────────────────────────────────
  const onMouseMove = useCallback((e: MouseEvent) => {
    setMousePos(e.clientX, e.clientY);
  }, [setMousePos]);
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  // ── configura controles e cor do oceano após montar ─────────────────────────
  useEffect(() => {
    if (!ready || !globeEl.current) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const g = globeEl.current as any;

    // OrbitControls
    const ctrl = g.controls?.();
    if (ctrl) {
      ctrl.autoRotate      = true;
      ctrl.autoRotateSpeed = 0.35;
      ctrl.enablePan       = false;
      ctrl.minDistance     = 200;
      ctrl.maxDistance     = 500;
      ctrl.dampingFactor   = 0.08;
    }

    // Cor do oceano (esfera base do globo)
    try {
      g.scene?.().traverse((obj: unknown) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const o = obj as any;
        if (o.isMesh && o.geometry?.parameters?.radius && o.geometry?.parameters?.radius > 50) {
          o.material.color.setStyle(OCEAN_COLOR);
          o.material.needsUpdate = true;
        }
      });
    } catch { /* silencioso */ }

    // Pausa rotação ao arrastar
    let timer: ReturnType<typeof setTimeout>;
    const el = g.renderer?.().domElement as HTMLElement | undefined;
    el?.addEventListener("pointerdown", () => {
      ctrl.autoRotate = false;
      clearTimeout(timer);
      timer = setTimeout(() => { ctrl.autoRotate = true; }, 3000);
    });
  }, [ready]);

  // ── cores e eventos ─────────────────────────────────────────────────────────
  const capColor = (feat: object) => {
    const f = feat as AnyFeature;
    const key = getKey(f);
    if (key === hoveredKey) return HOVER_COLOR;
    if (showIdeology && f._type === "country") {
      return getIdeologyColor(key);
    }
    return f._type === "state" ? STATE_COLOR : COUNTRY_COLOR;
  };

  const strokeColor = (feat: object) => {
    const f = feat as AnyFeature;
    // Fronteiras dos estados brasileiros um pouco mais visíveis
    return f._type === "state" ? "#4a5568" : BORDER_COLOR;
  };

  const altitudeFn = (feat: object) => {
    const f = feat as AnyFeature;
    // Estados sobem um pouco mais para não se misturar com o polígono do Brasil
    return f._type === "state" ? 0.01 : 0.005;
  };

  const onHover = (feat: object | null) => {
    const f = feat as AnyFeature | null;
    const key = f ? getKey(f) : null;
    setHoveredKey(key);

    if (!f?.properties) { setHoveredStore(null); return; }

    if (f._type === "state") {
      const uf = f.properties.UF ?? "";
      const meta = getStateMeta(uf);
      setHoveredStore({
        iso: key ?? "",
        name: f.properties.ESTADO ?? "",
        capital: meta.capital,
        continent: meta.regiao,
      });
    } else {
      const iso = getKey(f);
      const meta = getCountryMeta(iso);
      setHoveredStore({
        iso,
        name: meta.name || (f.properties.NAME ?? f.properties.ADMIN ?? ""),
        capital: meta.capital,
        continent: meta.continent,
      });
    }
  };

  const onClick = (feat: object) => {
    const f = feat as AnyFeature;
    if (!f?.properties) { setSelected(null); return; }

    if (f._type === "state") {
      const uf = f.properties.UF ?? "";
      const meta = getStateMeta(uf);
      setSelected({
        iso: getKey(f),
        name: f.properties.ESTADO ?? "",
        capital: meta.capital,
        continent: meta.regiao,
      });
    } else {
      const iso = getKey(f);
      const meta = getCountryMeta(iso);
      setSelected({
        iso,
        name: meta.name || (f.properties.NAME ?? f.properties.ADMIN ?? ""),
        capital: meta.capital,
        continent: meta.continent,
      });
    }
  };

  return (
    <div style={{
      position: "absolute",
      inset: 0,
      opacity: ready ? 1 : 0,
      transition: "opacity 1s ease",
      cursor: hoveredKey ? "pointer" : "grab",
    }}>
      <GlobeGL
        ref={globeEl}
        width={typeof window !== "undefined" ? window.innerWidth : 1920}
        height={typeof window !== "undefined" ? window.innerHeight : 1080}
        backgroundColor={OCEAN_COLOR}
        globeImageUrl={undefined}
        showAtmosphere={true}
        atmosphereColor="#1a4a8a"
        atmosphereAltitude={0.18}
        polygonsData={features}
        polygonCapColor={capColor}
        polygonSideColor={() => "rgba(0,0,0,0)"}
        polygonStrokeColor={strokeColor}
        polygonAltitude={altitudeFn}
        onPolygonHover={onHover}
        onPolygonClick={onClick}
        animateIn={false}
      />
    </div>
  );
}

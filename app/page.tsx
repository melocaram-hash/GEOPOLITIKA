"use client";

import dynamic from "next/dynamic";
import Header from "@/components/Header";
import CountryPanel from "@/components/CountryPanel";
import HoverLabel from "@/components/HoverLabel";
import IdeologyLegend from "@/components/IdeologyLegend";

const Globe = dynamic(() => import("@/components/Globe"), { ssr: false });

export default function Page() {
  return (
    <main style={{ height: "100dvh", width: "100vw", overflow: "hidden", background: "#080b12", position: "relative" }}>
      <Globe />
      <Header />
      <HoverLabel />
      <CountryPanel />
      <IdeologyLegend />
    </main>
  );
}

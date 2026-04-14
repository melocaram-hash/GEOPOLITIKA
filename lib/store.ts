import { create } from "zustand";

export type CountryInfo = {
  iso: string;
  name: string;
  capital?: string;
  continent?: string;
};

type GlobeState = {
  hoveredCountry: CountryInfo | null;
  selectedCountry: CountryInfo | null;
  mousePosition: { x: number; y: number };
  showIdeology: boolean;
  setHovered: (c: CountryInfo | null) => void;
  setSelected: (c: CountryInfo | null) => void;
  setMousePosition: (x: number, y: number) => void;
  toggleIdeology: () => void;
};

export const useGlobeStore = create<GlobeState>((set) => ({
  hoveredCountry: null,
  selectedCountry: null,
  mousePosition: { x: 0, y: 0 },
  showIdeology: false,
  setHovered: (c) => set({ hoveredCountry: c }),
  setSelected: (c) => set({ selectedCountry: c }),
  setMousePosition: (x, y) => set({ mousePosition: { x, y } }),
  toggleIdeology: () => set((s) => ({ showIdeology: !s.showIdeology })),
}));

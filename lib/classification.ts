/**
 * Sistema de classificação político-ideológica dos países.
 *
 * Dois eixos independentes (fonte: analise_politica_america_do_sul.txt):
 *
 *  EIXO 1 — Econômico/Social (0–100)
 *    0  = Extrema-Esquerda   (estatismo máximo)
 *    100 = Extrema-Direita   (liberalismo máximo)
 *    Faixas: 0–20 Extrema-Esq | 21–35 Esq | 36–45 Centro-Esq |
 *            46–54 Centro | 55–64 Centro-Dir | 65–80 Dir | 81–100 Extrema-Dir
 *
 *  EIXO 2 — Político/Institucional (0–100)
 *    0  = Libertário máximo (democracia plena)
 *    100 = Autoritário máximo
 *    Faixas: 0–20 Libertário | 21–35 Democracia Consolidada |
 *            36–45 Democracia c/ Falhas | 46–60 Regime Híbrido |
 *            61–80 Semi-autoritário | 81–100 Autoritário
 */

export type IdeologyLabel =
  | "extrema-esquerda"
  | "esquerda"
  | "centro-esquerda"
  | "centro"
  | "centro-direita"
  | "direita"
  | "extrema-direita";

export type DemocracyLabel =
  | "libertário"
  | "democracia consolidada"
  | "democracia com falhas"
  | "regime híbrido"
  | "semi-autoritário"
  | "autoritário";

export type CountryClassification = {
  // Eixo 1
  eixo1: number;           // 0–100
  labelEixo1: IdeologyLabel;
  // Eixo 2
  eixo2: number;           // 0–100
  labelEixo2: DemocracyLabel;
  // Dados do governo
  presidente: string;
  partido: string;
  desde: string;
  resumo: string;
  // Blocos detalhados Eixo 1
  blocos: {
    estadoMercado: number;    // nota 0–100 (maior = mais liberal/direita)
    protecaoSocial: number;   // nota 0–100 (maior = menos proteção = mais direita)
    valoresCulturais: number; // nota 0–100 (maior = mais conservador)
  };
  // Blocos detalhados Eixo 2
  democracia: {
    alternancia: number;  // nota 0–100 (maior = mais autoritário)
    judiciario: number;
    imprensa: number;
  };
};

// ─── Paleta ───────────────────────────────────────────────────────────────────
// Eixo 1: vermelho escuro (extrema-esq) → laranja → cinza → azul claro → azul escuro (extrema-dir)
export const IDEOLOGY_COLORS: Record<IdeologyLabel, string> = {
  "extrema-esquerda": "#8B0000",  // vermelho sangue
  "esquerda":         "#c0392b",  // vermelho vivo
  "centro-esquerda":  "#e57373",  // vermelho rosado
  "centro":           "#78909c",  // cinza azulado neutro
  "centro-direita":   "#5b8fd4",  // azul médio
  "direita":          "#1a5276",  // azul escuro
  "extrema-direita":  "#0a2744",  // azul quase preto
};

// Eixo 2: verde (libertário) → amarelo → laranja → vermelho (autoritário)
export const DEMOCRACY_COLORS: Record<DemocracyLabel, string> = {
  "libertário":             "#27ae60",
  "democracia consolidada": "#2ecc71",
  "democracia com falhas":  "#f39c12",
  "regime híbrido":         "#e67e22",
  "semi-autoritário":       "#c0392b",
  "autoritário":            "#7b241c",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function eixo1ToLabel(score: number): IdeologyLabel {
  if (score <= 20) return "extrema-esquerda";
  if (score <= 35) return "esquerda";
  if (score <= 45) return "centro-esquerda";
  if (score <= 54) return "centro";
  if (score <= 64) return "centro-direita";
  if (score <= 80) return "direita";
  return "extrema-direita";
}

export function eixo2ToLabel(score: number): DemocracyLabel {
  if (score <= 20) return "libertário";
  if (score <= 35) return "democracia consolidada";
  if (score <= 45) return "democracia com falhas";
  if (score <= 60) return "regime híbrido";
  if (score <= 80) return "semi-autoritário";
  return "autoritário";
}

// ─── Cor do globo (baseada no Eixo 1) ────────────────────────────────────────
export function getIdeologyColor(iso: string): string {
  const c = COUNTRY_CLASSIFICATIONS[iso];
  if (!c) return "#2c3340"; // sem dados → cinza padrão do globo
  return IDEOLOGY_COLORS[c.labelEixo1];
}

// ─── Classificações ───────────────────────────────────────────────────────────
export const COUNTRY_CLASSIFICATIONS: Record<string, CountryClassification> = {

  // ARGENTINA — Extrema-Direita / Democracia Consolidada
  ARG: {
    eixo1: 85.6, labelEixo1: "extrema-direita",
    eixo2: 29.8, labelEixo2: "democracia consolidada",
    presidente: "Javier Milei",
    partido: "La Libertad Avanza",
    desde: "Dezembro 2023",
    resumo: "Experimento mais radical de desmantelamento do Estado já visto na América do Sul em democracia. Ajuste fiscal brutal, desregulação massiva, privatizações. Anti-progressista mas sem agenda teocrática. Democracia sob tensão mas funcionando.",
    blocos: { estadoMercado: 92, protecaoSocial: 88, valoresCulturais: 72 },
    democracia: { alternancia: 28, judiciario: 30, imprensa: 32 },
  },

  // BOLÍVIA — Esquerda / Regime Híbrido
  BOL: {
    eixo1: 24.4, labelEixo1: "esquerda",
    eixo2: 60.8, labelEixo2: "regime híbrido",
    presidente: "Luis Arce",
    partido: "Movimento ao Socialismo (MAS)",
    desde: "Novembro 2020",
    resumo: "País com tentativa de golpe em 2024 e fratura profunda no MAS entre Arce e Evo Morales. Economia estatizante sob crise fiscal severa. Crise do gás natural compromete exportações. Democracia com instituições enfraquecidas.",
    blocos: { estadoMercado: 18, protecaoSocial: 22, valoresCulturais: 38 },
    democracia: { alternancia: 62, judiciario: 65, imprensa: 55 },
  },

  // CHILE — Direita / Libertário
  CHL: {
    eixo1: 67.7, labelEixo1: "direita",
    eixo2: 19.8, labelEixo2: "libertário",
    presidente: "José Antonio Kast",
    partido: "Partido Republicano",
    desde: "Março 2026",
    resumo: "Uma das democracias mais sólidas da América Latina. Economia das mais abertas da região, com previdência e saúde privadas. Conservadorismo cultural relevante. Boric tentou reformas estruturais mas foi barrado. Eleição de 2025 favoreceu a direita.",
    blocos: { estadoMercado: 68, protecaoSocial: 62, valoresCulturais: 75 },
    democracia: { alternancia: 18, judiciario: 20, imprensa: 22 },
  },

  // COLÔMBIA — Centro-Esquerda / Democracia com Falhas
  COL: {
    eixo1: 36.9, labelEixo1: "centro-esquerda",
    eixo2: 40.0, labelEixo2: "democracia com falhas",
    presidente: "Gustavo Petro",
    partido: "Pacto Histórico / Colombia Humana",
    desde: "Agosto 2022",
    resumo: "Ex-guerrilheiro do M-19 tenta reformas progressistas bloqueadas pelo Congresso. País estruturalmente dividido: agenda redistributiva ambiciosa com implementação limitada. Guerrilha, narcotráfico e violência limitam a democracia em vastas regiões.",
    blocos: { estadoMercado: 38, protecaoSocial: 32, valoresCulturais: 42 },
    democracia: { alternancia: 40, judiciario: 38, imprensa: 42 },
  },

  // EQUADOR — Direita / Regime Híbrido
  ECU: {
    eixo1: 65.2, labelEixo1: "direita",
    eixo2: 46.2, labelEixo2: "regime híbrido",
    presidente: "Daniel Noboa",
    partido: "Ação Democrática Nacional",
    desde: "Novembro 2023",
    resumo: "País em crise de segurança sem precedentes — declarou 'conflito armado interno' contra cartéis. Jovem presidente (nascido em 1987) governa com 'mãos de ferro', expandindo poderes militares. Economia dolarizada e pró-mercado. Reeleito em 2025.",
    blocos: { estadoMercado: 68, protecaoSocial: 62, valoresCulturais: 65 },
    democracia: { alternancia: 48, judiciario: 48, imprensa: 42 },
  },

  // GUIANA — Centro-Direita / Democracia com Falhas
  GUY: {
    eixo1: 55.8, labelEixo1: "centro-direita",
    eixo2: 36.2, labelEixo2: "democracia com falhas",
    presidente: "Irfaan Ali",
    partido: "PPP/Civic (Partido Progressivo do Povo)",
    desde: "Agosto 2020",
    resumo: "Maior fenômeno de crescimento econômico da década nas Américas. Produção de petróleo offshore transformou o país. Divisão étnica profunda entre indo-guianeses (PPP) e afro-guianeses (PNC) estrutura a política. Eleições de 2020 marcadas por tentativa de fraude.",
    blocos: { estadoMercado: 55, protecaoSocial: 55, valoresCulturais: 58 },
    democracia: { alternancia: 38, judiciario: 35, imprensa: 35 },
  },

  // PARAGUAI — Direita / Regime Híbrido
  PRY: {
    eixo1: 69.1, labelEixo1: "direita",
    eixo2: 52.6, labelEixo2: "regime híbrido",
    presidente: "Santiago Peña",
    partido: "Partido Colorado",
    desde: "Agosto 2023",
    resumo: "Partido Colorado governa há mais de 70 anos de forma quase ininterrupta. Um dos países mais conservadores da América do Sul — Igreja Católica tem influência determinante. Flat tax de 10% atrai capitais mas facilita lavagem de dinheiro. Hub do agronegócio e energia (Itaipu).",
    blocos: { estadoMercado: 62, protecaoSocial: 68, valoresCulturais: 82 },
    democracia: { alternancia: 52, judiciario: 58, imprensa: 48 },
  },

  // PERU — Centro-Direita / Regime Híbrido
  PER: {
    eixo1: 61.2, labelEixo1: "centro-direita",
    eixo2: 58.4, labelEixo2: "regime híbrido",
    presidente: "Dina Boluarte",
    partido: "Sem partido (ex-Perú Libre)",
    desde: "Dezembro 2022",
    resumo: "Caso mais evidente de democracia em colapso funcional sem ter se tornado formalmente autoritária. Boluarte governa com aprovação abaixo de 10%, sustentada por Congresso igualmente impopular. 7 presidentes em menos de 10 anos. Mais de 70 mortos nos protestos de 2022–2023.",
    blocos: { estadoMercado: 58, protecaoSocial: 62, valoresCulturais: 65 },
    democracia: { alternancia: 62, judiciario: 62, imprensa: 50 },
  },

  // SURINAME — Centro-Direita / Democracia Consolidada
  SUR: {
    eixo1: 59.7, labelEixo1: "centro-direita",
    eixo2: 35.9, labelEixo2: "democracia consolidada",
    presidente: "Chan Santokhi",
    partido: "VHP (Partido Reformista Progressista)",
    desde: "Julho 2020",
    resumo: "Menor e menos conhecida democracia da América do Sul (600 mil habitantes). Saiu de crise severa com inflação de 60% via acordo com FMI. Condenou historicamente o ex-ditador Bouterse por crimes contra a humanidade. Aguarda produção de petróleo offshore que pode transformar a economia.",
    blocos: { estadoMercado: 58, protecaoSocial: 60, valoresCulturais: 62 },
    democracia: { alternancia: 35, judiciario: 38, imprensa: 35 },
  },

  // URUGUAI — Esquerda / Libertário
  URY: {
    eixo1: 28.3, labelEixo1: "esquerda",
    eixo2: 15.0, labelEixo2: "libertário",
    presidente: "Yamandú Orsi",
    partido: "Frente Amplio",
    desde: "Março 2025",
    resumo: "A exceção sul-americana: esquerda programática com instituições democráticas exemplares. País mais secular e progressista da região — legalizou maconha, casamento igualitário e aborto. Consistentemente entre as 15 democracias mais plenas do mundo. Baixa desigualdade relativa.",
    blocos: { estadoMercado: 35, protecaoSocial: 28, valoresCulturais: 18 },
    democracia: { alternancia: 15, judiciario: 15, imprensa: 15 },
  },

  // VENEZUELA — Esquerda / Autoritário
  VEN: {
    eixo1: 22.8, labelEixo1: "esquerda",
    eixo2: 91.4, labelEixo2: "autoritário",
    presidente: "Nicolás Maduro",
    partido: "PSUV (Partido Socialista Unido de Venezuela)",
    desde: "Março 2013",
    resumo: "Regime mais autoritário da América do Sul. Fraude eleitoral em 2024 — Maduro declarou vitória sem apresentar atas. PIB caiu mais de 70% entre 2013 e 2021. Mais de 7,7 milhões de venezuelanos emigraram. Centenas de presos políticos. Edmundo González, reconhecido por dezenas de países como presidente eleito, governa no exílio.",
    blocos: { estadoMercado: 15, protecaoSocial: 18, valoresCulturais: 42 },
    democracia: { alternancia: 92, judiciario: 92, imprensa: 90 },
  },
};

// Mantém compatibilidade com código existente que usa getIdeology / IDEOLOGY_COLORS / IdeologyEntry
export type IdeologyEntry = {
  blocks: { estadoMercado: number; protecaoSocial: number; direitosCivis: number; democracia: number; conservadorismo: number };
  score: number;
  label: IdeologyLabel;
  notes?: string;
};

export function getIdeology(iso: string): IdeologyEntry | null {
  const c = COUNTRY_CLASSIFICATIONS[iso];
  if (!c) return null;
  // Adapta para o formato antigo usado no CountryPanel legado
  return {
    blocks: {
      estadoMercado:  Math.round((100 - c.blocos.estadoMercado) / 10),
      protecaoSocial: Math.round((100 - c.blocos.protecaoSocial) / 10),
      direitosCivis:  5,
      democracia:     Math.round((100 - c.democracia.alternancia) / 10),
      conservadorismo: Math.round((100 - c.blocos.valoresCulturais) / 10),
    },
    score: parseFloat((c.eixo1 / 10).toFixed(1)),
    label: c.labelEixo1,
    notes: c.resumo,
  };
}

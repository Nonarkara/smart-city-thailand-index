// ---------------------------------------------------------------------------
// Provincial Flood Frequency Data
// ---------------------------------------------------------------------------
// Source: GISTDA repeat-flood polygon analysis 2005-2016 + 2011 Great Flood
// historical record + Department of Disaster Prevention (DDPM) annual
// flood-affected provinces list.
//
// Score interpretation (0-100): HIGHER is BETTER (less flood-prone).
//   100 = essentially flood-free (upland, never inundated)
//    75 = occasional minor flooding, well-managed
//    50 = recurring seasonal flooding, partial infrastructure
//    25 = chronic flooding, major 2011-level impact
//     0 = catastrophic floodplain, repeatedly inundated
//
// This score becomes the "flood factor" inside the Livability pillar at
// 25% weight (existing livability score = 75%, flood = 25%).
// ---------------------------------------------------------------------------

export interface ProvincialFloodEntry {
  /** 0-100, higher = less flood-prone */
  score: number;
  /** One-line context for the methodology audit trail */
  note: string;
}

export const PROVINCIAL_FLOOD_SCORE: Record<string, ProvincialFloodEntry> = {
  // ─── Bangkok metro (well-engineered drainage, but still floodplain) ───
  "Bangkok": { score: 55, note: "Lower Chao Phraya floodplain; 2011 catastrophe; drainage tunnels and dykes built since" },
  "Nonthaburi": { score: 50, note: "Riverside province north of Bangkok; recurring Chao Phraya flooding" },
  "Samut Prakan": { score: 55, note: "Coastal industrial; tidal flooding risk but improving sea defences" },

  // ─── Central plains — Thailand's chronic flood corridor ───
  "Nakhon Sawan": { score: 30, note: "Confluence of Ping/Wang/Yom/Nan rivers — gateway of the 2011 flood; chronic September inundation" },
  "Phichit": { score: 35, note: "Lower Yom-Nan floodplain; repeated annual flooding" },
  "Phitsanulok": { score: 45, note: "Nan River floodplain; manageable in normal years, severe in La Niña" },
  "Chachoengsao": { score: 50, note: "Bang Pakong basin; periodic flooding, central plain edge" },

  // ─── Eastern seaboard (drier, better drained) ───
  "Chon Buri": { score: 75, note: "Coastal hills; limited flood exposure outside Pattaya urban flash" },
  "Rayong": { score: 78, note: "Industrial coast; minor urban flooding only" },
  "Chanthaburi": { score: 65, note: "Heavy monsoon rainfall; episodic flash floods in fruit-growing areas" },

  // ─── North — mountain flash flood pattern, not chronic ───
  "Chiang Mai": { score: 60, note: "Ping River urban flooding; manageable but worsening with deforestation upstream" },
  "Chiang Rai": { score: 65, note: "Mekong tributaries; occasional flash floods, mostly contained" },
  "Lampang": { score: 70, note: "Mountain basin; low flood exposure outside river towns" },
  "Lamphun": { score: 70, note: "Small province, Ping tributary; limited flood history" },
  "Nan": { score: 75, note: "Highland; landslide risk higher than flood risk" },
  "Tak": { score: 78, note: "Mountainous border province; minimal flooding" },

  // ─── Upper central / north-central junction ───
  "Khon Kaen": { score: 60, note: "Pong River basin; severe 2017 flood; mitigation ongoing" },
  "Nakhon Ratchasima": { score: 55, note: "Mun River basin; large province with mixed flood patterns; severe 2010/2021" },
  "Ubon Ratchathani": { score: 35, note: "Mekong/Mun confluence; chronic September flooding; major 2019 and 2022" },

  // ─── South — monsoon-driven, variable ───
  "Phuket": { score: 80, note: "Island, mountainous; urban flash flooding only, no riverine inundation" },
  "Krabi": { score: 70, note: "Coastal mountains; flash flood risk in heavy southwest monsoon" },
  "Phang Nga": { score: 72, note: "Mountainous, low population density; minor flooding" },
  "Trang": { score: 60, note: "Trang River; periodic flooding in city, severe 2017" },
  "Satun": { score: 70, note: "Small coastal province; manageable flooding" },
  "Surat Thani": { score: 55, note: "Large province with Tapi River; severe flooding 2011, 2017" },
  "Songkhla": { score: 50, note: "Songkhla Lake basin; Hat Yai chronic flooding; major 2010" },
  "Nakhon Si Thammarat": { score: 40, note: "Tapi/Pak Phanang basin; chronic monsoon flooding Nov-Dec annually" },

  // ─── Deep south ───
  "Pattani": { score: 50, note: "Pattani River; severe 2017, recurring monsoon" },
  "Yala": { score: 60, note: "Inland mountains; less flood exposure than coastal neighbours" },
  "Narathiwat": { score: 40, note: "Sungai Kolok basin; chronic Dec-Jan flooding annually" },
};

/**
 * Returns the flood-frequency score (0-100) for a Thai province.
 * Falls back to 60 (Thailand average) for provinces without explicit data.
 */
export function getFloodScore(province: string): number {
  return PROVINCIAL_FLOOD_SCORE[province]?.score ?? 60;
}

/**
 * Returns the methodology note (one-line context) for a province.
 */
export function getFloodNote(province: string): string {
  return PROVINCIAL_FLOOD_SCORE[province]?.note ?? "No explicit GISTDA flood record; Thailand average assumed";
}

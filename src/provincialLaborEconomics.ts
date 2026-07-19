// ---------------------------------------------------------------------------
// Provincial Labor Economics — minimum wage + cost-of-living signal
// ---------------------------------------------------------------------------
// Minimum wage: Ministry of Labour, National Wage Committee Notification No. 14
// (17 June 2025, effective 1 July 2025) — real, government-set, complete for all
// 77 provinces. Verified independently against Ministry of Labour public releases.
//
// Cost of living: Numbeo's Cost of Living Index (NYC=100) — kept ONLY for the
// provinces where a genuinely comparable Numbeo entry exists. Thailand's official
// provincial CPI (TPSO CPIP) measures year-over-year inflation from a 2019 base,
// not an absolute cost level, and is NOT comparable to the Numbeo scale — mixing
// the two would misrepresent which provinces are actually more/less expensive,
// so this file intentionally does not include TPSO CPIP values.
// ---------------------------------------------------------------------------

export interface LaborEconomicsEntry {
  minWageBaht?: number;
  minWageSource?: string;
  minWageSourceUrl?: string;
  minWageAsOf?: string;
  /** Numbeo Cost of Living Index, NYC = 100. Higher = more expensive. */
  costOfLivingIndexRaw?: number;
  costOfLivingSource?: string;
  costOfLivingSourceUrl?: string;
  costOfLivingAsOf?: string;
}

// Keyed by the same English province name used on SmartCity.province.
export const PROVINCIAL_LABOR_ECONOMICS: Record<string, LaborEconomicsEntry> = {
  "Amnat Charoen": {
    minWageBaht: 347,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Ang Thong": {
    minWageBaht: 348,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Ayutthaya": {
    minWageBaht: 357,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Bangkok": {
    minWageBaht: 400,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14 (ประกาศคณะกรรมการค่าจ้าง ฉบับที่ 14)",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
    costOfLivingIndexRaw: 43.7,
    costOfLivingSource: "Numbeo — Cost of Living Index (crowd-sourced retail/rent price index, New York City = 100). No official TPSO provincial CPI (CPIP) series exists for Bangkok — Bangkok/vicinity is tracked only inside the national headline CPI, not as a separate CPIP province code (verified: province_code=10 returns zero records across 2017-2026 on the official API).",
    costOfLivingSourceUrl: "https://www.numbeo.com/cost-of-living/country_result.jsp?country=Thailand",
    costOfLivingAsOf: "2026-07",
  },
  "Bueng Kan": {
    minWageBaht: 349,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Buriram": {
    minWageBaht: 352,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Chachoengsao": {
    minWageBaht: 400,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Chainat": {
    minWageBaht: 348,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Chaiyaphum": {
    minWageBaht: 348,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Chanthaburi": {
    minWageBaht: 352,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Chiang Mai": {
    minWageBaht: 357,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14 (base rate; Mueang Chiang Mai district only = 380 baht/day)",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Chiang Rai": {
    minWageBaht: 352,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Chon Buri": {
    minWageBaht: 400,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
    costOfLivingIndexRaw: 37.8,
    costOfLivingSource: "Numbeo — Cost of Living Index (crowd-sourced, New York City = 100). City-level figure for Pattaya specifically, distinct from the TPSO province-wide Chonburi CPIP figure above.",
    costOfLivingSourceUrl: "https://www.numbeo.com/cost-of-living/country_result.jsp?country=Thailand",
    costOfLivingAsOf: "2026-07",
  },
  "Chumphon": {
    minWageBaht: 351,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Kalasin": {
    minWageBaht: 349,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Kamphaeng Phet": {
    minWageBaht: 347,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Kanchanaburi": {
    minWageBaht: 352,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Khon Kaen": {
    minWageBaht: 357,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Krabi": {
    minWageBaht: 354,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Lampang": {
    minWageBaht: 347,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Lamphun": {
    minWageBaht: 350,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Loei": {
    minWageBaht: 347,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Lop Buri": {
    minWageBaht: 356,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Mae Hong Son": {
    minWageBaht: 347,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Maha Sarakham": {
    minWageBaht: 347,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Mukdahan": {
    minWageBaht: 352,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Nakhon Nayok": {
    minWageBaht: 355,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Nakhon Pathom": {
    minWageBaht: 372,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Nakhon Phanom": {
    minWageBaht: 352,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Nakhon Ratchasima": {
    minWageBaht: 359,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Nakhon Sawan": {
    minWageBaht: 350,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Nakhon Si Thammarat": {
    minWageBaht: 349,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Nan": {
    minWageBaht: 345,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Narathiwat": {
    minWageBaht: 337,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Nong Bua Lamphu": {
    minWageBaht: 347,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Nong Khai": {
    minWageBaht: 355,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Nonthaburi": {
    minWageBaht: 372,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Pathum Thani": {
    minWageBaht: 372,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Pattani": {
    minWageBaht: 337,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Phang Nga": {
    minWageBaht: 352,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Phatthalung": {
    minWageBaht: 348,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Phayao": {
    minWageBaht: 345,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Phetchabun": {
    minWageBaht: 349,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Phetchaburi": {
    minWageBaht: 351,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Phichit": {
    minWageBaht: 347,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Phitsanulok": {
    minWageBaht: 352,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Phrae": {
    minWageBaht: 345,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Phuket": {
    minWageBaht: 400,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Prachin Buri": {
    minWageBaht: 357,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Prachuap Khiri Khan": {
    minWageBaht: 352,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Ranong": {
    minWageBaht: 347,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Ratchaburi": {
    minWageBaht: 347,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Rayong": {
    minWageBaht: 400,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Roi Et": {
    minWageBaht: 349,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Sa Kaeo": {
    minWageBaht: 352,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Sakon Nakhon": {
    minWageBaht: 352,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Samut Prakan": {
    minWageBaht: 372,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Samut Sakhon": {
    minWageBaht: 372,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Samut Songkhram": {
    minWageBaht: 358,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Saraburi": {
    minWageBaht: 357,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Satun": {
    minWageBaht: 347,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Sing Buri": {
    minWageBaht: 348,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Sisaket": {
    minWageBaht: 347,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Songkhla": {
    minWageBaht: 352,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14 (base rate; Hat Yai district only = 380 baht/day)",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Sukhothai": {
    minWageBaht: 347,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Suphan Buri": {
    minWageBaht: 355,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Surat Thani": {
    minWageBaht: 352,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14 (base rate; Koh Samui district only = 400 baht/day)",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Surin": {
    minWageBaht: 351,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Tak": {
    minWageBaht: 352,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Trang": {
    minWageBaht: 345,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Trat": {
    minWageBaht: 354,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Ubon Ratchathani": {
    minWageBaht: 352,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Udon Thani": {
    minWageBaht: 347,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Uthai Thani": {
    minWageBaht: 347,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Uttaradit": {
    minWageBaht: 347,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Yala": {
    minWageBaht: 337,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
  "Yasothon": {
    minWageBaht: 350,
    minWageSource: "Ministry of Labour, National Wage Committee Notification No. 14",
    minWageSourceUrl: "https://www.mol.go.th/wp-content/uploads/sites/2/2025/07/ประกาศ-คจ.ขั้นต่ำ-ฉ14-รวม.pdf",
    minWageAsOf: "2025-07",
  },
};

export function getLaborEconomics(province: string): LaborEconomicsEntry | undefined {
  return PROVINCIAL_LABOR_ECONOMICS[province];
}

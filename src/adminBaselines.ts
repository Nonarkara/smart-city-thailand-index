import type { SmartCity } from "./types.ts";

export type AdminBaselineScope =
  | "province"
  | "bangkok_district"
  | "project_area"
  | "historic_district";

export interface AdminBaseline {
  key: string;
  label: string;
  scope: AdminBaselineScope;
  populationThousand?: number;
  landAreaKm2?: number;
  observedAt: string;
  sourceName: string;
  sourceUrl: string;
  confidence: number;
  methodNote: string;
}

export interface ResolvedBaselineValue {
  value: number | undefined;
  baseline: AdminBaseline | undefined;
  methodNote: string;
}

const THAI_PROVINCE_SOURCE_URL = "https://en.wikipedia.org/wiki/Provinces_of_Thailand";

const provinceBaselineMethod =
  "Province-level administrative baseline used as a proxy where the smart-city proposal boundary is not published. Population is DOPA December 2024; area is administrative land area.";

function provinceBaseline(label: string, populationThousand: number, landAreaKm2: number): AdminBaseline {
  return {
    key: label,
    label,
    scope: "province",
    populationThousand,
    landAreaKm2,
    observedAt: "2024-12-31T00:00:00.000Z",
    sourceName: "Provinces of Thailand table citing DOPA/RFD",
    sourceUrl: THAI_PROVINCE_SOURCE_URL,
    confidence: 0.72,
    methodNote: provinceBaselineMethod,
  };
}

export const provinceBaselines: Record<string, AdminBaseline> = {
  "Amnat Charoen": provinceBaseline("Amnat Charoen", 372, 3290),
  "Ang Thong": provinceBaseline("Ang Thong", 269, 950),
  Bangkok: provinceBaseline("Bangkok", 5456, 1564),
  "Bueng Kan": provinceBaseline("Bueng Kan", 419, 4003),
  Buriram: provinceBaseline("Buriram", 1566, 10080),
  Chachoengsao: provinceBaseline("Chachoengsao", 733, 5169),
  "Chai Nat": provinceBaseline("Chai Nat", 314, 2506),
  Chaiyaphum: provinceBaseline("Chaiyaphum", 1106, 12698),
  Chanthaburi: provinceBaseline("Chanthaburi", 536, 6415),
  "Chiang Mai": provinceBaseline("Chiang Mai", 1799, 22311),
  "Chiang Rai": provinceBaseline("Chiang Rai", 1298, 11503),
  Chonburi: provinceBaseline("Chonburi", 1636, 4508),
  Chumphon: provinceBaseline("Chumphon", 508, 5998),
  Kalasin: provinceBaseline("Kalasin", 962, 6936),
  "Kamphaeng Phet": provinceBaseline("Kamphaeng Phet", 701, 8512),
  Kanchanaburi: provinceBaseline("Kanchanaburi", 896, 19385),
  "Khon Kaen": provinceBaseline("Khon Kaen", 1772, 10659),
  Krabi: provinceBaseline("Krabi", 484, 5323),
  Lampang: provinceBaseline("Lampang", 704, 12488),
  Lamphun: provinceBaseline("Lamphun", 397, 4478),
  Loei: provinceBaseline("Loei", 632, 10500),
  Lopburi: provinceBaseline("Lopburi", 725, 6493),
  "Mae Hong Son": provinceBaseline("Mae Hong Son", 288, 12765),
  "Maha Sarakham": provinceBaseline("Maha Sarakham", 930, 5607),
  Mukdahan: provinceBaseline("Mukdahan", 351, 4126),
  "Nakhon Nayok": provinceBaseline("Nakhon Nayok", 260, 2141),
  "Nakhon Pathom": provinceBaseline("Nakhon Pathom", 926, 2142),
  "Nakhon Phanom": provinceBaseline("Nakhon Phanom", 711, 5637),
  "Nakhon Ratchasima": provinceBaseline("Nakhon Ratchasima", 2620, 20736),
  "Nakhon Sawan": provinceBaseline("Nakhon Sawan", 1014, 9526),
  "Nakhon Si Thammarat": provinceBaseline("Nakhon Si Thammarat", 1535, 9885),
  Nan: provinceBaseline("Nan", 471, 12130),
  Narathiwat: provinceBaseline("Narathiwat", 824, 4491),
  "Nong Bua Lamphu": provinceBaseline("Nong Bua Lamphu", 504, 4099),
  "Nong Khai": provinceBaseline("Nong Khai", 512, 3275),
  Nonthaburi: provinceBaseline("Nonthaburi", 1318, 637),
  "Pathum Thani": provinceBaseline("Pathum Thani", 1236, 1520),
  Pattani: provinceBaseline("Pattani", 741, 1977),
  "Phang Nga": provinceBaseline("Phang Nga", 266, 5495),
  Phatthalung: provinceBaseline("Phatthalung", 519, 3861),
  Phayao: provinceBaseline("Phayao", 455, 6189),
  Phetchabun: provinceBaseline("Phetchabun", 961, 12340),
  Phetchaburi: provinceBaseline("Phetchaburi", 484.1, 6172),
  Phichit: provinceBaseline("Phichit", 517, 4319),
  Phitsanulok: provinceBaseline("Phitsanulok", 839, 10589),
  "Phra Nakhon Si Ayutthaya": provinceBaseline("Phra Nakhon Si Ayutthaya", 823, 2548),
  Phrae: provinceBaseline("Phrae", 422, 6483),
  Phuket: provinceBaseline("Phuket", 430, 547),
  Prachinburi: provinceBaseline("Prachinburi", 501, 5026),
  "Prachuap Khiri Khan": provinceBaseline("Prachuap Khiri Khan", 552, 6414),
  Ranong: provinceBaseline("Ranong", 193, 3230),
  Ratchaburi: provinceBaseline("Ratchaburi", 864, 5189),
  Rayong: provinceBaseline("Rayong", 782, 3666),
  "Roi Et": provinceBaseline("Roi Et", 1276, 7873),
  "Sa Kaeo": provinceBaseline("Sa Kaeo", 562, 6831),
  "Sakon Nakhon": provinceBaseline("Sakon Nakhon", 1138, 9580),
  "Samut Prakan": provinceBaseline("Samut Prakan", 1381, 947),
  "Samut Sakhon": provinceBaseline("Samut Sakhon", 591, 866),
  "Samut Songkhram": provinceBaseline("Samut Songkhram", 187, 414),
  Saraburi: provinceBaseline("Saraburi", 639, 3499),
  Satun: provinceBaseline("Satun", 325, 3019),
  "Sing Buri": provinceBaseline("Sing Buri", 200, 817),
  Sisaket: provinceBaseline("Sisaket", 1442, 8936),
  Songkhla: provinceBaseline("Songkhla", 1431, 7741),
  Sukhothai: provinceBaseline("Sukhothai", 573, 6671),
  "Suphan Buri": provinceBaseline("Suphan Buri", 822, 5410),
  "Surat Thani": provinceBaseline("Surat Thani", 1077, 13079),
  Surin: provinceBaseline("Surin", 1360, 8854),
  Tak: provinceBaseline("Tak", 699, 17303),
  Trang: provinceBaseline("Trang", 635, 4726),
  Trat: provinceBaseline("Trat", 227, 2866),
  "Ubon Ratchathani": provinceBaseline("Ubon Ratchathani", 1868, 15626),
  "Udon Thani": provinceBaseline("Udon Thani", 1552, 11072),
  "Uthai Thani": provinceBaseline("Uthai Thani", 320, 6647),
  Uttaradit: provinceBaseline("Uttaradit", 436, 7906),
  Yala: provinceBaseline("Yala", 553, 4476),
  Yasothon: provinceBaseline("Yasothon", 525, 4131),
};

const provinceAliases: Record<string, string> = {
  Ayutthaya: "Phra Nakhon Si Ayutthaya",
  Buriram: "Buriram",
  Chainat: "Chai Nat",
  "Chon Buri": "Chonburi",
  "Lop Buri": "Lopburi",
  "Prachin Buri": "Prachinburi",
};

const cityBaselineOverrides: Record<string, AdminBaseline> = {
  "reg-bangkok-noi": {
    key: "reg-bangkok-noi",
    label: "Bangkok Noi District",
    scope: "bangkok_district",
    populationThousand: 112.046,
    landAreaKm2: 11.944,
    observedAt: "2017-12-31T00:00:00.000Z",
    sourceName: "Bangkok Noi district table citing DOPA",
    sourceUrl: "https://en.wikipedia.org/wiki/Bangkok_Noi_district",
    confidence: 0.68,
    methodNote: "Bangkok district administrative baseline used because this registered proposal is district-level.",
  },
  "reg-bang-rak": {
    key: "reg-bang-rak",
    label: "Bang Rak District",
    scope: "bangkok_district",
    populationThousand: 48.227,
    landAreaKm2: 5.54,
    observedAt: "2019-12-31T00:00:00.000Z",
    sourceName: "Bang Rak district table",
    sourceUrl: "https://en.wikipedia.org/wiki/Bang_Rak_district",
    confidence: 0.68,
    methodNote: "Bangkok district administrative baseline used because this registered proposal is district-level.",
  },
  "reg-din-daeng": {
    key: "reg-din-daeng",
    label: "Din Daeng District",
    scope: "bangkok_district",
    populationThousand: 122.563,
    landAreaKm2: 8.354,
    observedAt: "2017-12-31T00:00:00.000Z",
    sourceName: "Din Daeng district table citing DOPA",
    sourceUrl: "https://en.wikipedia.org/wiki/Din_Daeng_district",
    confidence: 0.68,
    methodNote: "Bangkok district administrative baseline used because this registered proposal is district-level.",
  },
  "reg-chatuchak": {
    key: "reg-chatuchak",
    label: "Chatuchak District",
    scope: "bangkok_district",
    populationThousand: 156.684,
    landAreaKm2: 32.908,
    observedAt: "2017-12-31T00:00:00.000Z",
    sourceName: "Chatuchak district table citing DOPA",
    sourceUrl: "https://en.wikipedia.org/wiki/Chatuchak_district",
    confidence: 0.68,
    methodNote: "Bangkok district administrative baseline used because this registered proposal is district-level.",
  },
  "reg-bang-sue": {
    key: "reg-bang-sue",
    label: "Bang Sue District",
    scope: "bangkok_district",
    populationThousand: 125.44,
    landAreaKm2: 11.545,
    observedAt: "2017-12-31T00:00:00.000Z",
    sourceName: "Bang Sue district table citing DOPA",
    sourceUrl: "https://en.wikipedia.org/wiki/Bang_Sue_district",
    confidence: 0.68,
    methodNote: "Bangkok district administrative baseline used because this registered proposal is district-level.",
  },
  "wangchan-valley": {
    key: "wangchan-valley",
    label: "Wangchan Valley",
    scope: "project_area",
    landAreaKm2: 5.5264,
    observedAt: "2023-07-11T00:00:00.000Z",
    sourceName: "Thailand.go.th Wangchan Valley profile",
    sourceUrl: "https://thailand.go.th/issue-focus-detail/001_03_098?hl=en",
    confidence: 0.82,
    methodNote: "Project land area converted from 3,454 rai to square kilometres; permanent population remains unreported.",
  },
  makkasan: {
    key: "makkasan",
    label: "Makkasan HSR station development area",
    scope: "project_area",
    landAreaKm2: 0.24,
    observedAt: "2026-03-01T00:00:00.000Z",
    sourceName: "SYSTRA Eastern HSR project profile",
    sourceUrl: "https://www.systra.com/singapore/project/eastern-hsr-linking-three-airports-thailand/",
    confidence: 0.72,
    methodNote: "Project land area from the Makkasan high-speed rail development scope; no resident population has been published.",
  },
  "phuket-tinicon": {
    key: "phuket-tinicon",
    label: "Phuket Tinicon Valley",
    scope: "project_area",
    landAreaKm2: 2.0848,
    observedAt: "2025-08-25T00:00:00.000Z",
    sourceName: "depa Phuket Tinicon Valley executive summary",
    sourceUrl: "https://depa.or.th/storage/app/media/SmartCity/Tab_SmartCity/2025-sep-update/20250825-Executive%20and%20Solution%20summary_Phuket%20Tinicon%20Valley.pdf",
    confidence: 0.84,
    methodNote: "Project proposal boundary area; published users/day are not treated as resident population.",
  },
  rattanakosin: {
    key: "rattanakosin",
    label: "Rattanakosin Island",
    scope: "historic_district",
    landAreaKm2: 4.1,
    observedAt: "2026-03-01T00:00:00.000Z",
    sourceName: "Thaiways Rattanakosin Island area guide",
    sourceUrl: "https://www.thaiwaysmagazine.com/bangkok/popular-areas/rattanakosin-island.html",
    confidence: 0.65,
    methodNote: "Historic district area proxy: inner Rattanakosin 1.8 km2 plus outer Rattanakosin 2.3 km2.",
  },
  "klong-phadung": {
    key: "klong-phadung",
    label: "Khlong Phadung Krung Kasem historic expansion area",
    scope: "historic_district",
    landAreaKm2: 8.8832,
    observedAt: "2026-03-01T00:00:00.000Z",
    sourceName: "Khlong Phadung Krung Kasem history table",
    sourceUrl: "https://en.wikipedia.org/wiki/Khlong_Phadung_Krung_Kasem",
    confidence: 0.62,
    methodNote: "Historic expansion area converted from 5,552 rai; use as a corridor-context proxy, not a cadastral smart-city boundary.",
  },
};

function normalizeProvinceName(province: string): string {
  return provinceAliases[province] ?? province;
}

export function getProvinceBaseline(province: string): AdminBaseline | undefined {
  return provinceBaselines[normalizeProvinceName(province)];
}

export function getAdminBaselineForCity(city: Pick<SmartCity, "id" | "province">): AdminBaseline | undefined {
  return cityBaselineOverrides[city.id] ?? getProvinceBaseline(city.province);
}

export function getResolvedPopulationThousand(city: Pick<SmartCity, "id" | "province" | "metrics" | "status">): ResolvedBaselineValue {
  if (city.metrics.population != null && city.metrics.population > 0) {
    return {
      value: city.metrics.population,
      baseline: city.status === "registered" ? getAdminBaselineForCity(city) : undefined,
      methodNote: city.status === "registered" ? provinceBaselineMethod : "City population from the SCITI input dataset.",
    };
  }

  const baseline = getAdminBaselineForCity(city);
  return {
    value: baseline?.populationThousand,
    baseline,
    methodNote: baseline?.methodNote ?? "Population baseline pending source curation.",
  };
}

export function getResolvedLandAreaKm2(
  city: Pick<SmartCity, "id" | "province" | "metrics">,
  contextLandAreaKm2?: number,
): ResolvedBaselineValue {
  const override = cityBaselineOverrides[city.id];
  if (city.metrics.landAreaKm2 !== undefined) {
    return {
      value: city.metrics.landAreaKm2,
      baseline: override ?? getAdminBaselineForCity(city),
      methodNote: override?.methodNote ?? "Land area from the SCITI input dataset.",
    };
  }

  if (override?.landAreaKm2 !== undefined) {
    return {
      value: override.landAreaKm2,
      baseline: override,
      methodNote: override.methodNote,
    };
  }

  if (contextLandAreaKm2 !== undefined) {
    return {
      value: contextLandAreaKm2,
      baseline: undefined,
      methodNote: "Land area from the curated city context profile.",
    };
  }

  const baseline = getAdminBaselineForCity(city);
  return {
    value: baseline?.landAreaKm2,
    baseline,
    methodNote: baseline?.methodNote ?? "Land area baseline pending source curation.",
  };
}

export function getPopulationDensityPerKm2(
  city: Pick<SmartCity, "id" | "province" | "metrics" | "status">,
  contextLandAreaKm2?: number,
): ResolvedBaselineValue {
  const population = getResolvedPopulationThousand(city);
  const landArea = getResolvedLandAreaKm2(city, contextLandAreaKm2);
  const value = population.value !== undefined && population.value > 0 && landArea.value !== undefined && landArea.value > 0
    ? (population.value * 1000) / landArea.value
    : undefined;

  return {
    value,
    baseline: landArea.baseline ?? population.baseline,
    methodNote: "Derived from resolved population and land-area baselines; check source scope before comparing exact municipal density.",
  };
}

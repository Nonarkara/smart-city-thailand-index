import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// --- CONFIGURATION ---
// User: replace these with your actual published Google Sheet CSV URLs
const WEEKLY_SHEET_URL = process.env.WEEKLY_SHEET_URL || '';
const RANKING_SHEET_URL = process.env.RANKING_SHEET_URL || '';

async function fetchCsv(url) {
  if (!url) return null;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.statusText}`);
  const text = await res.text();
  return parse(text, { columns: true, skip_empty_lines: true });
}

function formatWeeklyDigest(rows) {
  if (!rows || rows.length === 0) return null;
  const row = rows[0]; // Always take the first row (latest)
  
  return `import type { WeeklyDigest } from "./weeklyDigest";

export const WEEKLY_DIGEST_DATA: WeeklyDigest = {
  weekOf: "${row.weekOf}",
  trendingCity: {
    cityId: "${row.trendingCityId}",
    note: {
      en: "${row.trendingNoteEn}",
      th: "${row.trendingNoteTh}",
      zh: "${row.trendingNoteZh}",
    },
  },
  trendingSearch: {
    phrase: {
      en: "${row.searchPhraseEn}",
      th: "${row.searchPhraseTh}",
      zh: "${row.searchPhraseZh}",
    },
    deltaLabel: {
      en: "${row.searchDeltaEn}",
      th: "${row.searchDeltaTh}",
      zh: "${row.searchDeltaZh}",
    },
    lensId: "${row.lensId || ''}",
  },
  headline: {
    title: {
      en: "${row.headlineTitleEn}",
      th: "${row.headlineTitleTh}",
      zh: "${row.headlineTitleZh}",
    },
    gloss: {
      en: "${row.headlineGlossEn}",
      th: "${row.headlineGlossTh}",
      zh: "${row.headlineGlossZh}",
    },
    url: "${row.headlineUrl}",
  },
};
`;
}

function formatRankingOverrides(rows) {
  if (!rows) return 'export const RANKING_OVERRIDES: Record<string, any> = {};\n';
  
  // Try to load existing data for delta comparison
  let existingOverrides = {};
  try {
    if (fs.existsSync('src/dynamicCityData.ts')) {
      const existingContent = fs.readFileSync('src/dynamicCityData.ts', 'utf8');
      const match = existingContent.match(/RANKING_OVERRIDES: Record<string, any> = (\{[\s\S]*\});/);
      if (match) {
        existingOverrides = JSON.parse(match[1]);
      }
    }
  } catch (err) {
    console.log('Note: Could not parse existing rankings for delta check.');
  }

  const overrides = {};
  for (const row of rows) {
    const scores = {
      livability: parseFloat(row.livability),
      economy: parseFloat(row.economy),
      safety: parseFloat(row.safety),
      wellbeing: parseFloat(row.wellbeing),
      environment: parseFloat(row.environment),
      hospitality: parseFloat(row.hospitality),
      digital: parseFloat(row.digital),
    };

    // --- ANOMALY DETECTION (Google Cheaters Check) ---
    for (const [key, val] of Object.entries(scores)) {
      // 1. Bounds Check
      if (val > 100 || val < 0) {
        console.warn(`⚠️ [ANOMALY] City ${row.cityId} has out-of-bounds score for ${key}: ${val}`);
      }
      
      // 2. Delta Check (Significant Spikes)
      const prev = existingOverrides[row.cityId]?.[key];
      if (prev !== undefined && Math.abs(val - prev) > 40) {
        console.warn(`⚠️ [ANOMALY] City ${row.cityId} has massive score delta for ${key}: ${prev} -> ${val}`);
      }
    }

    overrides[row.cityId] = scores;
  }
  
  return `export const RANKING_OVERRIDES: Record<string, any> = ${JSON.stringify(overrides, null, 2)};\n`;
}

async function sync() {
  console.log('--- SCITI DATA SYNC ---');
  
  try {
    if (WEEKLY_SHEET_URL) {
      console.log('Fetching weekly digest...');
      const weeklyRows = await fetchCsv(WEEKLY_SHEET_URL);
      const content = formatWeeklyDigest(weeklyRows);
      if (content) {
        fs.writeFileSync('src/dynamicWeeklyData.ts', content);
        console.log('✅ src/dynamicWeeklyData.ts updated.');
      }
    } else {
      console.log('⚠️ WEEKLY_SHEET_URL not set, skipping weekly digest sync.');
    }

    if (RANKING_SHEET_URL) {
      console.log('Fetching ranking overrides...');
      const rankingRows = await fetchCsv(RANKING_SHEET_URL);
      const content = formatRankingOverrides(rankingRows);
      fs.writeFileSync('src/dynamicCityData.ts', content);
      console.log('✅ src/dynamicCityData.ts updated.');
    } else {
      console.log('⚠️ RANKING_SHEET_URL not set, skipping ranking overrides sync.');
      if (!fs.existsSync('src/dynamicCityData.ts')) {
        fs.writeFileSync('src/dynamicCityData.ts', 'export const RANKING_OVERRIDES = {};\n');
      }
    }
    
    console.log('--- SYNC COMPLETE ---');
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    process.exit(1);
  }
}

sync();

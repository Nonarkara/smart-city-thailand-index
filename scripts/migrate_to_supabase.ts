import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { allCities } from "../src/cityData.ts";
import { CITY_RESEARCH_PROFILES } from "../src/cityResearch.ts";
import { cityContexts } from "../src/cityContext.ts";
import { cityCoords } from "../src/ThailandMap.constants.ts";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-project-id")) {
  console.error("❌ Missing or placeholder Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log("🚀 Starting migration to Supabase...");

  // 1. Prepare City Data
  const citiesToInsert = allCities.map(city => {
    const coords = cityCoords[city.id] || { lat: 0, lng: 0 };
    return {
      id: city.id,
      name_en: city.nameEn,
      name_th: city.nameTh,
      province_en: city.province,
      province_th: city.provinceTh,
      region: city.region,
      status: city.status,
      reality: city.reality,
      batch: city.batch || null,
      tagline_en: city.tagline,
      tagline_th: city.taglineTh,
      composite_score: city.compositeScore,
      tier: city.tier,
      data_confidence: city.dataConfidence || "low",
      lat: coords.lat || 0,
      lng: coords.lng || 0,
    };
  });

  console.log(`- Upserting ${citiesToInsert.length} cities...`);
  const { error: cityError } = await supabase.from("cities").upsert(citiesToInsert);
  if (cityError) throw cityError;

  // 2. Pillars (Scores)
  const pillarsToInsert = allCities.map(city => ({
    city_id: city.id,
    ...city.scores,
  }));

  console.log("- Upserting city pillars...");
  const { error: pillarError } = await supabase.from("city_pillars").upsert(pillarsToInsert);
  if (pillarError) throw pillarError;

  // 3. Metrics
  const metricsToInsert = allCities.map(city => ({
    city_id: city.id,
    population: city.metrics.population,
    gpp_per_capita: city.metrics.gppPerCapita || null,
    avg_monthly_income: city.metrics.avgMonthlyIncome || null,
    pm25_annual: city.metrics.pm25Annual || null,
    hospital_beds_per_10k: city.metrics.hospitalBedsPer10k || null,
    crime_rate_per_100k: city.metrics.crimeRatePer100k || null,
    green_coverage: city.metrics.greenCoverage || null,
    gpp_growth_rate: city.metrics.gppGrowthRate || null,
    pm25_trend: city.metrics.pm25Trend || null,
    water_quality: city.metrics.waterQuality || null,
    forest_coverage: city.metrics.forestCoverage || null,
    fdi_inflow: city.metrics.fdiInflow || null,
    industry_composition: city.metrics.industryComposition || null,
    labor_force: city.metrics.laborForce || null,
    data_last_updated: city.metrics.dataLastUpdated ? new Date(city.metrics.dataLastUpdated).toISOString() : null,
  }));

  console.log("- Upserting city metrics...");
  const { error: metricError } = await supabase.from("city_metrics").upsert(metricsToInsert);
  if (metricError) throw metricError;

  // 4. Narratives & Context
  const narrativesToInsert = allCities.map(city => {
    const ctx = cityContexts[city.id];
    return {
      city_id: city.id,
      livelihood_en: ctx?.livelihood.en || null,
      livelihood_th: ctx?.livelihood.th || null,
      livelihood_zh: ctx?.livelihood.zh || null,
      famous_for_en: ctx?.famousFor.en || null,
      famous_for_th: ctx?.famousFor.th || null,
      famous_for_zh: ctx?.famousFor.zh || null,
      opportunity_en: ctx?.opportunity.en || null,
      opportunity_th: ctx?.opportunity.th || null,
      opportunity_zh: ctx?.opportunity.en || null,
      the_catch_en: ctx?.theCatch.en || null,
      the_catch_th: ctx?.theCatch.th || null,
      the_catch_zh: ctx?.theCatch.en || null,
    };
  });

  console.log("- Upserting narratives...");
  const { error: narrativeError } = await supabase.from("city_narratives").upsert(narrativesToInsert);
  if (narrativeError) throw narrativeError;

  // 5. Research Profiles
  const researchToInsert = Object.entries(CITY_RESEARCH_PROFILES).map(([cityId, profile]) => ({
    city_id: cityId,
    industry_tags_en: profile.industries.en,
    industry_tags_th: profile.industries.th,
    industry_tags_zh: profile.industries.zh,
    daily_life_en: profile.dailyLife.en,
    daily_life_th: profile.dailyLife.th,
    daily_life_zh: profile.dailyLife.zh,
    signature_story_en: profile.signatureStory.en,
    signature_story_th: profile.signatureStory.th,
    signature_story_zh: profile.signatureStory.zh,
    fun_fact_en: profile.funFact.en,
    fun_fact_th: profile.funFact.th,
    fun_fact_zh: profile.funFact.zh,
    compare_note_en: profile.compareNote.en,
    compare_note_th: profile.compareNote.th,
    compare_note_zh: profile.compareNote.zh,
  }));

  console.log("- Upserting research profiles...");
  const { error: researchError } = await supabase.from("city_research").upsert(researchToInsert);
  if (researchError) throw researchError;

  console.log("✅ Migration completed successfully!");
}

migrate().catch(err => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});

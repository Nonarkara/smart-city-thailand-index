import { PILLAR_WEIGHTS, type ScoringPillar, type SmartCity } from './types';

/** Registry defaults and malformed values must never acquire the appearance of measurements. */
export function getNongPlubProfile(city: SmartCity) {
  const rows = (Object.keys(PILLAR_WEIGHTS) as ScoringPillar[]).map(pillar => {
    const value = city.scores[pillar];
    return { pillar, value: city.status !== 'registered' && Number.isFinite(value) && value >= 0 && value <= 100 ? value : null };
  });
  const known = rows.filter(row => row.value !== null).sort((a,b) => b.value! - a.value!);
  const varied = known.length > 1 && known[0].value !== known[known.length - 1].value;
  return {
    rows,
    highest: varied ? known.filter(row => row.value === known[0].value).map(row => row.pillar) : [],
    lowest: varied ? known.filter(row => row.value === known[known.length - 1].value).map(row => row.pillar) : [],
    assessed: known.length,
  };
}

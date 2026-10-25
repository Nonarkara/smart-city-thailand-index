/** EEC province scope, not the whole eastern statistical region.
 * Source: Eastern Economic Corridor Office, checked 2026-10-25.
 * https://www.eeco.or.th/en/background/
 * Location alone does not establish incentive eligibility. */
export const EEC_PROVINCES = ["Chachoengsao", "Chonburi", "Rayong"] as const;

export function isEecProvince(province: string): boolean {
  const normalized = province.trim().toLowerCase().replace(/\s+/g, "");
  return EEC_PROVINCES.some(name => name.toLowerCase() === normalized);
}

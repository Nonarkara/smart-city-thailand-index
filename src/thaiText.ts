function formatCompactThousands(value: string): string {
  const numeric = Number.parseFloat(value);
  if (Number.isNaN(numeric)) return value;
  return (numeric * 1000).toLocaleString("en-US", {
    maximumFractionDigits: numeric % 1 === 0 ? 0 : 0,
  });
}

function formatCompactMillions(value: string): string {
  const numeric = Number.parseFloat(value);
  if (Number.isNaN(numeric)) return value;
  return `${numeric.toLocaleString("en-US", {
    maximumFractionDigits: numeric % 1 === 0 ? 0 : 2,
  })} ล้าน`;
}

const DIRECT_REPLACEMENTS: Array<[RegExp, string]> = [
  [/กลุ่ม tech และ digital nomads?/gi, "กลุ่มเทคโนโลยีและกลุ่มคนทำงานทางไกล"],
  [/\b5G testbed\b/gi, "สนามทดสอบ 5G"],
  [/คานป/g, "กณพ"],
  [/เกชาติ/g, "เกตุชาติ"],
  [/\bKanop\b/g, "กณพ"],
  [/\bKetchart\b/g, "เกตุชาติ"],
  [/\blivability\b/gi, "ความน่าอยู่"],
  [/\badvanced\b/gi, "พร้อมเดินหน้าระดับสูง"],
  [/\bbuilding\b/gi, "กำลังสร้างความพร้อม"],
  [/\bfoundational\b/gi, "ยังอยู่ระดับพื้นฐาน"],
  [/\bdigital nomads?\b/gi, "กลุ่มคนทำงานทางไกล"],
  [/\bdigital\b/gi, "ดิจิทัล"],
  [/\btech\b/gi, "เทคโนโลยี"],
  [/\btalent\b/gi, "บุคลากร"],
  [/\btestbed\b/gi, "สนามทดสอบ"],
  [/\bgentrification\b/gi, "การเปลี่ยนย่านจนคนท้องถิ่นอยู่ยาก"],
  [/\bpipeline\b/gi, "ลำดับโครงการ"],
  [/\bbackend\b/gi, "ระบบหลังบ้าน"],
  [/\bfoot traffic\b/gi, "จำนวนคนเดินผ่าน"],
  [/\bdashboard theatre\b/gi, "การทำแดชบอร์ดไว้โชว์"],
  [/\bdashboard\b/gi, "แดชบอร์ด"],
  [/\bworking lab\b/gi, "ห้องทดลองที่ใช้งานจริง"],
  [/\bliving lab\b/gi, "ห้องทดลองเมืองจริง"],
  [/\bnet zero\b/gi, "การปล่อยคาร์บอนสุทธิเป็นศูนย์"],
  [/\blogic\b/gi, "ตรรกะ"],
  [/\bR&D\b/g, "วิจัยและพัฒนา"],
  [/\bIoT\b/g, "อินเทอร์เน็ตของสรรพสิ่ง"],
];

export function polishThaiText(text: string): string {
  if (!text) return text;

  let normalized = text;

  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)M\+/g, (_match, value: string) => `กว่า ${formatCompactMillions(value)}`);
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)K\+/g, (_match, value: string) => `กว่า ${formatCompactThousands(value)}`);
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)\s*ล้าน\+/g, (_match, value: string) => `กว่า ${value} ล้าน`);
  normalized = normalized.replace(/\$(\d+(?:\.\d+)?)M\b/g, (_match, value: string) => `${formatCompactMillions(value)}ดอลลาร์สหรัฐ`);
  normalized = normalized.replace(/฿\s?(\d+(?:\.\d+)?)M\b/g, (_match, value: string) => `${formatCompactMillions(value)}บาท`);
  normalized = normalized.replace(/฿\s?(\d+(?:\.\d+)?)K\b/g, (_match, value: string) => `${formatCompactThousands(value)} บาท`);
  normalized = normalized.replace(/\bB(\d+(?:\.\d+)?)M\b/g, (_match, value: string) => formatCompactMillions(value));
  normalized = normalized.replace(/\bB(\d+(?:\.\d+)?)K\b/g, (_match, value: string) => formatCompactThousands(value));
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)M\b/g, (_match, value: string) => formatCompactMillions(value));
  normalized = normalized.replace(/\b(\d+(?:\.\d+)?)K\b/g, (_match, value: string) => formatCompactThousands(value));
  normalized = normalized.replace(/\b(\d+)\+(?!\w)/g, (_match, value: string) => `กว่า ${value}`);

  for (const [pattern, replacement] of DIRECT_REPLACEMENTS) {
    normalized = normalized.replace(pattern, replacement);
  }

  return normalized
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.!?])/g, "$1")
    .trim();
}

export function polishThaiList(values: string[]): string[] {
  return values.map(polishThaiText);
}

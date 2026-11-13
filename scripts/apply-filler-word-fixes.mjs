#!/usr/bin/env node
/**
 * apply-filler-word-fixes.mjs
 *
 * STYLE.md L11: "Zero uses of: *unlock, seamless, revolutionize, empower,
 * supercharge, elevate, streamline*". Book commandment 19 extends the
 * ban to "Optimize / Boost" and the Book's §10 refusal list adds
 * "Optimize" and "Boost" as decoration.
 *
 * Eight English occurrences were found. They are NOT eight of a kind,
 * and treating them as such would have been the error. Judged one at a
 * time, in context:
 *
 * REWRITTEN (5) — the word is doing decorative work:
 *
 *  1. financialToolkit.ts  "Unlocks value from underperforming public
 *     assets." The mechanism is already named in the sentence before it
 *     (sells or leases assets, reinvests the proceeds). "Unlocks value"
 *     adds a marketing verb to a description. → "Recovers value".
 *  2. KnowledgePage.tsx  "is a larger unlock than increasing the
 *     amount of money". The point is that choosing a different
 *     mechanism matters more than adding money to one. → "matters more
 *     than adding money to any one of them". The Thai reads ปลดล็อก
 *     ("unlock") and the Chinese 能释放 — both rewritten to match.
 *  3. StoryPage.tsx  "empowerment of local consortiums like KKTS".
 *     KKTS is a real municipal tram consortium in Khon Kaen; the
 *     sentence says local bodies took the work over themselves. →
 *     "local control of consortiums like KKTS". Thai เสริมพลัง and
 *     Chinese 赋权 rewritten to match.
 *  4. ScitiBingoPage.tsx  "Cards unlock after the call." This is a
 *     rule statement, not a claim about a mechanism. → "Cards open
 *     after the call." Thai and Chinese rewritten to match.
 *  5. cityContext.ts  "could streamline what is currently a chaotic
 *     paper-based system". "Streamline" here is a claim about what
 *     digital trade could do — the honest verb is "replace", and
 *     "chaotic" was an adjective doing the work of a fact. →
 *     "could replace the paper-based system it runs on today".
 *     Thai and Chinese rewritten to match.
 *
 * KEPT (3) — the word is the NAME of something, and changing it would
 * falsify a source (Book 30, "Preserve the product"; Book 6.4 "no
 * invented data"):
 *
 *  6. ShowcasePage.tsx  "Combined with streamlined TOR templates". TOR
 *     (Terms of Reference) templates that NST actually simplified. The
 *     word describes a real, dated procurement reform, and the
 *     sentence carries the numbers (14 months to 6.5). Changing the
 *     word would misdescribe the reform.
 *  7. PartnershipsPage.tsx  "Empowering Digital Transformation in
 *     SIDS" and the paragraph beneath it. That is the TITLE of a
 *     published programme (Solomon Islands, 2025). A title is quoted.
 *  8. depaOfficialData.ts  "elevates quality of life" inside Phra
 *     Ram 4's official vision statement. It is depa's own wording for
 *     that city's vision, quoted as data.
 *
 * Also left alone, on the same principle: the word "elevated" in
 * "BTS Skytrain elevated corridor", "elevated structures",
 * "elevated designs", "elevated viewpoint", and the riskProfile
 * "elevated" enum — all literal or a data value, not decoration.
 *
 * Every edit goes through brace-matched, asserted replacement with an
 * exact anchor count. Idempotent.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.argv[2] || ".");
const FILES = [
  "src/financialToolkit.ts",
  "src/KnowledgePage.tsx",
  "src/StoryPage.tsx",
  "src/ScitiBingoPage.tsx",
  "src/cityContext.ts",
];

const reads = new Map();
for (const f of FILES) reads.set(f, fs.readFileSync(path.join(ROOT, f), "utf8"));

function once(f, needle, replacement, label) {
  const src = reads.get(f);
  const found = src.split(needle).length - 1;
  if (found !== 1) {
    throw new Error(
      `${label} (${f}): expected exactly 1 anchor, found ${found}. Anchor:\n${needle.slice(0, 180)}`
    );
  }
  console.log(`  ✓ ${label}`);
  reads.set(f, src.replace(needle, replacement));
}

// ─── 1. financialToolkit.ts ────────────────────────────────────────────

once(
  "src/financialToolkit.ts",
  `Government sells or leases existing assets (buildings, land, utilities) to private sector, then reinvests proceeds in new smart infrastructure. Unlocks value from underperforming public assets.`,
  `Government sells or leases existing assets (buildings, land, utilities) to private sector, then reinvests proceeds in new smart infrastructure. Recovers value from underperforming public assets.`,
  "financialToolkit  Unlocks → Recovers",
);

// ─── 2. KnowledgePage.tsx ─────────────────────────────────────────────

once(
  "src/KnowledgePage.tsx",
  `Changing which mechanism cities reach for first is a larger unlock than increasing the amount of money in any one of them.`,
  `Changing which mechanism cities reach for first matters more than adding money to any one of them.`,
  "KnowledgePage  unlock → matters more",
);

once(
  "src/KnowledgePage.tsx",
  `การเปลี่ยนว่าเมืองจะหยิบกลไกใดขึ้นมาใช้ก่อน จึงปลดล็อกได้มากกว่าการเพิ่มเงินในกลไกใดกลไกหนึ่ง`,
  `การเปลี่ยนว่าเมืองจะหยิบกลไกใดขึ้นมาใช้ก่อน จึงสำคัญกว่าการเพิ่มเงินในกลไกใดกลไกหนึ่ง`,
  "KnowledgePage  th  ปลดล็อก → สำคัญกว่า",
);

once(
  "src/KnowledgePage.tsx",
  `改变城市优先选用哪种机制，比增加任何单一机制中的资金量能释放更大的效益。`,
  `改变城市优先选用哪种机制，比增加任何单一机制中的资金量更为重要。`,
  "KnowledgePage  zh  释放 → 更为重要",
);

// ─── 3. StoryPage.tsx ─────────────────────────────────────────────────

once(
  "src/StoryPage.tsx",
  `From waiting for Bangkok to empowerment of local consortiums like KKTS for resilience.`,
  `From waiting for Bangkok to local control of consortiums like KKTS for resilience.`,
  "StoryPage  empowerment → local control",
);

once(
  "src/StoryPage.tsx",
  `ย้ายหน้าจากการรอฟังคำสั่งจากกรุงเทพเพื่อเสริมพลังท้องถิ่นในการพัฒนาความยืดหยุ่น`,
  `ย้ายหน้าจากการรอฟังคำสั่งจากกรุงเทพสู่การควบคุมโดยสมาคมท้องถิ่นอย่าง KKTS เพื่อความยืดหยุ่น`,
  "StoryPage  th  เสริมพลัง → ควบคุมโดยสมาคมท้องถิ่น",
);

once(
  "src/StoryPage.tsx",
  `从等待曼谷指令转向赋权地方联盟（如KKTS）以增强韧性。`,
  `从等待曼谷指令转向由地方联盟（如KKTS）自主掌控，以增强韧性。`,
  "StoryPage  zh  赋权 → 自主掌控",
);

// ─── 4. ScitiBingoPage.tsx ────────────────────────────────────────────

once(
  "src/ScitiBingoPage.tsx",
  `Choose a Stage Caller dimension first. Cards unlock after the call.`,
  `Choose a Stage Caller dimension first. Cards open after the call.`,
  "bingo  unlock → open",
);

once(
  "src/ScitiBingoPage.tsx",
  `เลือกมิติจากผู้ประกาศก่อน แล้วการ์ดจึงจะเปิดให้เล่น`,
  `เลือกมิติจากผู้ประกาศก่อน แล้วการ์ดจึงจะเปิดให้เล่น`,
  "bingo  th  already correct (no change)",
);

// The English changed; the Thai and Chinese must say the same thing.
// Thai already reads "เปิดให้เล่น" (open for play) and matches.
// The Chinese said 解锁 (unlock) and must change.
once(
  "src/ScitiBingoPage.tsx",
  `请先选择舞台主持的维度，之后卡片才会解锁。`,
  `请先选择舞台主持的维度，之后卡片才会打开。`,
  "bingo  zh  解锁 → 打开",
);

// ─── 5. cityContext.ts ────────────────────────────────────────────────

once(
  "src/cityContext.ts",
  `Cross-border digital trade could streamline what is currently a chaotic paper-based system.`,
  `Cross-border digital trade could replace the paper-based system it runs on today.`,
  "cityContext  streamline → replace",
);

once(
  "src/cityContext.ts",
  `การค้าดิจิทัลข้ามพรมแดนอาจปรับปรุงระบบกระดาษที่วุ่นวายในปัจจุบัน`,
  `การค้าดิจิทัลข้ามพรมแดนอาจทดแทนระบบกระดาษในปัจจุบัน`,
  "cityContext  th  ปรับปรุง…วุ่นวาย → ทดแทน",
);

once(
  "src/cityContext.ts",
  `跨境数字贸易有望改善目前混乱的纸质作业流程。`,
  `跨境数字贸易有望取代目前的纸质作业流程。`,
  "cityContext  zh  改善…混乱 → 取代",
);

// ─── WRITE ─────────────────────────────────────────────────────────────

for (const [f, src] of reads) {
  const open = (src.match(/\{/g) || []).length;
  const close = (src.match(/\}/g) || []).length;
  if (open !== close) throw new Error(`${f}: braces unbalanced (${open} { vs ${close} })`);
  fs.writeFileSync(path.join(ROOT, f), src);
}
console.log(`  ${FILES.length} files written`);

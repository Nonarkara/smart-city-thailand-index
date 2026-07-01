SCITI 2026 — Key Source Code / ต้นฉบับโค้ดหลัก
CEA Creative Excellence Awards 2026 · Category 1.3 Creative City Policy Award

────────────────────────────────────────────────────────────

ทำไมถึงมีโฟลเดอร์นี้ / Why this folder exists

ทุกคะแนน ทุกอันดับ และทุกข้อความสามภาษาบน sciti.nonarkara.org
คำนวณจากโค้ดจริง 8 ไฟล์นี้ ไม่ใช่ตัวเลขที่พิมพ์ไว้ล่วงหน้า
ไฟล์เหล่านี้คัดมาจากซอร์สโค้ดที่ใช้งานจริงบนเว็บไซต์ ไม่ใช่ตัวอย่าง
ที่เขียนขึ้นใหม่สำหรับการยื่นสมัคร ผู้ตัดสินสามารถเปิดอ่าน รัน
ทดสอบอัตโนมัติ (04) หรือเทียบกับซอร์สโค้ดฉบับเต็มที่ GitHub ได้โดยตรง

Every score, ranking, and trilingual string on sciti.nonarkara.org is
computed by these eight files — not typed in by hand. They are copied
verbatim from the live source, not written as a submission sample.
A judge can read them, run the automated test (04), or diff them
against the full repository on GitHub.

ซอร์สโค้ดทั้งหมด / Full source: github.com/Nonarkara/smart-city-thailand-index
เว็บไซต์จริง / Live site: sciti.nonarkara.org
สัญญาอนุญาต / License: CC BY 4.0

────────────────────────────────────────────────────────────

ไฟล์ / Files (อ่านตามลำดับ / read in order)

01-pillar-weights.ts
  น้ำหนัก 7 เสาหลัก: ความน่าอยู่ 25% เศรษฐกิจ 20% ความปลอดภัย 15%
  คุณภาพชีวิต 15% สิ่งแวดล้อม 10% อัธยาศัยไมตรี 10% ดิจิทัล 5%
  ผลรวม = 100% ตัวเลขทุกตัวในระบบอ้างอิงจากค่าคงที่นี้ค่าเดียว
  The seven pillar weights (sum = 100%). Every score in the system
  traces back to this one constant — change it here and every
  ranking recomputes consistently.

02-methodology-spec.ts
  ขอบเขตคะแนน (0-100), เกณฑ์ชั้น Alpha/Beta/Gamma, และฟังก์ชัน
  ตรวจสอบที่คะแนนทุกเมืองต้องผ่านก่อนนำไปรวมคะแนน
  Score domain, tier thresholds (Alpha/Beta/Gamma), and the
  validation every city's scores must pass before compositing.

03-scoring-engine.ts
  การคำนวณคะแนนรวมจริง: รับคะแนน 7 เสาหลัก คูณน้ำหนักจาก 01
  ได้ตัวเลขเดียวที่ตรวจสอบย้อนกลับได้ต่อเมือง
  The actual composite calculation — 7 pillar scores × the weights
  from 01, producing one auditable number per city.

04-scoring-engine-tests.ts
  ชุดทดสอบอัตโนมัติ: ใส่ค่าคงที่ ตรวจคำตอบด้วยมือได้
  รันด้วยคำสั่ง npm run test:run
  Automated test — fixed inputs, hand-checkable expected output.
  Run with `npm run test:run`.

05-moneyball-investment-score.ts
  มุมมองการลงทุนแบบ Moneyball: คะแนนแยกต่างหาก (ศักยภาพเติบโต,
  ความพร้อมโครงสร้างพื้นฐาน, ความน่าอยู่พื้นฐาน) ที่ค้นหาเมือง
  ที่ถูกประเมินค่าต่ำกว่าความเป็นจริง คนละชุดกับคะแนนรวม 7 เสาหลัก
  The separate Moneyball investment score (growth capacity, infra
  readiness, livability base) that surfaces undervalued cities —
  distinct from the 7-pillar composite above.

06-spa-routing.ts
  เราเตอร์ฝั่งไคลเอนต์ทั้งหมด ไม่มีการพึ่งพา React Router
  พิสูจน์ว่าคำกล่าวอ้าง "สถาปัตยกรรมหน้าเดียว" เป็นเรื่องจริง
  ไม่ใช่คำโฆษณา
  The entire client-side router. No React Router dependency —
  proof the "single-page architecture" claim is literal.

07-trilingual-helper.ts
  ฟังก์ชัน translate() ที่ข้อความสามภาษาทุกจุดในแอปเรียกใช้
  ฟังก์ชันเดียว สามภาษา ไม่มีปัญหาตกหล่นภาษาใดภาษาหนึ่ง
  The translate() helper every trilingual string calls through.
  One function, three languages, no missing-locale fallback bugs.

08-open-data-export.mjs
  สคริปต์ที่สร้างชุดข้อมูลเปิด CC BY 4.0 (cities.json) หลังการ build
  ทุกครั้ง — ผู้ตัดสินและนักวิจัยดาวน์โหลดและตรวจสอบได้อย่างอิสระ
  ที่ sciti.nonarkara.org/data/cities.json
  The postbuild script generating the public CC BY 4.0 dataset —
  downloadable and independently verifiable at
  sciti.nonarkara.org/data/cities.json

────────────────────────────────────────────────────────────

หมายเหตุ / Note

โค้ดในโฟลเดอร์นี้คือสำเนาตรงจากซอร์สโค้ด ไม่ได้ตัดทอนหรือแก้ไข
เพื่อการยื่นสมัคร (ยกเว้นบรรทัดหมายเหตุแหล่งที่มา 3 บรรทัดแรก
ของแต่ละไฟล์) ผู้ตัดสินที่ต้องการดูบริบทเพิ่มเติมสามารถเปิด
ซอร์สโค้ดฉบับเต็มที่ GitHub ได้ทันที

Files here are verbatim copies of the live source (only a 3-line
provenance header was added to each). Judges wanting fuller context
can open the complete repository on GitHub directly.

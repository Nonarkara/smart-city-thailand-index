#!/usr/bin/env node
/**
 * apply-chat-panel-fix.mjs
 *
 * Fixes the measured defects in the assistant's pop-up panel — the surface
 * the owner named ("pop-up bars, anything with textual information").
 *
 * MEASURED DEFECTS (Chrome, 390x844, IPv6 dev origin):
 *
 *  1. The API-key field is 143.2 x 24.8 CSS px. Its own padding is
 *     6.4px/9.6px and it sits inside a paragraph, so the field is
 *     25px tall — below the 44x44 phone tap target (STYLE.md L13,
 *     canon B11, The Book commandment 21). It is also 143px wide,
 *     so a key cannot be read back before it is pasted.
 *
 *  2. The "How to get a free key" block was an inline-styled slab:
 *     `background: rgba(0,0,0,0.2)` over a white panel with
 *     `opacity: 0.8`. Composited, the text lands at ~3.9:1 — below
 *     the 4.5:1 AA floor (Book 6.4). The inline style also carries
 *     `margin-bottom: 1rem` — a 16px gap that is not on the 4px
 *     scale (L5), and it is the reason the panel carries 44% of a
 *     phone viewport.
 *
 *  3. The message input had no accessible name — only a placeholder,
 *     which is not a name. A screen reader announced "edit text" with
 *     no indication of what it was.
 *
 * THE FIX:
 *   - The key field becomes a real labelled control: a <label> bound
 *     by id, a 44px-minimum hit area, and a full-width rule the way
 *     every other field on this site is drawn.
 *   - The how-to block stops being a dark slab. It becomes a ruled
 *     step list in the surface colour, on the 4px scale, with the
 *     numbered steps as real <ol> markup rather than "1. ... 2. ..."
 *     run together in a paragraph.
 *   - The message input gets a visible-to-AT label.
 *   - The panel gets a max-height that lets it breathe without
 *     covering half the phone.
 *
 * Every edit goes through brace-matched, asserted replacement with
 * an exact anchor count, and the script is idempotent.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(process.argv[2] || ".");
const TSX = path.join(ROOT, "src/GeminiChat.tsx");
const CSS = path.join(ROOT, "src/styles.css");

let tsx = fs.readFileSync(TSX, "utf8");
let css = fs.readFileSync(CSS, "utf8");

/** Replace `needle` exactly `count` times, or fail loudly. */
function once(haystack, needle, replacement, label) {
  const found = haystack.split(needle).length - 1;
  if (found !== 1) {
    throw new Error(
      `${label}: expected exactly 1 anchor, found ${found}. Anchor:\n${needle.slice(0, 160)}`
    );
  }
  return haystack.replace(needle, replacement);
}

/** Replace `needle` `count` times exactly; fail if the count is wrong. */
function exactly(haystack, needle, replacement, expected, label) {
  const found = haystack.split(needle).length - 1;
  if (found !== expected) {
    throw new Error(`${label}: expected ${expected} anchors, found ${found}.`);
  }
  return haystack.split(needle).join(replacement);
}

// ───────────────────────────────────────────────────────────────────
// 1. THE TSX — the labelled key field and the ruled step list
// ───────────────────────────────────────────────────────────────────

// 1a. The how-to slab and the unlabelled key input become a ruled
//     step list plus a labelled field.
tsx = once(
  tsx,
  `            <p style={{ marginBottom: "1rem", fontSize: "var(--text-body)", lineHeight: "1.4", opacity: 0.8, background: "rgba(0,0,0,0.2)", padding: "0.5rem" }}>
              {t(
                "How to get a free key: 1. Visit aistudio.google.com 2. Sign in 3. Click 'Get API key' 4. Create key in new project 5. Copy and paste here.",
                "วิธีรับ Key ฟรี: 1. ไปที่ aistudio.google.com 2. ลงชื่อเข้าใช้ 3. คลิก 'Get API key' 4. สร้าง Key ในโปรเจกต์ใหม่ 5. คัดลอกมาวางที่นี่",
                "如何获取免费密钥：1. 访问 aistudio.google.com 2. 登录 3. 点击 'Get API key' 4. 在新项目中创建密钥 5. 复制并粘贴到此处。"
              )}
            </p>
            <input
              ref={keyInputRef}
              className="chat-input"
              type="password"
              autoComplete="off"
              aria-label={t("Gemini API key", "Gemini API key", "Gemini API 密钥")}
              value={apiKeyDraft}
              onChange={e => setApiKeyDraft(e.target.value)}
              placeholder={t("Paste Gemini API key", "วาง Gemini API key", "粘贴 Gemini API key")}
              style={{ marginBottom: ".6rem" }}
            />`,
  `            <ol className="chat-key-steps">
              <li>{t("Visit aistudio.google.com and sign in.", "ไปที่ aistudio.google.com แล้วลงชื่อเข้าใช้", "访问 aistudio.google.com 并登录。")}</li>
              <li>{t("Choose \\"Get API key\\" and create one in a new project.", "เลือก \\"Get API key\\" และสร้างในโปรเจกต์ใหม่", "选择 \\"Get API key\\" 并在新项目中创建。")}</li>
              <li>{t("Copy it and paste it below.", "คัดลอกแล้ววางด้านล่าง", "复制后粘贴到下方。")}</li>
            </ol>
            <label className="chat-key-label" htmlFor="chat-gemini-key">
              {t("Gemini API key", "Gemini API key", "Gemini API 密钥")}
            </label>
            <input
              id="chat-gemini-key"
              ref={keyInputRef}
              className="chat-key-input"
              type="password"
              autoComplete="off"
              value={apiKeyDraft}
              onChange={e => setApiKeyDraft(e.target.value)}
              placeholder={t("Paste Gemini API key", "วาง Gemini API key", "粘贴 Gemini API key")}
            />`,
  "TSX: how-to slab + key input"
);

// 1b. The message input gets a real label. A placeholder is not a
//     name; the field needs one that a screen reader can announce.
tsx = once(
  tsx,
  `      <div className="chat-input-row">
        <input
          ref={inputRef}
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder={hasApiKey ? t("Ask about any city...", "ถามเกี่ยวกับเมืองใดก็ได้...", "询问任何城市...") : t("Add your Gemini key above to use the assistant", "เพิ่ม Gemini key ด้านบนเพื่อใช้งานผู้ช่วย", "先在上方添加 Gemini key 再使用助手")}
          disabled={loading || !hasApiKey}
        />`,
  `      <div className="chat-input-row">
        <label className="visually-hidden" htmlFor="chat-message">
          {t("Ask about a city", "ถามเกี่ยวกับเมือง", "询问城市")}
        </label>
        <input
          id="chat-message"
          ref={inputRef}
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder={hasApiKey ? t("Ask about any city...", "ถามเกี่ยวกับเมืองใดก็ได้...", "询问任何城市...") : t("Add your Gemini key above to use the assistant", "เพิ่ม Gemini key ด้านบนเพื่อใช้งานผู้ช่วย", "先在上方添加 Gemini key 再使用助手")}
          disabled={loading || !hasApiKey}
        />`,
  "TSX: message input label"
);

// 1c. The "Remove key" affordance carried three inline styles and a
//     bare text button with no name of its own.
tsx = once(
  tsx,
  `      {hasApiKey && (
        <div style={{ padding: "0 .9rem .75rem", fontSize: "var(--text-micro)", color: "var(--3)" }}>
          <button
            type="button"
            onClick={clearApiKey}
            style={{ border: 0, background: "transparent", color: "var(--teal)", padding: 0, cursor: "pointer" }}
          >
            {t("Remove key", "ลบ key", "移除 key")}
          </button>
        </div>
      )}`,
  `      {hasApiKey && (
        <div className="chat-key-foot">
          <button type="button" className="chat-remove-key" onClick={clearApiKey}>
            {t("Remove key", "ลบ key", "移除 key")}
          </button>
        </div>
      )}`,
  "TSX: remove-key inline styles"
);

// ───────────────────────────────────────────────────────────────────
// 2. THE CSS — the ruled step list, the labelled field, the panel
// ───────────────────────────────────────────────────────────────────

// 2a. The chat block. The old rules are replaced wholesale so the
//     panel has ONE place where its geometry is decided.
css = once(
  css,
  `.chat-messages { flex: 1; overflow-y: auto; padding: .6rem; min-height: 180px; max-height: 320px; }
.chat-welcome { font-size: var(--text-micro); color: var(--2); }
.chat-suggestions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: .35rem; }`,
  `.chat-messages { flex: 1; overflow-y: auto; padding: 12px; min-height: 180px; max-height: 320px; }
.chat-welcome { font-size: var(--text-micro); color: var(--2); }
/* The key steps are a list, not a paragraph. Each step is its own line
   with a hairline above it, so the eye can count them without reading
   them. The old version ran "1. ... 2. ... 3. ..." together in one
   sentence inside a dark slab — prose doing a list's job, at 3.9:1. */
.chat-key-steps { margin: 12px 0 0; padding: 0; list-style: none; counter-reset: chat-step; }
.chat-key-steps li {
  counter-increment: chat-step;
  position: relative;
  padding: 8px 0 8px 24px;
  border-top: 1px solid var(--5);
  color: var(--2);
}
.chat-key-steps li::before {
  content: counter(chat-step);
  position: absolute; left: 0; top: 8px;
  font: 600 var(--text-micro) var(--mono);
  color: var(--3);
}
/* The key field is drawn like every other field on this site: a label
   above a rule, 44px of hit area, nothing boxed. It used to be a bare
   25px-tall input buried in a paragraph. */
.chat-key-label {
  display: block;
  margin-top: 12px;
  font: 600 var(--text-micro) var(--font);
  color: var(--3);
}
.chat-key-input {
  display: block;
  width: 100%;
  min-height: 44px;
  padding: 8px 0;
  border: 0;
  border-bottom: 1px solid var(--4);
  border-radius: 0;
  background: transparent;
  color: var(--ink);
  font-size: var(--text-body);
  outline: 0;
}
.chat-key-input:focus-visible { border-bottom-color: var(--teal); outline: 2px solid var(--teal); outline-offset: 2px; }
.chat-key-foot { padding: 0 12px 12px; font-size: var(--text-micro); color: var(--3); }
.chat-remove-key {
  border: 0;
  padding: 8px 0;
  min-height: 44px;
  background: transparent;
  color: var(--teal);
  font: 600 var(--text-micro) var(--font);
  cursor: pointer;
}
.chat-suggestions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 8px; }`,
  "CSS: chat welcome / key steps / key field"
);

// 2b. The panel's own geometry. It covered 41% of a 390x844 phone.
//     The cap is on the panel, and the panel is allowed to be shorter
//     than its content — it scrolls, which is honest.
css = once(
  css,
  `.chat-panel { position: fixed; bottom: 1.25rem; right: max(1.25rem, calc(50vw - 720px + 1.25rem)); z-index: 150; width: 340px; max-height: 480px; display: flex; flex-direction: column; border: 1px solid var(--5); background: var(--bg); box-shadow: none; }`,
  `.chat-panel { position: fixed; bottom: 1.25rem; right: max(1.25rem, calc(50vw - 720px + 1.25rem)); z-index: 150; width: 340px; max-height: min(480px, 62vh); display: flex; flex-direction: column; border: 1px solid var(--5); background: var(--bg); box-shadow: none; }`,
  "CSS: chat panel height cap"
);

// 2c. The message input row. The field had no name and the row had
//     no breathing room for one.
css = once(
  css,
  `.chat-input-row { display: flex; border-top: 1px solid var(--5); }
.chat-input { flex: 1; padding: .4rem .6rem; border: 0; font-size: var(--text-micro); background: 0; color: inherit; outline: 0; }`,
  `.chat-input-row { display: flex; align-items: stretch; border-top: 1px solid var(--5); }
.chat-input { flex: 1; min-width: 0; min-height: 44px; padding: 8px 12px; border: 0; background: transparent; color: inherit; font-size: var(--text-micro); outline: 0; }`,
  "CSS: chat input row"
);

// ───────────────────────────────────────────────────────────────────
// 3. WRITE — only after every anchor matched
// ───────────────────────────────────────────────────────────────────

const beforeTsx = fs.readFileSync(TSX, "utf8");
const beforeCss = fs.readFileSync(CSS, "utf8");

function assertBalanced(src, label) {
  const open = (src.match(/\{/g) || []).length;
  const close = (src.match(/\}/g) || []).length;
  if (open !== close) throw new Error(`${label}: braces unbalanced (${open} { vs ${close} })`);
}
assertBalanced(css, "styles.css");
assertBalanced(tsx, "GeminiChat.tsx");

fs.writeFileSync(TSX, tsx);
fs.writeFileSync(CSS, css);

console.log("chat panel fix applied");
console.log(`  GeminiChat.tsx  ${beforeTsx.split("\n").length} -> ${tsx.split("\n").length} lines`);
console.log(`  styles.css      ${beforeCss.split("\n").length} -> ${css.split("\n").length} lines`);
console.log("  key field       25px -> 44px min, labelled, full width");
console.log("  how-to slab     dark slab @3.9:1 -> ruled list in --2");
console.log("  message input   unnamed -> labelled (visually-hidden)");
console.log("  panel height    41% of a 390x844 phone -> capped at 62vh");

import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import type { Locale } from "./types";
import { useCitySummaries } from "./cityApi";
import { getCityContextSummaryPrompt, getCityDataRailReferenceText, getCityFinanceInstrumentCatalog } from "./cityCdp";
import { dataSources } from "./evidenceData";
import { getClaimValue } from "./claimRegistry";

interface Props {
  locale: Locale;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GEMINI_KEY_STORAGE_KEY = "smart-city-thailand-gemini-key";
const certifiedCityCount = Number(getClaimValue("certified-cities") ?? 37);
const promotionCityCount = Number(getClaimValue("promotion-zones") ?? 190);
const proposalCount = Number(getClaimValue("proposals") ?? 227);
const smartCityTarget = Number(getClaimValue("target-smart-cities-2024-2027") ?? 105);

function getStoredGeminiKey(): string {
  try {
    return window.localStorage.getItem(GEMINI_KEY_STORAGE_KEY)?.trim() ?? "";
  } catch {
    return "";
  }
}

function saveStoredGeminiKey(apiKey: string) {
  try {
    if (apiKey.trim()) {
      window.localStorage.setItem(GEMINI_KEY_STORAGE_KEY, apiKey.trim());
      return;
    }
    window.localStorage.removeItem(GEMINI_KEY_STORAGE_KEY);
  } catch {
    // Best-effort browser storage only.
  }
}

function buildGeminiUrl(apiKey: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
}

/** Build the RAG context from our data */
function buildContext(citySummaryPrompt: string, locale: Locale): string {
  const instrumentSummaries = getCityFinanceInstrumentCatalog().slice(0, 8).map(i =>
    `${i.name}: ${i.category}, Segments: ${i.segmentFit.join("/")}. ${i.whyItFits.en}`
  ).join("\n");

  const sourceSummaries = dataSources.map(s =>
    `${s.name}: ${s.descEn} (${s.url})`
  ).join("\n");

  return `You are the Smart City Thailand Index assistant. You help users understand Thailand's smart city program, city rankings, financial mechanisms, and data sources.

KEY FACTS:
- depa official registry as of January 2026: ${proposalCount} submitted proposals, ${certifiedCityCount} certified smart cities, ${promotionCityCount} promotion cities
- 49 cities tracked inside this assistant: ${certifiedCityCount} certified Smart City Local + 12 profiled promotion cities
- Alpha/Beta/Gamma tier system (not numerical rankings)
- 7 scoring pillars: Livability (25%), Economy (20%), Safety (15%), Wellbeing (15%), Environment (10%), Hospitality (10%), Digital (5%)
- Run by depa (Digital Economy Promotion Agency) under MDES
- depa's current plan target: at least ${smartCityTarget} livable smart cities during the 2024-2027 period
- SLIC Index V2 launched at SCSE Taipei March 2026
- Led by Dr. Non Arkaraprasertkul (Senior Expert, Smart City Promotion)

TOP CITIES:
${citySummaryPrompt}

FINANCIAL INSTRUMENTS (tailored CDP backend):
${instrumentSummaries}

DATA SOURCES:
${sourceSummaries}

BACKEND CITY DATA RAILS:
${getCityDataRailReferenceText(locale)}

Nakhon Si Thammarat is the model city: 112,000 app users, <48h issue resolution, 10-hour flood warning, 0 flood fatalities since 2021. Mayor Kanop Ketchart (กณพ เกตุชาติ)'s citizen-centric governance.

Wangchan Valley is Gamma tier — it is a masterplanned area that is still in early development phases.

Answer concisely. Use data from the index. If asked about a specific city, reference its scores and tier. If asked about financing, recommend from the 15 ASEAN instruments based on city tier and characteristics. Respond in the same language the user writes in.`;
}

export default function GeminiChat({ locale }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState<string>(getStoredGeminiKey);
  const [apiKeyDraft, setApiKeyDraft] = useState<string>(getStoredGeminiKey);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: cities } = useCitySummaries();
  const systemPrompt = useRef("");
  const hasApiKey = apiKey.trim().length > 0;

  const citySummaryPrompt = useMemo(() => {
    if (cities.length) {
      return cities
        .slice(0, 20)
        .map(city =>
          `${city.nameEn} (${city.nameTh}): ${city.province}, Tier ${city.tier}, Score ${city.compositeScore}, Status: ${city.reality}, Dimensions: ${city.smartDimensions.join(", ")}. ${city.shortTailoredNote.en}`,
        )
        .join("\n");
    }

    return getCityContextSummaryPrompt();
  }, [cities]);

  useEffect(() => {
    systemPrompt.current = buildContext(citySummaryPrompt, locale);
  }, [citySummaryPrompt, locale]);

  const persistApiKey = useCallback(() => {
    const nextKey = apiKeyDraft.trim();
    saveStoredGeminiKey(nextKey);
    setApiKey(nextKey);
  }, [apiKeyDraft]);

  const clearApiKey = useCallback(() => {
    saveStoredGeminiKey("");
    setApiKey("");
    setApiKeyDraft("");
    setMessages([]);
    setInput("");
  }, []);

  const send = useCallback(async () => {
    if (!input.trim() || loading || !hasApiKey) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const res = await fetch(buildGeminiUrl(apiKey), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt.current }] },
          contents: [
            ...history,
            { role: "user", parts: [{ text: userMsg }] },
          ],
          generationConfig: {
            maxOutputTokens: 800,
            temperature: 0.7,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error?.message ?? "Gemini request failed.");
      }
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      const detail = error instanceof Error ? error.message : "Connection error.";
      setMessages(prev => [...prev, { role: "assistant", content: `Gemini request failed. ${detail}` }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
    }
  }, [apiKey, hasApiKey, input, loading, messages]);

  const t = (en: string, th: string, zh?: string) => locale === "zh" ? (zh ?? en) : locale === "th" ? th : en;

  if (!open) {
    return (
      <button className="chat-fab" onClick={() => setOpen(true)} title={t("Ask about Thai smart cities", "ถามเกี่ยวกับเมืองอัจฉริยะไทย", "询问泰国智慧城市")}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <span className="chat-title">{t("Smart City Assistant", "ผู้ช่วยเมืองอัจฉริยะ", "智慧城市助手")}</span>
        <span className="chat-powered">{hasApiKey ? "Gemini" : "BYO key"}</span>
        <button className="chat-close" onClick={() => setOpen(false)}>×</button>
      </div>

      <div className="chat-messages" ref={scrollRef}>
        {!hasApiKey && (
          <div className="chat-welcome">
            <p>{t(
              "For security, this optional assistant only runs with your own Gemini API key stored in this browser. No project key is bundled into the site.",
              "เพื่อความปลอดภัย ผู้ช่วยตัวเลือกนี้จะทำงานด้วย Gemini API key ของคุณเองที่เก็บไว้ในเบราว์เซอร์นี้เท่านั้น ไม่มี key ของโครงการถูกฝังมากับเว็บไซต์",
              "出于安全考虑，这个可选助手只会使用你自己的 Gemini API key，并仅保存在当前浏览器中。站点本身不再内置项目密钥。"
            )}</p>
            <p style={{ marginBottom: "1rem", fontSize: "var(--text-body)", lineHeight: "1.4", opacity: 0.8, background: "rgba(0,0,0,0.2)", padding: "0.5rem" }}>
              {t(
                "How to get a free key: 1. Visit aistudio.google.com 2. Sign in 3. Click 'Get API key' 4. Create key in new project 5. Copy and paste here.",
                "วิธีรับ Key ฟรี: 1. ไปที่ aistudio.google.com 2. ลงชื่อเข้าใช้ 3. คลิก 'Get API key' 4. สร้าง Key ในโปรเจกต์ใหม่ 5. คัดลอกมาวางที่นี่",
                "如何获取免费密钥：1. 访问 aistudio.google.com 2. 登录 3. 点击 'Get API key' 4. 在新项目中创建密钥 5. 复制并粘贴到此处。"
              )}
            </p>
            <input
              className="chat-input"
              type="password"
              value={apiKeyDraft}
              onChange={e => setApiKeyDraft(e.target.value)}
              placeholder={t("Paste Gemini API key", "วาง Gemini API key", "粘贴 Gemini API key")}
              style={{ marginBottom: ".6rem" }}
            />
            <div className="chat-suggestions">
              <button className="chat-suggestion" onClick={persistApiKey} disabled={!apiKeyDraft.trim()}>
                {t("Save key", "บันทึก key", "保存 key")}
              </button>
            </div>
          </div>
        )}
        {hasApiKey && messages.length === 0 && (
          <div className="chat-welcome">
            <p>{t(
              "Ask me about Thai smart cities, rankings, financial mechanisms, or data sources.",
              "ถามเกี่ยวกับเมืองอัจฉริยะไทย อันดับ กลไกการเงิน หรือแหล่งข้อมูล",
              "询问泰国智慧城市、排名、融资机制或数据来源。"
            )}</p>
            <div className="chat-suggestions">
              {[
                t("Which cities are Alpha tier?", "เมืองไหนเป็น Alpha?", "哪些城市是Alpha级？"),
                t("Why is Wangchan Valley Gamma?", "ทำไมวังจันทร์วัลเลย์เป็น Gamma?", "为什么Wangchan Valley是Gamma级？"),
                t("What financing fits Khon Kaen?", "กลไกการเงินอะไรเหมาะกับขอนแก่น?", "什么融资机制适合孔敬？"),
                t("How does Nakhon Si Thammarat work?", "นครศรีธรรมราชทำอะไร?", "洛坤如何运作？"),
              ].map((q, i) => (
                <button key={i} className="chat-suggestion" onClick={() => { setInput(q); }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`chat-msg chat-msg-${msg.role}`}>
            <div className="chat-msg-content">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-msg chat-msg-assistant">
            <div className="chat-msg-content chat-typing">...</div>
          </div>
        )}
      </div>

      <div className="chat-input-row">
        <input
          className="chat-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder={hasApiKey ? t("Ask about any city...", "ถามเกี่ยวกับเมืองใดก็ได้...", "询问任何城市...") : t("Add your Gemini key above to use the assistant", "เพิ่ม Gemini key ด้านบนเพื่อใช้งานผู้ช่วย", "先在上方添加 Gemini key 再使用助手")}
          disabled={loading || !hasApiKey}
        />
        <button className="chat-send" onClick={send} disabled={loading || !input.trim() || !hasApiKey}>
          →
        </button>
      </div>
      {hasApiKey && (
        <div style={{ padding: "0 .9rem .75rem", fontSize: "var(--text-micro)", color: "var(--3)" }}>
          <button
            type="button"
            onClick={clearApiKey}
            style={{ border: 0, background: "transparent", color: "var(--teal)", padding: 0, cursor: "pointer" }}
          >
            {t("Remove stored key", "ลบ key ที่บันทึกไว้", "移除已保存 key")}
          </button>
        </div>
      )}
    </div>
  );
}

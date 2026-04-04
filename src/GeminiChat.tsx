import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import type { Locale } from "./types";
import { useCitySummaries } from "./cityApi";
import { getCityContextSummaryPrompt, getCityDataRailReferenceText, getCityFinanceInstrumentCatalog } from "./cityCdp";
import { dataSources } from "./evidenceData";

interface Props {
  locale: Locale;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GEMINI_KEY = "AIzaSyA9R-CL2hEyXKr1ppc6ahGY9jKa3mYE5hU";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`;

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
- 49 cities tracked: 37 certified Smart City Local + 12 profiled promotion zones
- Alpha/Beta/Gamma tier system (not numerical rankings)
- 7 scoring pillars: Livability (25%), Economy (20%), Safety (15%), Wellbeing (15%), Environment (10%), Hospitality (10%), Digital (5%)
- Run by depa (Digital Economy Promotion Agency) under MDES
- Target: 105 smart cities by 2027
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

Nakhon Si Thammarat is the model city: 112,000 app users, <48h issue resolution, 10-hour flood warning, 0 flood fatalities since 2021. Mayor Kanop's citizen-centric approach.

Wangchan Valley is Gamma tier despite being "certified" — less than 10% built, essentially empty land.

Answer concisely. Use data from the index. If asked about a specific city, reference its scores and tier. If asked about financing, recommend from the 15 ASEAN instruments based on city tier and characteristics. Respond in the same language the user writes in.`;
}

export default function GeminiChat({ locale }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: cities } = useCitySummaries();
  const systemPrompt = useRef("");

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

  const send = useCallback(async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const history = messages.slice(-6).map(m => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      }));

      const res = await fetch(GEMINI_URL, {
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
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
    }
  }, [input, loading, messages]);

  const t = (en: string, th: string) => locale === "th" ? th : en;

  if (!open) {
    return (
      <button className="chat-fab" onClick={() => setOpen(true)} title={t("Ask about Thai smart cities", "ถามเกี่ยวกับเมืองอัจฉริยะไทย")}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <span className="chat-title">{t("Smart City Assistant", "ผู้ช่วยเมืองอัจฉริยะ")}</span>
        <span className="chat-powered">Gemini</span>
        <button className="chat-close" onClick={() => setOpen(false)}>×</button>
      </div>

      <div className="chat-messages" ref={scrollRef}>
        {messages.length === 0 && (
          <div className="chat-welcome">
            <p>{t(
              "Ask me about Thai smart cities, rankings, financial mechanisms, or data sources.",
              "ถามเกี่ยวกับเมืองอัจฉริยะไทย อันดับ กลไกการเงิน หรือแหล่งข้อมูล"
            )}</p>
            <div className="chat-suggestions">
              {[
                t("Which cities are Alpha tier?", "เมืองไหนเป็น Alpha?"),
                t("Why is Wangchan Valley Gamma?", "ทำไมวังจันทร์วัลเลย์เป็น Gamma?"),
                t("What financing fits Khon Kaen?", "กลไกการเงินอะไรเหมาะกับขอนแก่น?"),
                t("How does Nakhon Si Thammarat work?", "นครศรีธรรมราชทำอะไร?"),
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
          placeholder={t("Ask about any city...", "ถามเกี่ยวกับเมืองใดก็ได้...")}
          disabled={loading}
        />
        <button className="chat-send" onClick={send} disabled={loading || !input.trim()}>
          →
        </button>
      </div>
    </div>
  );
}

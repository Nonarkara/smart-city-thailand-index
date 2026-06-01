import { useState } from "react";
import type { Locale } from "./types";
import { sendFeedback } from "./visitorTracking";

interface Props {
  locale: Locale;
}

export default function DataFeedback({ locale }: Props) {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    
    try {
      await sendFeedback(text, window.location.pathname);
      setSent(true);
      setText("");
    } catch {
      // Fallback: mailto if the script fails or network is down
      window.location.href = `mailto:non.ar@depa.or.th?subject=SCITI Feedback&body=${encodeURIComponent(text)}`;
    } finally {
      setLoading(false);
    }
  };

  const labels = {
    en: {
      ask: "Did we miss anything?",
      cta: "Send me the data",
      placeholder: "Tell us about a city or metric we missed...",
      success: "Thank you. Your insight has been sent to the editorial team."
    },
    th: {
      ask: "เราพลาดอะไรไปหรือเปล่า?",
      cta: "ส่งข้อมูลให้เรา",
      placeholder: "บอกเราเกี่ยวกับเมืองหรือข้อมูลที่เราอาจตกหล่นไป...",
      success: "ขอบคุณ ข้อมูลของคุณถูกส่งไปยังทีมบรรณาธิการแล้ว"
    },
    zh: {
      ask: "我们漏掉了什么吗？",
      cta: "向我发送数据",
      placeholder: "告诉我们关于城市或指标的遗漏...",
      success: "谢谢。您的见解已发送至编辑团队。"
    }
  };

  const l = labels[locale];

  return (
    <section className="data-feedback-section">
      <div className="section">
        <div className="feedback-box">
          <div className="feedback-header">
            <h3>{l.ask}</h3>
          </div>
          {sent ? (
            <p className="feedback-success">{l.success}</p>
          ) : (
            <div className="feedback-form">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={l.placeholder}
                className="feedback-input"
                aria-label={l.ask}
              />
              <div className="feedback-footer">
                <button 
                  type="button" 
                  className="feedback-button" 
                  onClick={send}
                  disabled={!text.trim() || loading}
                >
                  {loading ? "..." : `${l.cta} →`}
                </button>
                <span className="feedback-meta">DIRECT TO non.ar@depa.or.th</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

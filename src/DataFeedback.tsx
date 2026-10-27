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
      success: "Your browser submitted the request. Delivery cannot be confirmed here; email non.ar@depa.or.th if you need a reply."
    },
    th: {
      ask: "เราพลาดอะไรไปหรือเปล่า?",
      cta: "ส่งข้อมูลให้เรา",
      placeholder: "บอกเราเกี่ยวกับเมืองหรือข้อมูลที่เราอาจตกหล่นไป...",
      success: "เบราว์เซอร์ส่งคำขอแล้ว แต่หน้านี้ยืนยันการรับไม่ได้ หากต้องการคำตอบ โปรดอีเมล non.ar@depa.or.th"
    },
    zh: {
      ask: "我们漏掉了什么吗？",
      cta: "提交数据",
      placeholder: "告诉我们关于城市或指标的遗漏...",
      success: "浏览器已提交请求，但此处无法确认送达。如需回复，请发送邮件至non.ar@depa.or.th。"
    }
  };

  const l = labels[locale];

  return (
    <section className="data-feedback-section">
      <div className="section">
        <details className="feedback-box">
          <summary className="feedback-header">{l.ask}</summary>
          {sent ? (
            <p className="feedback-success">{l.success}</p>
          ) : (
            <div className="feedback-form">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={l.placeholder}
                className="feedback-input"
                rows={3}
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
                <a className="feedback-meta" href="mailto:non.ar@depa.or.th">non.ar@depa.or.th</a>
              </div>
            </div>
          )}
        </details>
      </div>
    </section>
  );
}

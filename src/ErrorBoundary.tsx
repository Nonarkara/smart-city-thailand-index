import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  locale: "en" | "th" | "zh";
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      const messages = {
        en: {
          title: "Something went wrong.",
          subtitle: "The city signal was interrupted. Please try refreshing the page.",
          button: "Reload Index",
        },
        th: {
          title: "เกิดข้อผิดพลาดบางอย่าง",
          subtitle: "สัญญาณเมืองขัดข้อง กรุณาลองรีเฟรชหน้าเว็บอีกครั้ง",
          button: "โหลดดัชนีใหม่",
        },
        zh: {
          title: "出错了。",
          subtitle: "城市信号中断。请尝试刷新页面。",
          button: "重新加载指数",
        },
      };

      const m = messages[this.props.locale] || messages.en;

      return (
        <div style={{
          height: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
          background: "var(--bg)",
          color: "var(--ink)",
          fontFamily: "var(--font)"
        }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>{m.title}</h2>
          <p style={{ color: "var(--2)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>{m.subtitle}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "0.6rem 1.5rem",
              background: "var(--ink)",
              color: "var(--bg)",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.75rem"
            }}
          >
            {m.button}
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

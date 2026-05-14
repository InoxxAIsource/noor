import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Send, ChevronLeft, RotateCcw } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import BottomNav from "../components/BottomNav";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "I'm feeling anxious, help me find peace",
  "Explain Surah Al-Fatiha",
  "What does Islam say about gratitude?",
  "A dua for difficult times",
  "How to improve my Salah focus",
];

const CompanionPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const u = user as Record<string, unknown> | null;
  const name = (u?.["name"] as string)?.split(" ")[0] ?? "friend";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const token = localStorage.getItem("tazki_token");

  useEffect(() => {
    if (!initialized) {
      void initConversation();
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const initConversation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/director", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: [{ role: "user", content: `As-salamu alaykum. My name is ${name}.` }] }),
      });
      const data = await res.json() as { reply?: string; remaining?: number };
      if (data.reply) {
        setMessages([{ role: "assistant", content: data.reply }]);
        if (data.remaining !== undefined) setRemaining(data.remaining);
      }
    } catch {
      setMessages([{
        role: "assistant",
        content: `Wa alaykum as-salam, ${name}! I'm your MyTazki guide — here to help with Quran, Sunnah, duas, and any questions about your deen. How can I help you today?`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/director", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json() as { reply?: string; remaining?: number; error?: string };

      if (res.status === 429 || data.error) {
        setMessages([...newMessages, {
          role: "assistant",
          content: data.error ?? "You've reached your daily limit. JazakAllah khair for spending time with your deen today — come back tomorrow!",
        }]);
        setRemaining(0);
      } else if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
        if (data.remaining !== undefined) setRemaining(data.remaining);
      }
    } catch {
      setMessages([...newMessages, {
        role: "assistant",
        content: "I'm sorry, I couldn't respond. Please check your connection and try again.",
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const resetConversation = () => {
    setMessages([]);
    setInitialized(false);
    setRemaining(null);
    void initConversation();
    setInitialized(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage();
    }
  };

  const isLimitReached = remaining === 0;

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)", color: "var(--text)",
      display: "flex", flexDirection: "column",
    }}>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "16px 20px", borderBottom: "1px solid var(--border)",
        background: "var(--bg)", position: "sticky", top: 0, zIndex: 10,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 4 }}
          >
            <ChevronLeft size={22} />
          </button>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--green), #1a7a3a)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, boxShadow: "0 0 14px rgba(52,201,122,0.35)",
          }}>
            ☪️
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: "DM Sans, sans-serif" }}>
              MyTazki Guide
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)" }}>
              Grounded in Quran & Sunnah
            </div>
          </div>
        </div>
        <button
          onClick={resetConversation}
          style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", padding: 6 }}
          title="New conversation"
        >
          <RotateCcw size={17} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 4px" }}>

        {/* Quick prompts — shown only before conversation starts */}
        {messages.length === 0 && !loading && (
          <div style={{ paddingTop: 16 }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>☪️</div>
              <h2 style={{ fontFamily: "DM Sans, sans-serif", fontSize: 18, fontWeight: 700, marginBottom: 6 }}>
                As-salamu alaykum, {name}
              </h2>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, maxWidth: 280, margin: "0 auto" }}>
                Ask me anything about Quran, Sunnah, fiqh, duas, or your spiritual journey.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {QUICK_PROMPTS.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => void sendMessage(prompt)}
                  style={{
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: 12, padding: "12px 16px", textAlign: "left",
                    fontSize: 13, color: "var(--text)", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    transition: "border-color 0.2s", outline: "none",
                  }}
                  onMouseOver={e => (e.currentTarget.style.borderColor = "rgba(52,201,122,0.4)")}
                  onMouseOut={e => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  <span>{prompt}</span>
                  <span style={{ color: "var(--muted)", marginLeft: 8, flexShrink: 0 }}>→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message thread */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.role === "assistant" && (
                <div style={{
                  width: 30, height: 30, borderRadius: "50%",
                  background: "var(--card)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, marginRight: 8, flexShrink: 0, marginTop: 2,
                }}>
                  ☪️
                </div>
              )}
              <div style={{
                maxWidth: "78%",
                padding: "12px 16px",
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                background: msg.role === "user" ? "var(--green)" : "var(--card)",
                border: msg.role === "user" ? "none" : "1px solid var(--border)",
                color: msg.role === "user" ? "#09070A" : "var(--text)",
                fontSize: 14,
                lineHeight: 1.6,
                fontWeight: msg.role === "user" ? 500 : 400,
              }}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "var(--card)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, marginRight: 8, flexShrink: 0,
              }}>
                ☪️
              </div>
              <div style={{
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: "18px 18px 18px 4px", padding: "14px 18px",
              }}>
                <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                  {[0, 1, 2].map(d => (
                    <div key={d} style={{
                      width: 7, height: 7, borderRadius: "50%", background: "var(--green)",
                      animation: `bounce 1.2s ease-in-out ${d * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Remaining count */}
      {remaining !== null && remaining > 0 && (
        <div style={{ textAlign: "center", fontSize: 11, color: "var(--muted)", padding: "4px 0" }}>
          {remaining} messages remaining today
        </div>
      )}

      {/* Input area */}
      <div style={{
        padding: "12px 16px 16px",
        borderTop: "1px solid var(--border)",
        background: "var(--bg)",
        flexShrink: 0,
        paddingBottom: "calc(16px + 72px)",
      }}>
        {isLimitReached ? (
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 14, padding: "14px 16px", textAlign: "center",
          }}>
            <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>
              Daily limit reached — JazakAllah khair 🌙
            </p>
            <p style={{ fontSize: 11, color: "var(--muted)", margin: "4px 0 0" }}>
              Come back tomorrow for more guidance
            </p>
          </div>
        ) : (
          <div style={{
            display: "flex", gap: 10, alignItems: "flex-end",
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: 18, padding: "8px 8px 8px 16px",
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your deen..."
              disabled={loading}
              rows={1}
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                color: "var(--text)", fontSize: 14, resize: "none",
                lineHeight: 1.5, maxHeight: 120, overflowY: "auto",
                padding: "4px 0",
              }}
            />
            <button
              onClick={() => void sendMessage()}
              disabled={!input.trim() || loading}
              style={{
                width: 36, height: 36, borderRadius: "50%",
                background: input.trim() && !loading ? "var(--green)" : "var(--faint)",
                border: "none", cursor: input.trim() && !loading ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background 0.2s", flexShrink: 0,
              }}
            >
              <Send size={15} color={input.trim() && !loading ? "#09070A" : "var(--muted)"} />
            </button>
          </div>
        )}
      </div>

      <BottomNav />

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default CompanionPage;

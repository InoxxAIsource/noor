import React, { useState, useRef, useEffect } from "react";
import { Send, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AIGuide: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [initialized, setInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("noor_token");

  useEffect(() => {
    if (open && !initialized) {
      openConversation();
      setInitialized(true);
    }
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const openConversation = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/director", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ messages: [{ role: "user", content: "Hello" }] }),
      });
      const data = await res.json() as { reply?: string; remaining?: number; error?: string };
      if (data.reply) {
        setMessages([{ role: "assistant", content: data.reply }]);
        setRemaining(data.remaining ?? null);
      }
    } catch {
      setMessages([{ role: "assistant", content: `As-salamu alaykum, ${user?.name || "friend"}! How can I help you today?` }]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/director", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
        }),
      });

      const data = await res.json() as { reply?: string; remaining?: number; error?: string };

      if (res.status === 429 || data.error) {
        setMessages([...newMessages, { role: "assistant", content: data.error || "Daily limit reached. JazakAllah khair for using Noor!" }]);
        setRemaining(0);
      } else if (data.reply) {
        setMessages([...newMessages, { role: "assistant", content: data.reply }]);
        setRemaining(data.remaining ?? null);
      }
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "I'm sorry, I couldn't respond. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isLimitReached = remaining === 0;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 w-14 h-14 bg-[var(--green)] rounded-full shadow-[0_0_20px_rgba(0,165,80,0.5)] flex items-center justify-center text-2xl hover:scale-110 transition-transform"
        aria-label="Open Noor Guide"
      >
        ☪️
      </button>

      {/* Slide-up drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative bg-[var(--bg)] rounded-t-3xl flex flex-col" style={{ height: "80vh" }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[var(--green)] rounded-full flex items-center justify-center text-lg">☪️</div>
                <div>
                  <h3 className="font-cinzel text-[var(--gold)] text-base leading-tight">Noor Guide</h3>
                  <p className="text-[10px] text-[var(--muted)]">Islamic companion · Quran & Sunnah</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-[var(--muted)] hover:text-[var(--text)]">
                <X size={22} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[var(--green)] text-white rounded-br-sm"
                        : "bg-[var(--card)] border border-[var(--border)] border-l-4 border-l-[var(--green)] rounded-bl-sm"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[var(--card)] border border-[var(--border)] border-l-4 border-l-[var(--green)] px-4 py-3 rounded-2xl rounded-bl-sm text-sm">
                    <span className="animate-pulse text-[var(--muted)]">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--border)] shrink-0">
              {remaining !== null && (
                <p className="text-[10px] text-[var(--muted)] text-center mb-2">
                  {isLimitReached
                    ? "Daily limit reached — come back tomorrow"
                    : `${remaining} messages remaining today`}
                </p>
              )}
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isLimitReached ? "Daily limit reached..." : "Ask a question..."}
                  disabled={isLimitReached || loading}
                  className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--green)] disabled:opacity-50"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || loading || isLimitReached}
                  className="w-10 h-10 bg-[var(--green)] rounded-full flex items-center justify-center disabled:opacity-40 hover:bg-[var(--green)]/90 transition-colors"
                >
                  <Send size={15} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIGuide;

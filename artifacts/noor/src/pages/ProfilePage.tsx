import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useGetMyStreak, useAiCompanion } from "@workspace/api-client-react";
import { format } from "date-fns";
import { LogOut, Send, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { data: streakData } = useGetMyStreak();
  const aiMutation = useAiCompanion();

  const [aiMessage, setAiMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', content: string}[]>([
    { role: 'ai', content: "As-salamu alaykum. I am your AI companion for Islamic guidance based on Quran and Sunnah. How can I help you today?" }
  ]);
  const [chatOpen, setChatOpen] = useState(false);

  const getInitials = (name?: string) => {
    if (!name) return "N";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleSendAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;

    const newHistory = [...chatHistory, { role: 'user' as const, content: aiMessage }];
    setChatHistory(newHistory);
    setAiMessage("");

    // Build context string from history
    const context = chatHistory.map(msg => `${msg.role}: ${msg.content}`).join("\n");

    aiMutation.mutate({ data: { message: aiMessage, context } }, {
      onSuccess: (data) => {
        setChatHistory([...newHistory, { role: 'ai', content: data.reply }]);
      }
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 p-6 animate-fade-in">
      {/* Header Profile */}
      <div className="flex items-center gap-6 mb-10 bg-[var(--surface)] p-6 rounded-3xl border border-[var(--border)] shadow-lg">
        <div className="w-20 h-20 rounded-full bg-[var(--green)] flex items-center justify-center text-2xl font-cinzel font-bold border-[3px] border-[var(--gold)]">
          {getInitials(user?.name)}
        </div>
        <div>
          <h1 className="font-cinzel text-2xl text-[var(--gold)]">{user?.name}</h1>
          <p className="text-[var(--muted)]">{user?.email}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <h2 className="font-cinzel text-xl text-[var(--gold)] mb-4">Your Journey</h2>
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] text-center">
          <p className="text-[var(--muted)] text-xs uppercase tracking-wider mb-1">Current Streak</p>
          <p className="font-cinzel text-3xl text-[var(--green)]">{streakData?.currentStreak || 0}</p>
        </div>
        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] text-center">
          <p className="text-[var(--muted)] text-xs uppercase tracking-wider mb-1">Longest Streak</p>
          <p className="font-cinzel text-3xl text-[var(--gold)]">{streakData?.longestStreak || 0}</p>
        </div>
        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] text-center">
          <p className="text-[var(--muted)] text-xs uppercase tracking-wider mb-1">Total Prayers</p>
          <p className="font-cinzel text-3xl text-white">{streakData?.totalPrayers || 0}</p>
        </div>
        <div className="bg-[var(--surface)] p-5 rounded-2xl border border-[var(--border)] text-center">
          <p className="text-[var(--muted)] text-xs uppercase tracking-wider mb-1">Minutes Listening</p>
          <p className="font-cinzel text-3xl text-white">{streakData?.totalMinutes || 0}</p>
        </div>
      </div>

      {/* AI Companion */}
      <div className="mb-10">
        <button 
          onClick={() => setChatOpen(!chatOpen)}
          className="w-full bg-gradient-to-r from-[var(--surface)] to-[var(--card)] p-5 rounded-2xl border border-[var(--green)] flex justify-between items-center text-left"
        >
          <div>
            <h2 className="font-cinzel text-xl text-[var(--gold)]">AI Islamic Companion</h2>
            <p className="text-sm text-[var(--muted)]">Ask questions based on Quran & Sunnah</p>
          </div>
          <div className={`w-8 h-8 rounded-full bg-[var(--green)]/20 flex items-center justify-center text-[var(--green)] transition-transform ${chatOpen ? 'rotate-180' : ''}`}>
            ▼
          </div>
        </button>

        {chatOpen && (
          <div className="mt-4 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 flex flex-col h-96">
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[var(--green)] text-white rounded-br-sm' 
                      : 'bg-[var(--card)] border border-[var(--border)] border-l-4 border-l-[var(--green)] rounded-bl-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {aiMutation.isPending && (
                <div className="flex justify-start">
                  <div className="bg-[var(--card)] border border-[var(--border)] border-l-4 border-l-[var(--green)] p-3 rounded-xl rounded-bl-sm text-sm">
                    <span className="animate-pulse">Thinking...</span>
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSendAi} className="flex gap-2">
              <Input 
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-[var(--card)] border-[var(--border)] rounded-full px-4"
              />
              <button 
                type="submit" 
                disabled={aiMutation.isPending || !aiMessage.trim()}
                className="w-10 h-10 rounded-full bg-[var(--green)] text-white flex items-center justify-center disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Settings Summary */}
      <h2 className="font-cinzel text-xl text-[var(--gold)] mb-4">Settings</h2>
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] divide-y divide-[var(--border)] mb-10">
        <div className="p-4 flex justify-between items-center">
          <span className="text-[var(--muted)]">Location</span>
          <span className="font-semibold">{user?.city || 'Not set'}</span>
        </div>
        <div className="p-4 flex justify-between items-center">
          <span className="text-[var(--muted)]">Tradition</span>
          <span className="font-semibold">{user?.madhab || 'Not set'}</span>
        </div>
        <div className="p-4 flex justify-between items-center">
          <span className="text-[var(--muted)]">Language</span>
          <span className="font-semibold uppercase">{user?.language || 'EN'}</span>
        </div>
      </div>

      <Button 
        variant="outline" 
        onClick={logout}
        className="w-full py-6 text-[var(--danger)] border-[var(--danger)]/30 hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] rounded-xl text-lg font-semibold"
      >
        <LogOut className="mr-2" size={20} />
        Sign Out
      </Button>
    </div>
  );
};

export default ProfilePage;
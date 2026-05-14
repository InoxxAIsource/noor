import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import DeenAppLogo from "@/components/DeenAppLogo";

interface GiftData {
  senderName: string;
  message: string;
  sessionTitle: string;
  sessionId: string;
  session: Record<string, unknown>;
}

const GiftPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [gift, setGift] = useState<GiftData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch(`/api/gifts/${token}`)
      .then((r) => r.json())
      .then((data: GiftData & { error?: string }) => {
        if (data.error) {
          setError(data.error);
        } else {
          setGift(data);
        }
      })
      .catch(() => setError("Failed to load gift"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--gold)] font-cinzel">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">🤲</div>
          <p>Loading your gift...</p>
        </div>
      </div>
    );
  }

  if (error || !gift) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-5xl mb-4">💔</p>
        <h2 className="font-cinzel text-[var(--gold)] text-xl mb-2">Gift not found</h2>
        <p className="text-[var(--muted)] text-sm mb-6">{error || "This gift may have expired."}</p>
        <Link to="/register" className="bg-[var(--green)] text-white px-6 py-3 rounded-xl font-semibold">
          Join MyTazki, Free
        </Link>
      </div>
    );
  }

  const s = gift.session;
  const sessionArabic = s?.["scriptureArabic"] as string | undefined;
  const sessionDuration = s?.["durationSeconds"] as number | undefined;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center p-6">
      {/* MyTazki Logo */}
      <div className="text-center mb-8">
        <DeenAppLogo size={64} showText={true} showTagline={true} />
      </div>

      <div className="w-full max-w-sm space-y-6">
        {/* Gift card */}
        <div className="bg-[var(--surface)] border border-[var(--gold)]/30 rounded-3xl p-6 text-center shadow-[0_0_30px_rgba(255,215,0,0.08)]">
          <p className="text-4xl mb-3">🤲</p>
          <p className="text-[var(--muted)] text-sm mb-1">A gift of dua from</p>
          <p className="font-cinzel text-xl text-[var(--gold)] mb-3">{gift.senderName}</p>

          {gift.message && (
            <div className="bg-[var(--card)] rounded-xl p-3 mb-4 border border-[var(--border)]">
              <p className="text-sm italic text-[var(--muted)]">"{gift.message}"</p>
            </div>
          )}

          {sessionArabic && (
            <p className="font-amiri text-2xl text-[var(--gold)] mb-3 leading-relaxed" dir="rtl">
              {sessionArabic}
            </p>
          )}

          <p className="font-cinzel text-white mb-1">{gift.session?.["title"] as string}</p>
          {sessionDuration && (
            <p className="text-xs text-[var(--muted)]">{Math.ceil(sessionDuration / 60)} min guided session</p>
          )}
        </div>

        {/* CTA */}
        <div className="text-center space-y-3">
          <p className="text-sm text-[var(--muted)]">Listen to this dua, free on MyTazki</p>
          <Link
            to="/register"
            className="block w-full bg-[var(--green)] text-white py-4 rounded-2xl font-cinzel text-lg text-center shadow-[0_0_20px_rgba(52,201,122,0.3)] hover:bg-[var(--green)]/90 transition-colors"
          >
            Listen to this Dua, Free
          </Link>
          <Link
            to="/login"
            className="block text-[var(--muted)] text-sm hover:text-[var(--text)] transition-colors"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GiftPage;

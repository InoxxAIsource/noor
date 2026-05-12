import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ChevronLeft, Settings, Heart, Send, Play } from "lucide-react";

interface HalaqahMember {
  userId: string;
  name: string;
  joinedAt: number;
  lastPrayedAt: string | null;
}

interface HalaqahIntention {
  id: string;
  userId: string;
  name: string;
  text: string;
  prayerCount: number;
  createdAt: number;
}

interface HalaqahData {
  code: string;
  name: string;
  adminId: string;
  members: HalaqahMember[];
  assignedSession: string | null;
  assignedSessionTitle: string | null;
  groupStreak: number;
  intentions: HalaqahIntention[];
}

const HalaqahGroupPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState<HalaqahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [intention, setIntention] = useState("");
  const [sending, setSending] = useState(false);
  const token = localStorage.getItem("tazki_token");
  const u = user as Record<string, unknown> | null;

  useEffect(() => {
    if (!code) return;
    fetchGroup();
    checkin();
  }, [code]);

  const fetchGroup = async () => {
    try {
      const res = await fetch(`/api/halaqah/${code}`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json() as HalaqahData;
      setGroup(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const checkin = async () => {
    try {
      await fetch(`/api/halaqah/${code}/checkin`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` },
      });
    } catch { /* ignore */ }
  };

  const postIntention = async () => {
    if (!intention.trim() || sending) return;
    setSending(true);
    try {
      await fetch(`/api/halaqah/${code}/intention`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text: intention }),
      });
      setIntention("");
      fetchGroup();
    } catch { /* ignore */ }
    finally { setSending(false); }
  };

  const prayForIntention = async (intentionId: string) => {
    try {
      await fetch(`/api/halaqah/${code}/pray`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ intentionId }),
      });
      fetchGroup();
    } catch { /* ignore */ }
  };

  const today = new Date().toISOString().split("T")[0]!;
  const isAdmin = group && group.adminId === (u?.["id"] as string);

  const getInitials = (name: string) => name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--gold)] font-cinzel">
        Loading...
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-5xl">🕌</p>
        <p className="font-cinzel text-[var(--gold)]">Group not found</p>
        <button onClick={() => navigate("/halaqah")} className="text-[var(--green)] underline text-sm">Back to Halaqah</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/halaqah")} className="text-[var(--muted)]"><ChevronLeft size={24} /></button>
          <div>
            <h1 className="font-cinzel text-lg text-[var(--gold)] leading-tight">{group.name}</h1>
            <p className="text-xs text-[var(--muted)]">🕌 {group.members.length} members · Code: {code}</p>
          </div>
        </div>
        {isAdmin && (
          <Link to={`/halaqah/${code}/admin`} className="text-[var(--muted)] hover:text-[var(--gold)]">
            <Settings size={20} />
          </Link>
        )}
      </div>

      <div className="p-4 space-y-5">
        {/* Assigned session */}
        {group.assignedSession ? (
          <div className="bg-gradient-to-r from-[var(--surface)] to-[var(--card)] border border-[var(--green)] rounded-2xl p-5">
            <p className="text-xs text-[var(--green)] uppercase tracking-wider mb-1">Today's Session</p>
            <p className="font-cinzel text-white text-lg mb-3">{group.assignedSessionTitle || "Group Session"}</p>
            <Link
              to={`/player/${group.assignedSession}`}
              className="flex items-center gap-2 bg-[var(--green)] text-white px-5 py-2.5 rounded-xl font-semibold text-sm w-fit"
            >
              <Play size={14} /> Start this session
            </Link>
          </div>
        ) : (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 text-center">
            <p className="text-[var(--muted)] text-sm">No session assigned yet</p>
            {isAdmin && (
              <Link to={`/halaqah/${code}/admin`} className="text-[var(--green)] text-sm underline mt-2 block">
                Assign a session →
              </Link>
            )}
          </div>
        )}

        {/* Group streak */}
        <div className="flex items-center justify-center gap-3 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4">
          <span className="text-3xl">🔥</span>
          <div className="text-center">
            <p className="font-cinzel text-2xl text-[var(--gold)]">{group.groupStreak}</p>
            <p className="text-xs text-[var(--muted)]">days consecutive group ibadah</p>
          </div>
        </div>

        {/* Member grid */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
          <p className="font-cinzel text-[var(--gold)] mb-4">Members</p>
          <div className="grid grid-cols-4 gap-3">
            {group.members.map(member => {
              const prayedToday = member.lastPrayedAt === today;
              return (
                <div key={member.userId} className="flex flex-col items-center gap-1.5">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-[var(--card)] border-2 border-[var(--border)] flex items-center justify-center font-semibold text-sm text-[var(--gold)]">
                      {getInitials(member.name)}
                    </div>
                    {prayedToday && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[var(--green)] rounded-full border border-[var(--bg)]" />
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--muted)] text-center truncate w-full leading-tight">
                    {member.name.split(" ")[0]}
                  </p>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-[var(--muted)] mt-3 text-center">
            Green dot = prayed today · {group.members.filter(m => m.lastPrayedAt === today).length}/{group.members.length} active today
          </p>
        </div>

        {/* Intentions board */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
          <p className="font-cinzel text-[var(--gold)] mb-4">Shared Dua Board</p>

          {group.intentions.length === 0 ? (
            <p className="text-[var(--muted)] text-sm text-center py-4">No intentions yet. Be the first to share.</p>
          ) : (
            <div className="space-y-3 mb-4">
              {[...group.intentions].reverse().map(int => (
                <div key={int.id} className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs text-[var(--green)] font-medium">{int.name}</span>
                    <span className="text-[10px] text-[var(--muted)]">
                      {new Date(int.createdAt).toLocaleDateString("en", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{int.text}</p>
                  <button
                    onClick={() => prayForIntention(int.id)}
                    className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--green)] transition-colors"
                  >
                    <Heart size={12} /> {int.prayerCount} prayed for this
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              value={intention}
              onChange={e => setIntention(e.target.value)}
              onKeyDown={e => e.key === "Enter" && postIntention()}
              placeholder="Share an intention..."
              className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--green)]"
            />
            <button
              onClick={postIntention}
              disabled={!intention.trim() || sending}
              className="w-10 h-10 bg-[var(--green)] rounded-full flex items-center justify-center disabled:opacity-40"
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HalaqahGroupPage;

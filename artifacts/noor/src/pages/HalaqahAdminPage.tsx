import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useGetSessions } from "@workspace/api-client-react";
import { ChevronLeft, CheckCircle } from "lucide-react";

interface HalaqahMember {
  userId: string;
  name: string;
  joinedAt: number;
  lastPrayedAt: string | null;
}

interface HalaqahData {
  code: string;
  name: string;
  adminId: string;
  members: HalaqahMember[];
  assignedSession: string | null;
  assignedSessionTitle: string | null;
  groupStreak: number;
}

interface Stats {
  totalMembers: number;
  prayedToday: number;
  participationRate: number;
  weekSessions: number;
}

const HalaqahAdminPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: sessions } = useGetSessions();
  const [group, setGroup] = useState<HalaqahData | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assigned, setAssigned] = useState(false);
  const token = localStorage.getItem("tazki_token");
  const u = user as Record<string, unknown> | null;

  useEffect(() => {
    if (!code) return;
    Promise.all([
      fetch(`/api/halaqah/${code}`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`/api/halaqah/${code}/stats`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([g, s]: [HalaqahData, Stats]) => {
      setGroup(g);
      setSelectedSession(g.assignedSession || "");
      setStats(s);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [code]);

  const assignSession = async () => {
    if (!selectedSession || assigning) return;
    setAssigning(true);
    const sessionList = sessions as Array<Record<string, unknown>> | undefined;
    const sessionTitle = sessionList?.find(s => s["id"] === selectedSession)?.["title"] as string || "";
    try {
      const res = await fetch(`/api/halaqah/${code}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sessionId: selectedSession, sessionTitle }),
      });
      const updated = await res.json() as HalaqahData;
      setGroup(updated);
      setAssigned(true);
      setTimeout(() => setAssigned(false), 3000);
    } catch { /* ignore */ }
    finally { setAssigning(false); }
  };

  const today = new Date().toISOString().split("T")[0]!;
  const isAdmin = group && group.adminId === (u?.["id"] as string);

  if (loading) {
    return <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--gold)] font-cinzel">Loading...</div>;
  }

  if (!group || !isAdmin) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center gap-4 p-6">
        <p className="font-cinzel text-[var(--gold)]">Admin access only</p>
        <button onClick={() => navigate(`/halaqah/${code}`)} className="text-[var(--green)] underline text-sm">Back to group</button>
      </div>
    );
  }

  const sessionList = sessions as Array<Record<string, unknown>> | undefined;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24">
      <div className="p-4 flex items-center gap-3 border-b border-[var(--border)]">
        <button onClick={() => navigate(`/halaqah/${code}`)} className="text-[var(--muted)]"><ChevronLeft size={24} /></button>
        <div>
          <h1 className="font-cinzel text-lg text-[var(--gold)]">Admin — {group.name}</h1>
          <p className="text-xs text-[var(--muted)]">Code: {code}</p>
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Members", value: stats.totalMembers },
              { label: "Prayed Today", value: stats.prayedToday },
              { label: "Participation", value: `${stats.participationRate}%` },
              { label: "This Week", value: `${stats.weekSessions} sessions` },
            ].map(s => (
              <div key={s.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 text-center">
                <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider mb-1">{s.label}</p>
                <p className="font-cinzel text-xl text-[var(--gold)]">{s.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Assign session */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
          <p className="font-cinzel text-[var(--gold)] mb-4">Today's Assigned Session</p>
          {group.assignedSession && (
            <div className="mb-3 p-3 bg-[var(--green)]/10 border border-[var(--green)]/30 rounded-xl">
              <p className="text-xs text-[var(--green)] mb-0.5">Currently assigned:</p>
              <p className="text-sm font-semibold">{group.assignedSessionTitle}</p>
            </div>
          )}
          <select
            value={selectedSession}
            onChange={e => setSelectedSession(e.target.value)}
            className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)] mb-3"
          >
            <option value="">Select a session...</option>
            {sessionList?.map(s => (
              <option key={s["id"] as string} value={s["id"] as string}>
                {s["title"] as string}
              </option>
            ))}
          </select>
          <button
            onClick={assignSession}
            disabled={!selectedSession || assigning}
            className="w-full bg-[var(--green)] text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {assigned ? <><CheckCircle size={16} /> Assigned!</> : assigning ? "Assigning..." : "Assign to Group"}
          </button>
        </div>

        {/* Member list */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5">
          <p className="font-cinzel text-[var(--gold)] mb-4">Members ({group.members.length})</p>
          <div className="space-y-3">
            {group.members.map(member => {
              const prayedToday = member.lastPrayedAt === today;
              const joinDate = new Date(member.joinedAt).toLocaleDateString("en", { month: "short", day: "numeric" });
              return (
                <div key={member.userId} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-sm font-semibold text-[var(--gold)] shrink-0">
                    {member.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate">{member.name}</p>
                      {member.userId === group.adminId && (
                        <span className="text-[10px] text-[var(--gold)] bg-[var(--gold)]/10 px-1.5 py-0.5 rounded-full">Admin</span>
                      )}
                    </div>
                    <p className="text-[10px] text-[var(--muted)]">Joined {joinDate}</p>
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${prayedToday ? "text-[var(--green)]" : "text-[var(--muted)]"}`}>
                    <div className={`w-2 h-2 rounded-full ${prayedToday ? "bg-[var(--green)]" : "bg-[var(--muted)]"}`} />
                    {prayedToday ? "Active today" : "Not yet"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HalaqahAdminPage;

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ChevronLeft, Users, Plus } from "lucide-react";

interface HalaqahGroup {
  code: string;
  name: string;
  members: Array<{ userId: string; name: string }>;
}

const HalaqahPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"landing" | "join" | "create">("landing");
  const [code, setCode] = useState("");
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<HalaqahGroup | null>(null);
  const [createdCode, setCreatedCode] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("deen_token");

  const lookupGroup = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/halaqah/${code.toUpperCase()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) { setError("Group not found. Check the code."); setLoading(false); return; }
      const data = await res.json() as HalaqahGroup;
      setPreview(data);
    } catch { setError("Could not connect. Try again."); }
    finally { setLoading(false); }
  };

  const joinGroup = async () => {
    if (!preview) return;
    setLoading(true);
    try {
      await fetch(`/api/halaqah/${preview.code}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/halaqah/${preview.code}`);
    } catch { setError("Failed to join."); }
    finally { setLoading(false); }
  };

  const createGroup = async () => {
    if (!groupName.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/halaqah", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: groupName }),
      });
      const data = await res.json() as { code: string };
      setCreatedCode(data.code);
    } catch { setError("Failed to create group."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24">
      <div className="p-4 flex items-center gap-3 border-b border-[var(--border)]">
        <button onClick={() => mode === "landing" ? navigate(-1) : setMode("landing")} className="text-[var(--muted)]">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-cinzel text-xl text-[var(--gold)]">Halaqah</h1>
      </div>

      <div className="p-6">
        {mode === "landing" && (
          <>
            <div className="text-center mb-10">
              <p className="text-6xl mb-4">🕌</p>
              <h2 className="font-cinzel text-2xl text-[var(--gold)] mb-2">Pray Together</h2>
              <p className="text-[var(--muted)] text-sm max-w-xs mx-auto">
                Join a Halaqah to pray with your family, friends, or community — and hold each other accountable.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setMode("join")}
                className="w-full bg-[var(--surface)] border border-[var(--green)] rounded-2xl p-5 flex items-center gap-4 hover:bg-[var(--card)] transition-colors"
              >
                <div className="w-12 h-12 bg-[var(--green)]/10 rounded-full flex items-center justify-center">
                  <Users size={22} className="text-[var(--green)]" />
                </div>
                <div className="text-left">
                  <p className="font-cinzel text-white">Join a Halaqah</p>
                  <p className="text-xs text-[var(--muted)]">Enter an invite code to join</p>
                </div>
              </button>

              <button
                onClick={() => setMode("create")}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 flex items-center gap-4 hover:border-[var(--gold)] transition-colors"
              >
                <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-full flex items-center justify-center">
                  <Plus size={22} className="text-[var(--gold)]" />
                </div>
                <div className="text-left">
                  <p className="font-cinzel text-white">Create a Halaqah</p>
                  <p className="text-xs text-[var(--muted)]">Start a new group for your community</p>
                </div>
              </button>
            </div>
          </>
        )}

        {mode === "join" && (
          <div className="max-w-sm mx-auto">
            <h2 className="font-cinzel text-xl text-[var(--gold)] mb-6 text-center">Enter Invite Code</h2>
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. ABC123"
              maxLength={6}
              className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-4 text-center text-2xl font-mono text-[var(--gold)] tracking-widest mb-4 focus:outline-none focus:border-[var(--green)]"
            />
            {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}
            <button
              onClick={lookupGroup}
              disabled={code.length < 4 || loading}
              className="w-full bg-[var(--green)] text-white py-3 rounded-xl font-semibold mb-6 disabled:opacity-50"
            >
              {loading ? "Looking up..." : "Find Group"}
            </button>

            {preview && (
              <div className="bg-[var(--surface)] border border-[var(--green)] rounded-2xl p-5 text-center">
                <p className="text-4xl mb-2">🕌</p>
                <h3 className="font-cinzel text-[var(--gold)] text-lg mb-1">{preview.name}</h3>
                <p className="text-sm text-[var(--muted)] mb-4">
                  <Users size={13} className="inline mr-1" />
                  {preview.members?.length || 0} member{preview.members?.length !== 1 ? "s" : ""}
                </p>
                <button
                  onClick={joinGroup}
                  disabled={loading}
                  className="w-full bg-[var(--green)] text-white py-3 rounded-xl font-semibold"
                >
                  {loading ? "Joining..." : "Join Halaqah"}
                </button>
              </div>
            )}
          </div>
        )}

        {mode === "create" && (
          <div className="max-w-sm mx-auto">
            {!createdCode ? (
              <>
                <h2 className="font-cinzel text-xl text-[var(--gold)] mb-6 text-center">Create a Halaqah</h2>
                <div className="mb-4">
                  <label className="text-xs text-[var(--muted)] uppercase tracking-wider mb-2 block">Group name</label>
                  <input
                    value={groupName}
                    onChange={e => setGroupName(e.target.value)}
                    placeholder="e.g. Family Ibadah Circle"
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--green)]"
                  />
                </div>
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                <button
                  onClick={createGroup}
                  disabled={!groupName.trim() || loading}
                  className="w-full bg-[var(--green)] text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Group"}
                </button>
              </>
            ) : (
              <div className="text-center">
                <p className="text-5xl mb-4">🎉</p>
                <h3 className="font-cinzel text-[var(--gold)] text-xl mb-2">Halaqah Created!</h3>
                <p className="text-[var(--muted)] text-sm mb-4">Share this code with your community:</p>
                <div
                  className="bg-[var(--card)] border border-[var(--gold)]/40 rounded-2xl px-6 py-4 font-mono text-4xl text-[var(--gold)] font-bold tracking-widest mb-4 cursor-pointer"
                  onClick={() => navigator.clipboard.writeText(createdCode)}
                >
                  {createdCode}
                </div>
                <p className="text-xs text-[var(--muted)] mb-6">Tap code to copy</p>
                <Link
                  to={`/halaqah/${createdCode}`}
                  className="block w-full bg-[var(--green)] text-white py-3 rounded-xl font-semibold"
                >
                  Enter Group →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HalaqahPage;

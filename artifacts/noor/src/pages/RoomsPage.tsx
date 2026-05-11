import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGetSessions } from "@workspace/api-client-react";
import { useAuth } from "../contexts/AuthContext";
import { Plus, Users, ChevronLeft, Copy, Share2 } from "lucide-react";

interface Room {
  code: string;
  name: string;
  sessionTitle: string;
  participantCount: number;
  hostName: string;
  createdAt: number;
}

const RoomsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: sessions } = useGetSessions();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedSession, setSelectedSession] = useState("");
  const [roomName, setRoomName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createdCode, setCreatedCode] = useState("");
  const token = localStorage.getItem("deen_token");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/rooms/active", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json() as Room[];
      setRooms(data);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const createRoom = async () => {
    if (!selectedSession || !roomName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ sessionId: selectedSession, name: roomName }),
      });
      const data = await res.json() as { code: string };
      setCreatedCode(data.code);
      fetchRooms();
    } catch { /* ignore */ }
    finally { setCreating(false); }
  };

  const sessionList = sessions as Array<Record<string, unknown>> | undefined;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24">
      <div className="p-4 flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-[var(--muted)]">
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-cinzel text-xl text-[var(--gold)]">Prayer Rooms</h1>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 bg-[var(--green)] text-white px-4 py-2 rounded-full text-sm font-semibold"
        >
          <Plus size={16} /> Create
        </button>
      </div>

      <div className="p-4">
        <p className="text-[var(--muted)] text-sm mb-6">
          🕌 Pray together with Muslims around the world in real time.
        </p>

        {loading ? (
          <div className="text-center py-8 text-[var(--muted)]">Loading rooms...</div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🕌</p>
            <p className="font-cinzel text-[var(--gold)] mb-2">No active rooms</p>
            <p className="text-[var(--muted)] text-sm mb-6">Create a room to pray together</p>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-[var(--green)] text-white px-6 py-2.5 rounded-xl font-semibold"
            >
              Create a room
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {rooms.map((room) => (
              <div key={room.code} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 bg-[var(--green)] rounded-full animate-pulse" />
                      <span className="text-xs text-[var(--green)] font-medium">LIVE</span>
                    </div>
                    <h3 className="font-semibold text-white">{room.name}</h3>
                    <p className="text-xs text-[var(--muted)]">{room.sessionTitle}</p>
                  </div>
                  <Link
                    to={`/room/${room.code}`}
                    className="bg-[var(--green)] text-white px-4 py-1.5 rounded-full text-sm font-semibold"
                  >
                    Join
                  </Link>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                  <Users size={12} />
                  <span>{room.participantCount} soul{room.participantCount !== 1 ? "s" : ""} praying</span>
                  <span className="ml-auto font-mono text-[var(--green)]/70">{room.code}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Room Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end">
          <div className="bg-[var(--surface)] w-full rounded-t-3xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {!createdCode ? (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="font-cinzel text-[var(--gold)] text-lg">Create a Prayer Room</h3>
                  <button onClick={() => setShowCreate(false)} className="text-[var(--muted)]">✕</button>
                </div>

                <div>
                  <label className="text-xs text-[var(--muted)] mb-1 block">Room name</label>
                  <input
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g. Morning Azkar Circle"
                    className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--green)]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[var(--muted)] mb-1 block">Session</label>
                  <select
                    value={selectedSession}
                    onChange={(e) => setSelectedSession(e.target.value)}
                    className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] focus:outline-none focus:border-[var(--green)]"
                  >
                    <option value="">Select a session...</option>
                    {sessionList?.map((s) => (
                      <option key={s["id"] as string} value={s["id"] as string}>
                        {s["title"] as string}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={createRoom}
                  disabled={!selectedSession || !roomName.trim() || creating}
                  className="w-full bg-[var(--green)] text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Room"}
                </button>
              </>
            ) : (
              <>
                <div className="text-center">
                  <p className="text-4xl mb-3">🕌</p>
                  <h3 className="font-cinzel text-[var(--gold)] text-lg mb-1">Room Created!</h3>
                  <p className="text-[var(--muted)] text-sm mb-4">Share this code with your friends:</p>
                  <div className="flex items-center gap-3 bg-[var(--card)] border border-[var(--gold)]/30 rounded-xl p-4 mb-4">
                    <span className="font-mono text-2xl text-[var(--gold)] font-bold flex-1 text-center">
                      {createdCode}
                    </span>
                    <button
                      onClick={() => navigator.clipboard.writeText(createdCode)}
                      className="text-[var(--muted)] hover:text-[var(--green)]"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Join me to pray together on DeenApp 🕌\nRoom code: ${createdCode}\n${window.location.origin}/room/${createdCode}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3 rounded-xl font-semibold mb-3"
                  >
                    <Share2 size={16} /> Share on WhatsApp
                  </a>
                  <Link
                    to={`/room/${createdCode}`}
                    className="flex items-center justify-center gap-2 w-full bg-[var(--green)] text-white py-3 rounded-xl font-semibold"
                    onClick={() => setShowCreate(false)}
                  >
                    Enter Room →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;

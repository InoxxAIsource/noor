import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ChevronLeft, Users, Heart, Send } from "lucide-react";

interface Intention {
  id: string;
  text: string;
  senderName: string;
  prayerCount: number;
  timestamp: number;
}

interface Room {
  code: string;
  name: string;
  sessionId: string;
  sessionTitle: string;
  hostId: string;
  hostName: string;
  participantCount: number;
  intentions: Intention[];
  isActive: boolean;
}

const RoomPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [intentions, setIntentions] = useState<Intention[]>([]);
  const [participantCount, setParticipantCount] = useState(1);
  const [newIntention, setNewIntention] = useState("");
  const [sending, setSending] = useState(false);
  const [joined, setJoined] = useState(false);
  const intentionsEndRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const token = localStorage.getItem("tazki_token");

  useEffect(() => {
    if (!code) return;
    fetchRoom();
    joinRoom();
    connectSSE();

    return () => {
      eventSourceRef.current?.close();
    };
  }, [code]);

  useEffect(() => {
    intentionsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [intentions]);

  const fetchRoom = async () => {
    try {
      const res = await fetch(`/api/rooms/${code}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json() as Room;
      setRoom(data);
      setIntentions(data.intentions || []);
      setParticipantCount(data.participantCount || 1);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const joinRoom = async () => {
    if (joined) return;
    try {
      await fetch(`/api/rooms/${code}/join`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      setJoined(true);
    } catch { /* ignore */ }
  };

  const connectSSE = () => {
    const es = new EventSource(`/api/rooms/${code}/stream`);
    eventSourceRef.current = es;

    es.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data) as {
          type: string;
          count?: number;
          intention?: Intention;
          intentions?: Intention[];
        };
        if (event.type === "connected") {
          if (event.count) setParticipantCount(event.count);
          if (event.intentions) setIntentions(event.intentions);
        } else if (event.type === "participant_joined" && event.count) {
          setParticipantCount(event.count);
        } else if (event.type === "intention_added" && event.intention) {
          setIntentions((prev) => [...prev, event.intention!]);
        } else if (event.type === "intention_updated" && event.intention) {
          setIntentions((prev) =>
            prev.map((i) => (i.id === event.intention!.id ? event.intention! : i))
          );
        }
      } catch { /* ignore */ }
    };

    es.onerror = () => {
      es.close();
    };
  };

  const sendIntention = async () => {
    if (!newIntention.trim() || sending) return;
    setSending(true);
    try {
      await fetch("/api/intentions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          code,
          text: newIntention,
          senderName: user?.name || "Anonymous",
        }),
      });
      setNewIntention("");
    } catch { /* ignore */ }
    finally { setSending(false); }
  };

  const prayForIntention = async (intentionId: string) => {
    try {
      await fetch(`/api/intentions/${intentionId}/pray`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ code }),
      });
    } catch { /* ignore */ }
  };

  const startPlayback = async () => {
    try {
      await fetch(`/api/rooms/${code}/start`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch { /* ignore */ }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-[var(--gold)] font-cinzel">
        Loading room...
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-5xl">🕌</p>
        <p className="font-cinzel text-[var(--gold)]">Room not found</p>
        <button onClick={() => navigate("/rooms")} className="text-[var(--green)] underline text-sm">
          Back to rooms
        </button>
      </div>
    );
  }

  const isHost = user && room.hostId === (user as unknown as Record<string, unknown>)?.["id"];

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col pb-safe">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 border-b border-[var(--border)] shrink-0">
        <button onClick={() => navigate("/rooms")} className="text-[var(--muted)]">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="font-cinzel text-[var(--gold)] leading-tight">{room.name}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="w-1.5 h-1.5 bg-[var(--green)] rounded-full animate-pulse" />
            <span className="text-xs text-[var(--muted)]">
              <Users size={10} className="inline mr-1" />
              {participantCount} souls praying together
            </span>
          </div>
        </div>
        <span className="font-mono text-xs text-[var(--green)]/70">{code}</span>
      </div>

      {/* Session info */}
      <div className="p-4 bg-[var(--surface)] border-b border-[var(--border)] shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--muted)] mb-0.5">Currently praying</p>
            <p className="font-semibold">{room.sessionTitle}</p>
          </div>
          {isHost ? (
            <button
              onClick={startPlayback}
              className="bg-[var(--green)] text-white px-4 py-2 rounded-xl text-sm font-semibold"
            >
              ▶ Start
            </button>
          ) : (
            <Link
              to={`/player/${room.sessionId}`}
              className="bg-[var(--green)] text-white px-4 py-2 rounded-xl text-sm font-semibold"
            >
              Join session
            </Link>
          )}
        </div>
      </div>

      {/* Intentions feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <p className="text-xs text-[var(--muted)] text-center">
          🤲 Share your intentions — the community will pray for you
        </p>

        {intentions.length === 0 ? (
          <div className="text-center py-8 text-[var(--muted)] text-sm">
            No intentions yet. Be the first to share.
          </div>
        ) : (
          intentions.map((intention) => (
            <div
              key={intention.id}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-[var(--green)] font-medium">{intention.senderName}</span>
                <span className="text-[10px] text-[var(--muted)]">
                  {new Date(intention.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-sm mb-3">{intention.text}</p>
              <button
                onClick={() => prayForIntention(intention.id)}
                className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--green)] transition-colors"
              >
                <Heart size={13} />
                <span>{intention.prayerCount} prayed for this</span>
              </button>
            </div>
          ))
        )}
        <div ref={intentionsEndRef} />
      </div>

      {/* Add intention */}
      <div className="p-4 border-t border-[var(--border)] bg-[var(--bg)] shrink-0">
        <div className="flex gap-2">
          <input
            value={newIntention}
            onChange={(e) => setNewIntention(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendIntention()}
            placeholder="Share an intention to pray for..."
            className="flex-1 bg-[var(--surface)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--green)]"
          />
          <button
            onClick={sendIntention}
            disabled={!newIntention.trim() || sending}
            className="w-10 h-10 bg-[var(--green)] rounded-full flex items-center justify-center disabled:opacity-40"
          >
            <Send size={15} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;

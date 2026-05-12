import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, Heart, TrendingUp, Share2 } from "lucide-react";

interface Name {
  id: string;
  nameEnglish: string;
  nameArabic: string;
  gender: string;
  meaningEnglish: string;
  origin: string;
  categories?: string[];
  trending2025?: boolean;
}

function generateNameCardPNG(n: Name): void {
  const canvas = document.createElement("canvas");
  canvas.width = 640;
  canvas.height = 400;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#001a00";
  ctx.fillRect(0, 0, 640, 400);
  ctx.strokeStyle = "rgba(0,165,80,0.3)";
  ctx.lineWidth = 6;
  ctx.strokeRect(20, 20, 600, 360);
  ctx.fillStyle = "#ffd700";
  ctx.font = "bold 52px serif";
  ctx.textAlign = "center";
  ctx.fillText(n.nameArabic, 320, 160);
  ctx.fillStyle = "#e8f5e8";
  ctx.font = "bold 32px system-ui";
  ctx.fillText(n.nameEnglish, 320, 215);
  ctx.fillStyle = "#4a7a4a";
  ctx.font = "18px system-ui";
  const meaning = n.meaningEnglish.length > 60 ? n.meaningEnglish.substring(0, 60) + "…" : n.meaningEnglish;
  ctx.fillText(meaning, 320, 260);
  ctx.fillStyle = "#006622";
  ctx.fillRect(0, 340, 640, 60);
  ctx.fillStyle = "#00a550";
  ctx.font = "14px system-ui";
  ctx.fillText("MyTazki — mytazki.com", 320, 378);
  const link = document.createElement("a");
  link.download = `${n.nameEnglish.toLowerCase()}-name-card.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

const TrendingNamesPage: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("tazki_token");
  const [names, setNames] = useState<Name[]>([]);
  const [loading, setLoading] = useState(true);
  const [gender, setGender] = useState<"all" | "male" | "female">("all");
  const [selected, setSelected] = useState<Name | null>(null);

  useEffect(() => {
    fetch("/api/names/trending", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.json())
      .then((data: Name[]) => {
        setNames(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const filtered = names.filter((n) => gender === "all" || n.gender === gender);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-md px-4 pt-4 pb-3 border-b border-[var(--border)] flex items-center gap-3">
        <button onClick={() => navigate("/names")} className="p-2 text-[var(--muted)] hover:text-[var(--text)] transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="font-cinzel text-xl text-[var(--gold)] flex items-center gap-2">
            <TrendingUp size={20} /> Trending 2025
          </h1>
          <p className="text-xs text-[var(--muted)]">Most popular Islamic names this year</p>
        </div>
      </div>

      <div className="p-6">
        <div className="flex gap-2 mb-6">
          {(["all", "male", "female"] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={`flex-1 py-2 rounded-full text-sm font-semibold capitalize transition-colors ${
                gender === g
                  ? "bg-[var(--green)] text-white"
                  : "bg-[var(--surface)] text-[var(--muted)] border border-[var(--border)]"
              }`}
            >
              {g === "all" ? "All" : g === "male" ? "Boys" : "Girls"}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-20 text-[var(--muted)]">
            <p className="font-amiri text-2xl text-[var(--gold)] mb-3">بِسْمِ ٱللَّهِ</p>
            Loading trending names...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20 text-[var(--muted)]">
            <TrendingUp size={40} className="mx-auto mb-3 opacity-30" />
            <p>No trending names found for this filter.</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {filtered.map((name, i) => (
            <button
              key={name.id}
              onClick={() => setSelected(name)}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 text-left hover:border-[var(--green)] transition-colors relative"
            >
              <span className="absolute top-2 left-2 text-[10px] font-bold text-[var(--gold)] bg-[var(--card)] px-1.5 py-0.5 rounded">
                #{i + 1}
              </span>
              <p className="font-amiri text-xl text-[var(--gold)] text-right rtl mb-1 mt-3">{name.nameArabic}</p>
              <p className="font-semibold text-sm">{name.nameEnglish}</p>
              <p className="text-xs text-[var(--muted)] line-clamp-2 mt-1">{name.meaningEnglish}</p>
              <div className="flex items-center justify-between mt-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  name.gender === "male"
                    ? "bg-blue-900/30 text-blue-300"
                    : "bg-pink-900/30 text-pink-300"
                }`}>
                  {name.gender === "male" ? "Boy" : "Girl"}
                </span>
                <span className="text-[10px] text-[var(--green)] flex items-center gap-1">
                  <TrendingUp size={10} /> Trending
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/names"
            className="text-sm text-[var(--green)] hover:underline"
          >
            ← Browse all Islamic names
          </Link>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div
            className="relative w-full bg-[var(--surface)] rounded-t-3xl border-t border-[var(--border)] p-6 pb-10 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <p className="font-amiri text-5xl text-[var(--gold)] rtl mb-2">{selected.nameArabic}</p>
              <h2 className="font-cinzel text-2xl text-[var(--text)] mb-1">{selected.nameEnglish}</h2>
              <span className={`text-xs px-3 py-1 rounded-full ${
                selected.gender === "male"
                  ? "bg-blue-900/40 text-blue-300"
                  : "bg-pink-900/40 text-pink-300"
              }`}>
                {selected.gender === "male" ? "Boy's name" : "Girl's name"}
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-[var(--card)] rounded-xl p-4">
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Meaning</p>
                <p className="text-[var(--text)]">{selected.meaningEnglish}</p>
              </div>
              <div className="bg-[var(--card)] rounded-xl p-4">
                <p className="text-xs text-[var(--muted)] uppercase tracking-wider mb-1">Origin</p>
                <p className="text-[var(--text)]">{selected.origin}</p>
              </div>
              {selected.categories && selected.categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selected.categories.map((c) => (
                    <span key={c} className="text-xs bg-[var(--green)]/10 text-[var(--green)] border border-[var(--green)]/20 px-3 py-1 rounded-full">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => generateNameCardPNG(selected)}
                className="flex-1 flex items-center justify-center gap-2 bg-[var(--green)] text-white py-3 rounded-xl font-semibold text-sm"
              >
                <Share2 size={16} /> Share as card
              </button>
              <button
                onClick={() => setSelected(null)}
                className="flex-1 border border-[var(--border)] text-[var(--muted)] py-3 rounded-xl text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingNamesPage;

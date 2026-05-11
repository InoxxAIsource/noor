import React, { useState, useEffect } from "react";
import { MapPin, Navigation, Star, ExternalLink } from "lucide-react";

interface Masjid {
  name: string;
  lat: number;
  lng: number;
  distance: number;
}

const MasjidFinderPage: React.FC = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mosques, setMosques] = useState<Masjid[]>([]);
  const [loading, setLoading] = useState(false);
  const [locError, setLocError] = useState("");
  const [favourite, setFavourite] = useState<Masjid | null>(() => {
    try { return JSON.parse(localStorage.getItem("favMasjid") ?? "null"); } catch { return null; }
  });
  const [filter, setFilter] = useState("All");

  const FILTERS = ["All", "Sunni", "Shia", "Jama Masjid"];

  const filterKeywords: Record<string, string[]> = {
    "Sunni": ["sunni", "hanafi", "shafi", "maliki", "hanbali", "barelvi", "deobandi"],
    "Shia": ["shia", "shi'a", "jafari", "ithna", "husain", "hussain"],
    "Jama Masjid": ["jama", "jami", "jamia", "friday", "central"],
  };

  useEffect(() => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(c);
        fetch(`/api/masjid/nearby?lat=${c.lat}&lng=${c.lng}`)
          .then((r) => r.json())
          .then((data) => { setMosques(data); setLoading(false); })
          .catch(() => setLoading(false));
      },
      () => {
        setLocError("Location permission denied.");
        setLoading(false);
      }
    );
  }, []);

  const saveFavourite = (m: Masjid) => {
    setFavourite(m);
    localStorage.setItem("favMasjid", JSON.stringify(m));
    fetch("/api/masjid/favourite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("deen_token") ?? ""}`,
      },
      body: JSON.stringify(m),
    }).catch(() => {});
  };

  const filteredMosques = filter === "All"
    ? mosques
    : mosques.filter(m => {
        const nameLower = m.name.toLowerCase();
        return filterKeywords[filter]?.some(kw => nameLower.includes(kw));
      });

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-md pt-6 pb-3 px-4 border-b border-[var(--border)]">
        <h1 className="font-cinzel text-3xl text-[var(--gold)] text-center">Masjid Finder</h1>
        <p className="text-center text-[var(--muted)] text-sm mt-1">Mosques near you</p>
        {/* Filter chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap border transition-colors flex-shrink-0 ${
                filter === f
                  ? "bg-[var(--green)] text-white border-[var(--green)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--green)]/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {locError && (
          <div className="text-center py-10 text-[var(--muted)]">
            <MapPin size={40} className="mx-auto mb-3 opacity-40" />
            <p>{locError}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-10 text-[var(--muted)]">
            <div className="w-8 h-8 border-2 border-[var(--green)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Finding mosques nearby...
          </div>
        )}

        {favourite && (
          <div className="bg-[var(--green)]/10 border-2 border-[var(--gold)]/40 rounded-2xl p-4">
            <p className="text-xs text-[var(--gold)] font-cinzel uppercase tracking-wider mb-2">⭐ Your Favourite Masjid</p>
            <p className="font-semibold text-[var(--text)]">{favourite.name}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-[var(--muted)]">{favourite.distance} km away</span>
              <a
                href={`https://maps.google.com/maps?daddr=${favourite.lat},${favourite.lng}`}
                target="_blank"
                rel="noreferrer"
                className="ml-auto flex items-center gap-1 text-xs text-[var(--green)] hover:underline"
              >
                Navigate <ExternalLink size={12} />
              </a>
            </div>
          </div>
        )}

        {coords && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
            <iframe
              title="mosque-map"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.05},${coords.lat - 0.05},${coords.lng + 0.05},${coords.lat + 0.05}&layer=mapnik&marker=${coords.lat},${coords.lng}`}
              className="w-full h-48"
              style={{ border: 0 }}
            />
          </div>
        )}

        {mosques.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-[var(--muted)] text-sm uppercase tracking-wider">
              {filteredMosques.length} mosque{filteredMosques.length !== 1 ? "s" : ""} {filter === "All" ? "within 5km" : `matching "${filter}"`}
            </h2>
            {filteredMosques.length === 0 && (
              <p className="text-center text-[var(--muted)] py-6 text-sm">No {filter} mosques found nearby. Try "All".</p>
            )}
            {filteredMosques.map((m, i) => (
              <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--green)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={18} className="text-[var(--green)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--text)]">{m.name}</p>
                    <p className="text-xs text-[var(--muted)] mt-0.5">{m.distance} km away</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveFavourite(m)}
                      className={`p-2 rounded-full transition-colors ${
                        favourite?.name === m.name
                          ? "text-[var(--gold)]"
                          : "text-[var(--muted)] hover:text-[var(--gold)]"
                      }`}
                    >
                      <Star size={16} className={favourite?.name === m.name ? "fill-[var(--gold)]" : ""} />
                    </button>
                    <a
                      href={`https://maps.google.com/maps?daddr=${m.lat},${m.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-full text-[var(--muted)] hover:text-[var(--green)] transition-colors"
                    >
                      <Navigation size={16} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !locError && mosques.length === 0 && coords && (
          <div className="text-center py-10 text-[var(--muted)]">No mosques found within 5km.</div>
        )}
      </div>
    </div>
  );
};

export default MasjidFinderPage;

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Navigation, Star, ExternalLink, RefreshCw, AlertCircle } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Masjid {
  name: string;
  lat: number;
  lng: number;
  distance: number;
  distanceKm?: number;
  mapsUrl?: string;
}

const MasjidFinderPage: React.FC = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mosques, setMosques] = useState<Masjid[]>([]);
  const [loading, setLoading] = useState(false);
  const [locError, setLocError] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedMasjid, setSelectedMasjid] = useState<Masjid | null>(null);
  const [favourite, setFavourite] = useState<Masjid | null>(() => {
    try { return JSON.parse(localStorage.getItem("favMasjid") ?? "null"); } catch { return null; }
  });

  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const FILTERS = ["All", "Sunni", "Shia", "Jama Masjid"];
  const filterKeywords: Record<string, string[]> = {
    Sunni: ["sunni", "hanafi", "shafi", "maliki", "hanbali", "barelvi", "deobandi"],
    Shia: ["shia", "shi'a", "jafari", "ithna", "husain", "hussain"],
    "Jama Masjid": ["jama", "jami", "jamia", "friday", "central"],
  };

  const filteredMosques = filter === "All"
    ? mosques
    : mosques.filter(m =>
        filterKeywords[filter]?.some(kw => m.name.toLowerCase().includes(kw))
      );

  const initMap = useCallback((lat: number, lng: number, list: Masjid[]) => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    const userIcon = L.divIcon({
      html: `<div style="width:14px;height:14px;background:#00a550;border:3px solid white;border-radius:50%;box-shadow:0 0 0 3px rgba(0,165,80,0.3)"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      className: "",
    });
    L.marker([lat, lng], { icon: userIcon })
      .addTo(map)
      .bindPopup("<b style='color:#001a00'>You are here</b>", { maxWidth: 160 });

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    list.forEach((mosque, i) => {
      const mosqueIcon = L.divIcon({
        html: `<div style="width:32px;height:32px;background:#ffd700;border:2px solid #003800;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.4)"><span style="transform:rotate(45deg);font-size:14px">🕌</span></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -34],
        className: "",
      });

      const marker = L.marker([mosque.lat, mosque.lng], { icon: mosqueIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:system-ui;min-width:160px">
            <b style="color:#001a00;font-size:13px">${mosque.name}</b><br>
            <span style="color:#4a7a4a;font-size:12px">${mosque.distance} km away</span><br>
            <a href="${mosque.mapsUrl || `https://maps.google.com/maps?daddr=${mosque.lat},${mosque.lng}`}" target="_blank" rel="noreferrer"
               style="color:#00a550;font-size:12px;text-decoration:none;font-weight:600">
              📍 Get Directions
            </a>
          </div>
        `, { maxWidth: 200 });

      marker.on("click", () => setSelectedMasjid(mosque));
      markersRef.current.push(marker);

      if (i === 0) {
        setTimeout(() => marker.openPopup(), 500);
      }
    });

    if (list.length > 0) {
      const bounds = L.latLngBounds([[lat, lng], ...list.map(m => [m.lat, m.lng] as [number, number])]);
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, []);

  const fetchMosques = useCallback((lat: number, lng: number) => {
    setLoading(true);
    fetch(`/api/masjid/nearby?lat=${lat}&lng=${lng}`)
      .then(r => r.json())
      .then((data: Masjid[]) => {
        setMosques(data);
        setLoading(false);
        initMap(lat, lng, data);
      })
      .catch(() => setLoading(false));
  }, [initMap]);

  useEffect(() => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(c);
        fetchMosques(c.lat, c.lng);
      },
      () => {
        setLocError("Location permission denied. Please allow location access and try again.");
        setLoading(false);
      }
    );
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [fetchMosques]);

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

  const scrollToMasjid = (m: Masjid) => {
    setSelectedMasjid(m);
    if (mapRef.current) {
      mapRef.current.flyTo([m.lat, m.lng], 16, { duration: 1 });
      const idx = mosques.indexOf(m);
      if (markersRef.current[idx]) markersRef.current[idx].openPopup();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[var(--bg)]/95 backdrop-blur-md pt-6 pb-3 px-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-1">
          <h1 className="font-cinzel text-2xl text-[var(--gold)]">🕌 Masjid Finder</h1>
          {coords && (
            <button
              onClick={() => fetchMosques(coords.lat, coords.lng)}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--green)] transition-colors"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          )}
        </div>
        <p className="text-[var(--muted)] text-xs">
          {mosques.length > 0 ? `${mosques.length} real mosques found nearby` : "Real mosques from OpenStreetMap"}
        </p>
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

      <div className="flex-1 overflow-y-auto">
        {/* Error state */}
        {locError && (
          <div className="mx-4 mt-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-6 text-center">
            <AlertCircle size={36} className="mx-auto mb-3 text-[var(--muted)]" />
            <p className="text-[var(--muted)] text-sm">{locError}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-10 text-[var(--muted)]">
            <div className="w-8 h-8 border-2 border-[var(--green)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Finding real masjids nearby…</p>
          </div>
        )}

        {/* Favourite banner */}
        {favourite && (
          <div className="mx-4 mt-4 bg-[var(--green)]/10 border-2 border-[var(--gold)]/40 rounded-2xl p-4">
            <p className="text-xs text-[var(--gold)] font-cinzel uppercase tracking-wider mb-2">⭐ Your Favourite Masjid</p>
            <p className="font-semibold text-[var(--text)]">{favourite.name}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xs text-[var(--muted)]">{favourite.distance} km away</span>
              <a
                href={favourite.mapsUrl || `https://maps.google.com/maps?daddr=${favourite.lat},${favourite.lng}`}
                target="_blank"
                rel="noreferrer"
                className="ml-auto flex items-center gap-1 text-xs text-[var(--green)] hover:underline font-semibold"
              >
                Get Directions <ExternalLink size={11} />
              </a>
            </div>
          </div>
        )}

        {/* Interactive Leaflet Map */}
        {!locError && (
          <div className="mx-4 mt-4 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--surface)]" style={{ height: 280 }}>
            {loading && !coords ? (
              <div className="w-full h-full flex items-center justify-center text-[var(--muted)]">
                <MapPin size={28} className="mr-2" />
                <span className="text-sm">Waiting for location…</span>
              </div>
            ) : (
              <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
            )}
          </div>
        )}

        {/* Google Maps link for full search */}
        {coords && (
          <div className="mx-4 mt-2">
            <a
              href={`https://www.google.com/maps/search/mosque/@${coords.lat},${coords.lng},15z`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-[var(--border)] text-xs text-[var(--muted)] hover:text-[var(--green)] hover:border-[var(--green)]/50 transition-colors"
            >
              <ExternalLink size={13} />
              Open full search in Google Maps
            </a>
          </div>
        )}

        {/* Mosque list */}
        {mosques.length > 0 && (
          <div className="px-4 mt-5 pb-4 space-y-3">
            <h2 className="font-semibold text-[var(--muted)] text-xs uppercase tracking-wider">
              {filteredMosques.length} mosque{filteredMosques.length !== 1 ? "s" : ""}
              {filter === "All" ? " within 5km" : ` matching "${filter}"`}
            </h2>

            {filteredMosques.length === 0 && (
              <p className="text-center text-[var(--muted)] py-6 text-sm">
                No {filter} mosques found nearby. Try "All".
              </p>
            )}

            {filteredMosques.map((m, i) => (
              <div
                key={i}
                onClick={() => scrollToMasjid(m)}
                className={`bg-[var(--surface)] border rounded-2xl p-4 cursor-pointer transition-all ${
                  selectedMasjid?.name === m.name
                    ? "border-[var(--green)] shadow-[0_0_12px_rgba(0,165,80,0.15)]"
                    : "border-[var(--border)] hover:border-[var(--green)]/40"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--green)]/15 flex items-center justify-center flex-shrink-0 text-xl">
                    🕌
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[var(--text)] text-sm leading-snug">{m.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[var(--muted)]">
                        <MapPin size={10} className="inline mr-0.5" />{m.distance} km
                      </span>
                      {i === 0 && (
                        <span className="text-xs text-[var(--gold)] font-medium">Nearest</span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); saveFavourite(m); }}
                      className={`p-2 rounded-full transition-colors ${
                        favourite?.name === m.name
                          ? "text-[var(--gold)] bg-[var(--gold)]/10"
                          : "text-[var(--muted)] hover:text-[var(--gold)]"
                      }`}
                      title="Save as favourite"
                    >
                      <Star size={15} className={favourite?.name === m.name ? "fill-[var(--gold)]" : ""} />
                    </button>
                    <a
                      href={m.mapsUrl || `https://maps.google.com/maps?daddr=${m.lat},${m.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-full text-[var(--muted)] hover:text-[var(--green)] transition-colors"
                      title="Get directions in Google Maps"
                    >
                      <Navigation size={15} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !locError && mosques.length === 0 && coords && (
          <div className="text-center py-12 text-[var(--muted)] px-4">
            <MapPin size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm">No mosques found within 5km.</p>
            <a
              href={`https://www.google.com/maps/search/mosque/@${coords.lat},${coords.lng},14z`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 mt-3 text-[var(--green)] text-sm hover:underline"
            >
              Search on Google Maps <ExternalLink size={13} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasjidFinderPage;

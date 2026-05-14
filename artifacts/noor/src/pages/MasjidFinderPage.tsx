import React, { useState, useEffect, useRef, useCallback } from "react";
import { MapPin, Navigation, Star, ExternalLink, RefreshCw, AlertCircle, ChevronUp, ChevronDown, Locate } from "lucide-react";
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
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedMasjid, setSelectedMasjid] = useState<Masjid | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [favourite, setFavourite] = useState<Masjid | null>(() => {
    try { return JSON.parse(localStorage.getItem("favMasjid") ?? "null"); } catch { return null; }
  });

  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);

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

  const initMap = useCallback((lat: number, lng: number) => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // already initialised

    const map = L.map(mapContainerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: true,
      scrollWheelZoom: true,
    });
    mapRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // User location marker
    const userIcon = L.divIcon({
      html: `<div style="width:18px;height:18px;background:#34c97a;border:3px solid white;border-radius:50%;box-shadow:0 0 0 6px rgba(52,201,122,0.25)"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
      className: "",
    });
    const uMarker = L.marker([lat, lng], { icon: userIcon })
      .addTo(map)
      .bindPopup("<b style='color:#09070A;font-size:13px'>📍 You are here</b>", { maxWidth: 160 });
    userMarkerRef.current = uMarker;
  }, []);

  const updateMosqueMarkers = useCallback((lat: number, lng: number, list: Masjid[]) => {
    const map = mapRef.current;
    if (!map) return;

    // Update user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([lat, lng]);
    }

    // Remove old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    list.forEach((mosque, i) => {
      const mosqueIcon = L.divIcon({
        html: `<div style="position:relative;width:36px;height:36px">
          <div style="width:36px;height:36px;background:#c9a472;border:2.5px solid #003800;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 3px 10px rgba(0,0,0,0.5);font-size:18px">🕌</div>
          ${i === 0 ? '<div style="position:absolute;-bottom:4px;left:50%;transform:translateX(-50%);background:#34c97a;color:white;font-size:9px;padding:1px 4px;border-radius:3px;white-space:nowrap;font-weight:700">NEAREST</div>' : ""}
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20],
        className: "",
      });

      const marker = L.marker([mosque.lat, mosque.lng], { icon: mosqueIcon })
        .addTo(map)
        .bindPopup(`
          <div style="font-family:system-ui;min-width:180px;padding:2px 0">
            <b style="color:#09070A;font-size:13px;display:block;margin-bottom:4px">${mosque.name}</b>
            <span style="color:#6e5e4c;font-size:12px">📏 ${mosque.distance} km away</span><br>
            <a href="${mosque.mapsUrl || `https://maps.google.com/maps?daddr=${mosque.lat},${mosque.lng}`}" target="_blank" rel="noreferrer"
               style="display:inline-block;margin-top:6px;color:white;background:#34c97a;font-size:11px;padding:4px 10px;border-radius:8px;text-decoration:none;font-weight:600">
              🧭 Get Directions
            </a>
          </div>
        `, { maxWidth: 220 });

      marker.on("click", () => {
        setSelectedMasjid(mosque);
        setSheetOpen(true);
      });
      markersRef.current.push(marker);

      if (i === 0) {
        setTimeout(() => marker.openPopup(), 600);
      }
    });

    // Fit bounds to show user + mosques
    if (list.length > 0) {
      const bounds = L.latLngBounds([[lat, lng], ...list.map(m => [m.lat, m.lng] as [number, number])]);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 15 });
    } else {
      map.setView([lat, lng], 15);
    }
  }, []);

  const fetchMosques = useCallback((lat: number, lng: number) => {
    setLoading(true);
    fetch(`/api/masjid/nearby?lat=${lat}&lng=${lng}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("tazki_token") ?? ""}` },
    })
      .then(r => r.json())
      .then((data: Masjid[]) => {
        setMosques(data);
        setLoading(false);
        if (data.length > 0) setSheetOpen(true);
        updateMosqueMarkers(lat, lng, data);
      })
      .catch(() => setLoading(false));
  }, [updateMosqueMarkers]);

  const requestLocation = useCallback(() => {
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCoords(c);
        setLocating(false);
        // Init map if not already done
        if (!mapRef.current) {
          setTimeout(() => {
            initMap(c.lat, c.lng);
            setTimeout(() => fetchMosques(c.lat, c.lng), 200);
          }, 100);
        } else {
          mapRef.current.setView([c.lat, c.lng], 15);
          if (userMarkerRef.current) userMarkerRef.current.setLatLng([c.lat, c.lng]);
          fetchMosques(c.lat, c.lng);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === 1) {
          setLocError("Location access denied. Please allow location in your browser settings, then tap 'Try Again'.");
        } else if (err.code === 2) {
          setLocError("Location unavailable. Please check your GPS or internet connection.");
        } else {
          setLocError("Location request timed out. Please tap 'Try Again'.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, [initMap, fetchMosques]);

  // On mount: init map centred on world, then request location
  useEffect(() => {
    // Init map immediately so it renders
    setTimeout(() => {
      if (mapContainerRef.current && !mapRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [20, 0],
          zoom: 2,
          zoomControl: true,
          scrollWheelZoom: true,
        });
        mapRef.current = map;
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);
      }
      requestLocation();
    }, 100);

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveFavourite = (m: Masjid) => {
    setFavourite(m);
    localStorage.setItem("favMasjid", JSON.stringify(m));
    fetch("/api/masjid/favourite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("tazki_token") ?? ""}`,
      },
      body: JSON.stringify(m),
    }).catch(() => {});
  };

  const flyToMasjid = (m: Masjid) => {
    setSelectedMasjid(m);
    if (mapRef.current) {
      mapRef.current.flyTo([m.lat, m.lng], 17, { duration: 1.2 });
      const idx = mosques.indexOf(m);
      if (markersRef.current[idx]) {
        setTimeout(() => markersRef.current[idx].openPopup(), 1300);
      }
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, display: "flex", flexDirection: "column", background: "#09070A" }}>
      {/* Top overlay header */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "linear-gradient(to bottom, rgba(9,7,10,0.95) 60%, transparent)",
        padding: "16px 16px 24px",
        pointerEvents: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", pointerEvents: "auto" }}>
          <div>
            <h1 style={{ fontFamily: "Cinzel, serif", fontSize: 20, color: "#c9a472", margin: 0, lineHeight: 1.2 }}>
              🕌 Masjid Finder
            </h1>
            <p style={{ color: "#6e5e4c", fontSize: 12, margin: "2px 0 0" }}>
              {loading ? "Searching for mosques…" :
               locating ? "Getting your location…" :
               mosques.length > 0 ? `${mosques.length} mosques found nearby` :
               coords ? "No mosques found within 5km" :
               "Tap locate to find nearby mosques"}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {coords && (
              <button
                onClick={() => fetchMosques(coords.lat, coords.lng)}
                disabled={loading}
                style={{
                  background: "rgba(22,16,10,0.9)", border: "1px solid rgba(52,201,122,0.3)",
                  borderRadius: 10, padding: "8px 10px", color: "#6e5e4c", cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 4, fontSize: 12,
                }}
              >
                <RefreshCw size={13} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
                Refresh
              </button>
            )}
            <button
              onClick={requestLocation}
              disabled={locating}
              style={{
                background: locating ? "rgba(52,201,122,0.3)" : "#34c97a",
                border: "none", borderRadius: 10, padding: "8px 12px",
                color: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600,
              }}
            >
              <Locate size={13} />
              {locating ? "Locating…" : "Locate Me"}
            </button>
          </div>
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto", pointerEvents: "auto" }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "5px 12px", borderRadius: 20, fontSize: 11, whiteSpace: "nowrap", flexShrink: 0,
                border: filter === f ? "1px solid #34c97a" : "1px solid rgba(52,201,122,0.25)",
                background: filter === f ? "#34c97a" : "rgba(26,19,13,0.8)",
                color: filter === f ? "white" : "#6e5e4c", cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Location error overlay */}
      {locError && (
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          zIndex: 1100, background: "rgba(9,7,10,0.97)", border: "1px solid rgba(52,201,122,0.3)",
          borderRadius: 16, padding: "24px 20px", maxWidth: 300, textAlign: "center",
        }}>
          <AlertCircle size={36} style={{ color: "#c9a472", marginBottom: 12 }} />
          <p style={{ color: "#f0ece4", fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>{locError}</p>
          <button
            onClick={requestLocation}
            style={{
              background: "#34c97a", border: "none", borderRadius: 10, padding: "10px 24px",
              color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading spinner overlay */}
      {(loading || locating) && (
        <div style={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
          zIndex: 999, display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(52,201,122,0.3)",
            borderTop: "3px solid #34c97a", animation: "spin 0.8s linear infinite",
          }} />
          <p style={{ color: "#f0ece4", fontSize: 12, background: "rgba(9,7,10,0.8)", padding: "4px 12px", borderRadius: 8 }}>
            {locating ? "Getting your GPS location…" : "Finding mosques…"}
          </p>
        </div>
      )}

      {/* Full-screen Leaflet map */}
      <div ref={mapContainerRef} style={{ flex: 1, width: "100%", zIndex: 0 }} />

      {/* Locate Me FAB (bottom right, above sheet) */}
      {coords && (
        <button
          onClick={() => {
            if (mapRef.current && coords) {
              mapRef.current.flyTo([coords.lat, coords.lng], 15, { duration: 1 });
            }
          }}
          style={{
            position: "absolute", right: 16, bottom: sheetOpen ? 320 : 96, zIndex: 1001,
            width: 44, height: 44, borderRadius: "50%", background: "#09070A",
            border: "2px solid rgba(52,201,122,0.5)", color: "#34c97a",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(0,0,0,0.5)", cursor: "pointer", transition: "bottom 0.3s",
          }}
          title="Centre on my location"
        >
          <Navigation size={18} />
        </button>
      )}

      {/* Bottom sheet mosque list */}
      {mosques.length > 0 && (
        <div style={{
          position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 1002,
          background: "rgba(9,7,10,0.97)", borderTop: "1px solid rgba(52,201,122,0.25)",
          borderRadius: "20px 20px 0 0",
          transform: sheetOpen ? "translateY(0)" : "translateY(calc(100% - 56px))",
          transition: "transform 0.3s ease",
          maxHeight: "55vh",
          display: "flex", flexDirection: "column",
          paddingBottom: 80,
        }}>
          {/* Sheet handle */}
          <button
            onClick={() => setSheetOpen(p => !p)}
            style={{
              width: "100%", padding: "12px 16px", display: "flex", alignItems: "center",
              justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(52,201,122,0.4)" }} />
              <span style={{ color: "#c9a472", fontSize: 13, fontWeight: 700 }}>
                {filteredMosques.length} mosque{filteredMosques.length !== 1 ? "s" : ""}
                {filter !== "All" ? ` (${filter})` : " nearby"}
              </span>
            </div>
            {sheetOpen ? <ChevronDown size={16} color="#6e5e4c" /> : <ChevronUp size={16} color="#6e5e4c" />}
          </button>

          {/* Scrollable list */}
          <div style={{ overflowY: "auto", flex: 1, padding: "0 12px" }}>
            {/* Google Maps link */}
            {coords && (
              <a
                href={`https://www.google.com/maps/search/mosque/@${coords.lat},${coords.lng},15z`}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  width: "100%", padding: "8px 0", marginBottom: 8,
                  color: "#6e5e4c", fontSize: 12, textDecoration: "none",
                  borderBottom: "1px solid rgba(52,201,122,0.15)",
                }}
              >
                <ExternalLink size={12} /> Open in Google Maps
              </a>
            )}

            {filteredMosques.map((m, i) => (
              <div
                key={i}
                onClick={() => flyToMasjid(m)}
                style={{
                  background: selectedMasjid?.name === m.name ? "rgba(52,201,122,0.12)" : "rgba(26,19,13,0.6)",
                  border: selectedMasjid?.name === m.name ? "1px solid #34c97a" : "1px solid rgba(52,201,122,0.15)",
                  borderRadius: 14, padding: "12px", marginBottom: 8, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12,
                  transition: "background 0.2s, border-color 0.2s",
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: "50%", background: "rgba(52,201,122,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0,
                }}>🕌</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#f0ece4", lineHeight: 1.3 }}>{m.name}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                    <span style={{ fontSize: 11, color: "#6e5e4c" }}>📏 {m.distance} km</span>
                    {i === 0 && <span style={{ fontSize: 10, color: "#c9a472", fontWeight: 700 }}>NEAREST</span>}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); saveFavourite(m); }}
                    style={{
                      width: 32, height: 32, borderRadius: "50%", border: "none",
                      background: favourite?.name === m.name ? "rgba(255,215,0,0.15)" : "transparent",
                      color: favourite?.name === m.name ? "#c9a472" : "#6e5e4c",
                      cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                    title="Save as favourite"
                  >
                    <Star size={14} style={{ fill: favourite?.name === m.name ? "#c9a472" : "none" }} />
                  </button>
                  <a
                    href={m.mapsUrl || `https://maps.google.com/maps?daddr=${m.lat},${m.lng}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      width: 32, height: 32, borderRadius: "50%", border: "none",
                      background: "transparent", color: "#6e5e4c",
                      display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none",
                    }}
                    title="Get directions"
                  >
                    <Navigation size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .leaflet-container { background: #09070A !important; }
      `}</style>
    </div>
  );
};

export default MasjidFinderPage;

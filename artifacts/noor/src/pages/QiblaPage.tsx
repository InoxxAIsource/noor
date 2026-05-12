import React, { useState, useEffect } from "react";
import { Navigation } from "lucide-react";

const KAABA_LAT = 21.3891;
const KAABA_LNG = 39.8579;

function calcBearing(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLng = toRad(lng2 - lng1);
  const lat1R = toRad(lat1);
  const lat2R = toRad(lat2);
  const y = Math.sin(dLng) * Math.cos(lat2R);
  const x = Math.cos(lat1R) * Math.sin(lat2R) - Math.sin(lat1R) * Math.cos(lat2R) * Math.cos(dLng);
  const bearing = (Math.atan2(y, x) * 180) / Math.PI;
  return (bearing + 360) % 360;
}

function calcDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function bearingToCardinal(b: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(b / 45) % 8];
}

const QiblaPage: React.FC = () => {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [permError, setPermError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLoading(false);
      },
      () => {
        setPermError("Location permission denied. Please enable GPS.");
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      const alpha = (e as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading ?? e.alpha;
      if (alpha !== null) setDeviceHeading(alpha);
    };
    window.addEventListener("deviceorientation", handler, true);
    return () => window.removeEventListener("deviceorientation", handler, true);
  }, []);

  const bearing = coords ? calcBearing(coords.lat, coords.lng, KAABA_LAT, KAABA_LNG) : null;
  const distance = coords ? calcDistance(coords.lat, coords.lng, KAABA_LAT, KAABA_LNG) : null;
  const qiblaAngle = bearing !== null && deviceHeading !== null ? (bearing - deviceHeading + 360) % 360 : bearing;
  const displayAngle = qiblaAngle ?? 0;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col items-center">
      <div className="w-full sticky top-0 bg-[var(--bg)]/95 backdrop-blur-md pt-6 pb-3 px-4 border-b border-[var(--border)]">
        <h1 className="font-cinzel text-3xl text-[var(--gold)] text-center">Qibla Compass</h1>
        <p className="text-center text-[var(--muted)] text-sm mt-1">Direction of the Holy Kaaba</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 w-full max-w-sm">
        {loading && <p className="text-[var(--muted)]">Getting your location...</p>}
        {permError && (
          <div className="text-center space-y-3">
            <Navigation size={48} className="text-[var(--muted)] mx-auto" />
            <p className="text-[var(--muted)]">{permError}</p>
          </div>
        )}

        {coords && bearing !== null && (
          <div className="w-full space-y-8 flex flex-col items-center">
            <div className="relative w-72 h-72">
              <svg viewBox="0 0 300 300" className="w-full h-full">
                <circle cx="150" cy="150" r="140" fill="none" stroke="rgba(0,165,80,0.15)" strokeWidth="2" />
                <circle cx="150" cy="150" r="120" fill="none" stroke="rgba(0,165,80,0.1)" strokeWidth="1" />
                {["N","E","S","W"].map((dir, i) => {
                  const angle = i * 90;
                  const x = 150 + 130 * Math.sin((angle * Math.PI) / 180);
                  const y = 150 - 130 * Math.cos((angle * Math.PI) / 180);
                  return (
                    <text key={dir} x={x} y={y} textAnchor="middle" dominantBaseline="central"
                      fill={dir === "N" ? "#ffd700" : "rgba(200,232,200,0.6)"} fontSize="16" fontWeight="bold" fontFamily="Cinzel">
                      {dir}
                    </text>
                  );
                })}
                <g transform={`rotate(${displayAngle}, 150, 150)`}>
                  <polygon points="150,20 143,150 157,150" fill="#00a550" opacity="0.9" />
                  <polygon points="150,280 143,150 157,150" fill="rgba(0,165,80,0.3)" />
                  <circle cx="150" cy="20" r="8" fill="#00a550" />
                  <text x="150" y="23" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="10">🕋</text>
                </g>
                <circle cx="150" cy="150" r="12" fill="var(--bg)" stroke="var(--green)" strokeWidth="2" />
              </svg>
            </div>

            <div className="text-center space-y-2">
              <div className="font-cinzel text-5xl text-[var(--gold)]">{Math.round(bearing)}°</div>
              <div className="text-xl text-[var(--green)]">{bearingToCardinal(bearing)}</div>
              {deviceHeading === null && (
                <p className="text-xs text-[var(--muted)] italic">Compass sensor unavailable, showing static bearing</p>
              )}
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 w-full text-center">
              <p className="text-[var(--muted)] text-sm">Distance to Kaaba</p>
              <p className="font-cinzel text-3xl text-[var(--gold)] mt-1">{distance?.toLocaleString()} km</p>
              <p className="text-xs text-[var(--muted)] mt-1">Makkah al-Mukarramah</p>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-3 w-full text-center">
              <p className="text-xs text-[var(--muted)]">Your coordinates</p>
              <p className="text-sm text-[var(--text)]">{coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QiblaPage;

interface DeenAppLogoProps {
  size?: number;
  showText?: boolean;
  showTagline?: boolean;
}

export default function DeenAppLogo({ size = 80, showText = true, showTagline = false }: DeenAppLogoProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", filter: "drop-shadow(0 0 18px rgba(255,215,0,0.25))" }}
      >
        <rect width="180" height="180" rx="40" fill="#001a00"/>
        <rect width="180" height="180" rx="40" fill="none" stroke="rgba(255,215,0,0.12)" strokeWidth="3"/>
        <circle cx="82" cy="95" r="60" fill="#ffd700"/>
        <circle cx="108" cy="80" r="52" fill="#001a00"/>
        <g transform="translate(130,42)">
          <polygon
            points="0,-9 2.12,-2.93 8.56,-2.78 3.42,1.12 5.29,7.28 0,3.93 -5.29,7.28 -3.42,1.12 -8.56,-2.78 -2.12,-2.93"
            fill="#ffd700"
          />
        </g>
        <circle cx="82" cy="95" r="60" fill="none" stroke="rgba(255,215,0,0.08)" strokeWidth="1.5"/>
      </svg>

      {showText && (
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "Cinzel, serif",
            fontSize: size * 0.3,
            fontWeight: 700,
            letterSpacing: "0.18em",
            background: "linear-gradient(135deg, #ffd700 0%, #00a550 60%, #ffd700 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: 1,
          }}>
            DEEN<span style={{
              fontWeight: 400,
              WebkitTextFillColor: "transparent",
            }}>APP</span>
          </div>
          {showTagline && (
            <div style={{
              fontFamily: "system-ui, sans-serif",
              fontSize: size * 0.13,
              color: "#4a7a4a",
              letterSpacing: "0.08em",
              marginTop: 4,
            }}>
              Remember Allah. Every day.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

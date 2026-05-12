interface DeenAppLogoProps {
  size?: number;
  showText?: boolean;
  showTagline?: boolean;
}

export default function DeenAppLogo({ size = 80, showText = true, showTagline = false }: DeenAppLogoProps) {
  const iconSize = size;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      {/* Icon mark */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", filter: "drop-shadow(0 0 20px rgba(52,201,122,0.2))" }}
      >
        <rect width="180" height="180" rx="38" fill="#0d1411"/>
        <rect width="180" height="180" rx="38" fill="none" stroke="rgba(52,201,122,0.12)" strokeWidth="2"/>
        <circle cx="88" cy="92" r="52" fill="#34c97a" opacity="0.95"/>
        <circle cx="112" cy="78" r="46" fill="#0d1411"/>
        <circle cx="130" cy="58" r="6" fill="#34c97a"/>
        <circle cx="88" cy="92" r="52" fill="none" stroke="rgba(52,201,122,0.08)" strokeWidth="1.5"/>
      </svg>

      {showText && (
        <div style={{ textAlign: "center" }}>
          <div style={{
            fontFamily: "Inter, DM Sans, system-ui, sans-serif",
            fontSize: size * 0.28,
            fontWeight: 800,
            letterSpacing: "-0.01em",
            color: "#eaf4ee",
            lineHeight: 1,
          }}>
            <span style={{ color: "#34c97a" }}>My</span>
            <span>Tazki</span>
          </div>
          {showTagline && (
            <div style={{
              fontFamily: "Inter, system-ui, sans-serif",
              fontSize: size * 0.12,
              color: "#6a9878",
              letterSpacing: "0.02em",
              marginTop: 5,
              fontWeight: 400,
            }}>
              Grow Spiritually Every Day
            </div>
          )}
        </div>
      )}
    </div>
  );
}

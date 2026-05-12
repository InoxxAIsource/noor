export function CalmDashboard() {
  return (
    <div style={{
      background: "#0d1411",
      minHeight: "100vh",
      color: "#eaf4ee",
      fontFamily: "Inter, sans-serif",
      overflowY: "auto",
      paddingBottom: 72,
      fontSize: 14,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 0" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#34c97a", letterSpacing: 3 }}>MYTAZKI</div>
        <div style={{ display: "flex", gap: 18, color: "#6a9878", fontSize: 17 }}>
          <span>🔍</span><span>🔔</span><span>☰</span>
        </div>
      </div>
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: "#6a9878", letterSpacing: 1, marginBottom: 6 }}>12 Dhul Qa'dah 1447 AH</div>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4, lineHeight: 1.3, fontFamily: "DM Sans, sans-serif" }}>Good afternoon, Ahmed</h1>
          <p style={{ fontSize: 13, color: "#6a9878", margin: 0 }}>Stay grounded in Allah's remembrance.</p>
        </div>
        <div style={{ background: "linear-gradient(135deg, #152019 0%, #1c2d21 100%)", border: "1px solid rgba(52,201,122,0.3)", borderRadius: 20, padding: 20, marginBottom: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 12, right: 16, fontSize: 32, opacity: 0.12 }}>🌿</div>
          <div style={{ fontSize: 10, color: "#34c97a", textTransform: "uppercase", letterSpacing: 2, marginBottom: 8 }}>Peaceful morning</div>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4, fontFamily: "DM Sans, sans-serif" }}>Begin your day with intention</div>
          <div style={{ fontSize: 12, color: "#6a9878", marginBottom: 16 }}>A 3-minute guided morning ritual</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#34c97a", color: "#0d1411", borderRadius: 20, padding: "8px 16px", fontSize: 13, fontWeight: 600 }}>Begin now ›</div>
        </div>
        <div style={{ background: "#152019", border: "1px solid rgba(184,148,106,0.2)", borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: "#b8946a", marginBottom: 10 }}>How are you feeling?</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {['peaceful','grateful','anxious','distracted','overwhelmed','tired'].map(em => <button key={em} style={{ background: "#1c2d21", border: "1px solid rgba(52,201,122,0.15)", borderRadius: 20, padding: "6px 10px", cursor: "pointer", fontSize: 12, color: "#eaf4ee" }}>{em}</button>)}
          </div>
        </div>
        <div style={{ background: "#152019", border: "1px solid rgba(52,201,122,0.15)", borderRadius: 16, padding: 16, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, color: "#6a9878", textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>Next prayer</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: "#34c97a" }}>Asr</div>
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, color: "#b8946a", fontFamily: "monospace" }}>1:22:47</div>
        </div>
        <div style={{ background: "#152019", border: "1px solid rgba(52,201,122,0.15)", borderRadius: 16, padding: 16, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: 28, fontWeight: 700, color: "#b8946a", fontFamily: "DM Sans, sans-serif", lineHeight: 1 }}>7</div><div style={{ fontSize: 12, color: "#6a9878", marginTop: 4 }}>7 days of ibadah</div></div>
          <div style={{ textAlign: "right" }}><div style={{ display: "flex", gap: 5, justifyContent: "flex-end", marginBottom: 6 }}>{Array(7).fill(null).map((_, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < 5 ? '#34c97a' : '#2a3830' }} />)}</div><div style={{ fontSize: 11, color: "#6a9878" }}>5 of 5 this week</div></div>
        </div>
        <div style={{ fontSize: 10, color: "#6a9878", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Today's focus</div>
        <div style={{ background: "#152019", border: "1px solid rgba(52,201,122,0.15)", borderRadius: 16, padding: 16, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Morning Azkar & Reflection</div><div style={{ fontSize: 12, color: "#6a9878" }}>12 min · AZKAR</div></div><div style={{ background: "#34c97a", color: "#0d1411", borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>▶</div></div>
        <div style={{ background: "#152019", border: "1px solid rgba(184,148,106,0.15)", borderRadius: 16, padding: 16, marginBottom: 16, textAlign: "center" }}><div style={{ fontSize: 10, color: "#6a9878", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Name of Allah today</div><div style={{ fontFamily: "serif", fontSize: 24, color: "#b8946a", marginBottom: 6 }}>الرَّحِيم</div><div style={{ fontSize: 13, color: "#eaf4ee" }}>Ar-Raheem</div><div style={{ fontSize: 12, color: "#6a9878", marginTop: 2 }}>The Most Merciful</div></div>
        <div style={{ fontSize: 10, color: "#6a9878", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Quick dhikr</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 24 }}><div style={{ flex: 1, background: "#152019", border: "1px solid rgba(52,201,122,0.15)", borderRadius: 12, padding: "10px 6px", textAlign: "center", cursor: "pointer" }}><div style={{ fontFamily: "serif", fontSize: 14, color: "#b8946a" }}>سُبْحَانَ اللَّهِ</div><div style={{ fontSize: 10, color: "#6a9878", marginTop: 4 }}>SubhanAllah</div></div><div style={{ flex: 1, background: "#152019", border: "1px solid rgba(52,201,122,0.15)", borderRadius: 12, padding: "10px 6px", textAlign: "center", cursor: "pointer" }}><div style={{ fontFamily: "serif", fontSize: 14, color: "#b8946a" }}>اَلْحَمْدُ لِلَّهِ</div><div style={{ fontSize: 10, color: "#6a9878", marginTop: 4 }}>Alhamdulillah</div></div><div style={{ flex: 1, background: "#152019", border: "1px solid rgba(52,201,122,0.15)", borderRadius: 12, padding: "10px 6px", textAlign: "center", cursor: "pointer" }}><div style={{ fontFamily: "serif", fontSize: 14, color: "#b8946a" }}>اللَّهُ أَكْبَرُ</div><div style={{ fontSize: 10, color: "#6a9878", marginTop: 4 }}>Allahu Akbar</div></div></div>
        <div style={{ background: "#152019", border: "1px solid rgba(184,148,106,0.15)", borderRadius: 16, padding: "14px 18px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}><div><div style={{ fontSize: 14, fontWeight: 500, color: "#b8946a" }}>What do you need today?</div><div style={{ fontSize: 12, color: "#6a9878", marginTop: 2 }}>Find the right dua for this moment</div></div><span style={{ color: "#6a9878" }}>›</span></div>
        <div style={{ fontSize: 10, color: "#6a9878", textTransform: "uppercase", letterSpacing: 2, marginBottom: 10 }}>Islamic tools</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {['Quran','Qibla','Masjid','Zakat','Calendar','99 Names','Farz','Wudu','Salah','Sadqa','Qurbani','Names'].map(label => (
            <div key={label} style={{ background: "#152019", border: "1px solid rgba(52,201,122,0.1)", borderRadius: 14, padding: "12px 6px", textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: 18, marginBottom: 5 }}>•</div>
              <div style={{ fontSize: 10, color: "#6a9878" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

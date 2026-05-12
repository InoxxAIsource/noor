import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Compass, Play, Heart, User } from "lucide-react";

const BottomNav: React.FC = () => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 8px",
        height: 64,
      }}
    >
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 flex-1 py-2 text-xs transition-colors ${isActive ? "text-[var(--green)]" : "text-[var(--muted)]"}`
        }
      >
        <Home size={22} />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/prayer-times"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 flex-1 py-2 text-xs transition-colors ${isActive ? "text-[var(--green)]" : "text-[var(--muted)]"}`
        }
      >
        <Compass size={22} />
        <span>Salah</span>
      </NavLink>

      {/* Centre — Sessions (primary action) */}
      <NavLink
        to="/sessions"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 flex-1 py-2 text-xs transition-colors ${isActive ? "text-[var(--green)]" : "text-[var(--muted)]"}`
        }
        style={{ position: "relative" }}
      >
        {({ isActive }) => (
          <>
            <div style={{
              width: 46, height: 46, borderRadius: "50%",
              background: isActive ? "var(--green)" : "linear-gradient(135deg, var(--green), #1a7a3a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(52,201,122,0.45)",
              marginTop: -18, border: "3px solid var(--bg)",
            }}>
              <Play size={18} color="#0d1411" fill="#0d1411" />
            </div>
            <span style={{ color: isActive ? "var(--green)" : "var(--muted)" }}>Sessions</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/companion"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 flex-1 py-2 text-xs transition-colors ${isActive ? "text-[var(--green)]" : "text-[var(--muted)]"}`
        }
      >
        <span style={{ fontSize: 22, lineHeight: 1 }}>☪️</span>
        <span>Guide</span>
      </NavLink>

      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 flex-1 py-2 text-xs transition-colors ${isActive ? "text-[var(--green)]" : "text-[var(--muted)]"}`
        }
      >
        <User size={22} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;

import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Compass, BookOpen, Heart, User } from "lucide-react";

const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--surface)] border-t border-[var(--border)] z-50 px-2 py-3 flex justify-between items-center text-xs">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 w-1/5 ${isActive ? "text-[var(--green)]" : "text-[var(--muted)]"}`
        }
      >
        <Home size={24} />
        <span>Home</span>
      </NavLink>
      <NavLink
        to="/prayer-times"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 w-1/5 ${isActive ? "text-[var(--green)]" : "text-[var(--muted)]"}`
        }
      >
        <Compass size={24} />
        <span>Salah</span>
      </NavLink>
      <NavLink
        to="/quran"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 w-1/5 ${isActive ? "text-[var(--green)]" : "text-[var(--muted)]"}`
        }
      >
        <BookOpen size={24} />
        <span>Quran</span>
      </NavLink>
      <NavLink
        to="/duas"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 w-1/5 ${isActive ? "text-[var(--green)]" : "text-[var(--muted)]"}`
        }
      >
        <Heart size={24} />
        <span>Duas</span>
      </NavLink>
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 w-1/5 ${isActive ? "text-[var(--green)]" : "text-[var(--muted)]"}`
        }
      >
        <User size={24} />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;

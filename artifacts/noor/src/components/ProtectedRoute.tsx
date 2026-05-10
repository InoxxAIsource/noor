import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import BottomNav from "./BottomNav";
import AIGuide from "./AIGuide";

export const ProtectedRoute: React.FC = () => {
  const { isLoggedIn, user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-gold font-cinzel text-xl">Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user && !user.onboardingComplete && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  const hideBottomNav = location.pathname === "/onboarding";
  const hidePlayer = location.pathname.startsWith("/player/");

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideBottomNav && <BottomNav />}
      {!hideBottomNav && !hidePlayer && <AIGuide />}
    </div>
  );
};

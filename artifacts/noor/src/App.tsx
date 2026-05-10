import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import OnboardingPage from "@/pages/OnboardingPage";
import HomePage from "@/pages/HomePage";
import PrayerTimesPage from "@/pages/PrayerTimesPage";
import DuasPage from "@/pages/DuasPage";
import NamesPage from "@/pages/NamesPage";
import PlayerPage from "@/pages/PlayerPage";
import TasbihPage from "@/pages/TasbihPage";
import ProfilePage from "@/pages/ProfilePage";
import QuranPage from "@/pages/QuranPage";
import MoodPage from "@/pages/MoodPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/onboarding", element: <OnboardingPage /> },
      { path: "/home", element: <HomePage /> },
      { path: "/prayer-times", element: <PrayerTimesPage /> },
      { path: "/duas", element: <DuasPage /> },
      { path: "/names", element: <NamesPage /> },
      { path: "/player/:id", element: <PlayerPage /> },
      { path: "/tasbih", element: <TasbihPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/quran", element: <QuranPage /> },
      { path: "/mood", element: <MoodPage /> },
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
], {
  basename: import.meta.env.BASE_URL.replace(/\/$/, "")
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
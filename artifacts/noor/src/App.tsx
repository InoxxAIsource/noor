import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import OnboardingPage from "@/pages/OnboardingPage";
import HomePage from "@/pages/HomePage";
import PrayerTimesPage from "@/pages/PrayerTimesPage";
import DuasPage from "@/pages/DuasPage";
import NamesPage from "@/pages/NamesPage";
import PlayerPage from "@/pages/PlayerPage";
import SessionsPage from "@/pages/SessionsPage";
import TasbihPage from "@/pages/TasbihPage";
import ProfilePage from "@/pages/ProfilePage";
import QuranPage from "@/pages/QuranPage";
import QuranSurahPage from "@/pages/QuranSurahPage";
import MoodPage from "@/pages/MoodPage";
import NamesOfAllahPage from "@/pages/NamesOfAllahPage";
import QiblaPage from "@/pages/QiblaPage";
import MasjidFinderPage from "@/pages/MasjidFinderPage";
import ZakatCalculatorPage from "@/pages/ZakatCalculatorPage";
import IslamicCalendarPage from "@/pages/IslamicCalendarPage";
import QurbaniGuidePage from "@/pages/QurbaniGuidePage";
import FarzGuidePage from "@/pages/FarzGuidePage";
import SadqaGuidePage from "@/pages/SadqaGuidePage";
import WuduGuidePage from "@/pages/WuduGuidePage";
import SalahGuidePage from "@/pages/SalahGuidePage";
import RoomsPage from "@/pages/RoomsPage";
import RoomPage from "@/pages/RoomPage";
import JournalPage from "@/pages/JournalPage";
import GiftPage from "@/pages/GiftPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

const router = createBrowserRouter(
  [
    { path: "/", element: <Navigate to="/home" replace /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/register", element: <RegisterPage /> },
    { path: "/gift/:token", element: <GiftPage /> },
    {
      element: <ProtectedRoute />,
      children: [
        { path: "/onboarding", element: <OnboardingPage /> },
        { path: "/home", element: <HomePage /> },
        { path: "/prayer-times", element: <PrayerTimesPage /> },
        { path: "/duas", element: <DuasPage /> },
        { path: "/names", element: <NamesPage /> },
        { path: "/player/:id", element: <PlayerPage /> },
        { path: "/sessions", element: <SessionsPage /> },
        { path: "/tasbih", element: <TasbihPage /> },
        { path: "/profile", element: <ProfilePage /> },
        { path: "/journal", element: <JournalPage /> },
        { path: "/rooms", element: <RoomsPage /> },
        { path: "/room/:code", element: <RoomPage /> },
        { path: "/quran", element: <QuranPage /> },
        { path: "/quran/:number", element: <QuranSurahPage /> },
        { path: "/mood", element: <MoodPage /> },
        { path: "/99-names", element: <NamesOfAllahPage /> },
        { path: "/qibla", element: <QiblaPage /> },
        { path: "/masjid-finder", element: <MasjidFinderPage /> },
        { path: "/zakat-calculator", element: <ZakatCalculatorPage /> },
        { path: "/islamic-calendar", element: <IslamicCalendarPage /> },
        { path: "/qurbani-guide", element: <QurbaniGuidePage /> },
        { path: "/farz-guide", element: <FarzGuidePage /> },
        { path: "/sadqa-guide", element: <SadqaGuidePage /> },
        { path: "/wudu-guide", element: <WuduGuidePage /> },
        { path: "/salah-guide", element: <SalahGuidePage /> },
      ],
    },
    { path: "*", element: <NotFound /> },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, "") }
);

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

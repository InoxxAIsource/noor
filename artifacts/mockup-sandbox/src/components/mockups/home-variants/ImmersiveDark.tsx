import { useState, useEffect } from "react";

const PRAYERS = [
  { name: "Fajr", arabic: "الفجر", time: "05:12", done: true },
  { name: "Dhuhr", arabic: "الظهر", time: "13:08", done: true },
  { name: "Asr", arabic: "العصر", time: "16:45", done: false, next: true },
  { name: "Maghrib", arabic: "المغرب", time: "19:32", done: false },
  { name: "Isha", arabic: "العشاء", time: "21:05", done: false },
];

const TOOLS = [
  { icon: "📖", label: "Quran" },
  { icon: "🧭", label: "Qibla" },
  { icon: "📿", label: "Tasbih" },
  { icon: "🤲", label: "Duas" },
  { icon: "🕌", label: "Masjid" },
  { icon: "📊", label: "Zakat" },
];

export function ImmersiveDark() {
  return null;
  return null;
}

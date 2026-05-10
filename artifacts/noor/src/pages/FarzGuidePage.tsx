import React, { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";

const SECTIONS = [
  {
    title: "The Five Pillars of Islam",
    content: [
      { heading: "1. Shahadah — Declaration of Faith", body: "Bearing witness that there is no god but Allah and that Muhammad ﷺ is His messenger. This is the foundation of all Islamic practice." },
      { heading: "2. Salah — Prayer", body: "Five daily prayers are obligatory: Fajr (dawn), Dhuhr (midday), Asr (afternoon), Maghrib (sunset), and Isha (night). Each salah has a specific number of rak'at." },
      { heading: "3. Zakat — Charity", body: "2.5% of savings above nisab (87.48g of gold) must be given to eligible recipients annually. It purifies wealth and helps those in need." },
      { heading: "4. Sawm — Fasting", body: "Fasting during the month of Ramadan from Fajr to Maghrib — abstaining from food, drink, and intimate relations. It develops taqwa (God-consciousness)." },
      { heading: "5. Hajj — Pilgrimage", body: "Once in a lifetime, every Muslim who is physically and financially able must perform Hajj to Makkah during the month of Dhul Hijjah." },
    ],
  },
  {
    title: "Farz (Obligatory Acts) of Salah",
    content: [
      { heading: "7 Conditions (Shuroot)", body: "1. Islam\n2. Sanity\n3. Puberty\n4. Cleanliness (purity from hadath)\n5. Purity of clothing and place\n6. Covering awrah\n7. Facing Qibla" },
      { heading: "7 Pillars Within Salah", body: "1. Niyyah (intention)\n2. Takbir al-Ihram (opening Allahu Akbar)\n3. Qiyam (standing)\n4. Qira'at (recitation of Quran)\n5. Ruku' (bowing)\n6. Sujud (prostration — 2 per rak'at)\n7. Qa'dah Akhirah (final sitting)" },
    ],
  },
  {
    title: "Farz of Wudu, Ghusl & Tayammum",
    content: [
      { heading: "Farz of Wudu (4 acts)", body: "1. Washing the face once\n2. Washing both arms up to and including the elbows\n3. Wiping 1/4 of the head\n4. Washing both feet up to and including the ankles" },
      { heading: "Farz of Ghusl (3 acts)", body: "1. Rinsing the mouth thoroughly\n2. Sniffing water into the nostrils\n3. Washing the entire body — no part should remain dry" },
      { heading: "Farz of Tayammum (3 acts)", body: "1. Niyyah\n2. Wiping the face with clean earth/dust\n3. Wiping both arms up to and including the elbows" },
    ],
  },
  {
    title: "40 Daily Sunnahs of the Prophet ﷺ",
    content: [
      { heading: "Morning", body: "Wake up early • Use miswak • Read morning adhkar • Begin with Bismillah" },
      { heading: "Eating & Drinking", body: "Say Bismillah • Eat with right hand • Drink in 3 sips • Say Alhamdulillah after • Don't blow into drink" },
      { heading: "Greetings", body: "Give Salam • Return Salam • Shake hands warmly • Visit the sick" },
      { heading: "Personal Conduct", body: "Enter with right foot • Remove shoes at door • Smile • Speak truthfully • Keep promises" },
      { heading: "Evening", body: "Read evening adhkar • Sleep on right side • Say Bismillah before sleep • Recite Ayatul Kursi" },
    ],
  },
  {
    title: "Janazah (Funeral) Guide",
    content: [
      { heading: "Ghusl of the Deceased", body: "Wash the body an odd number of times (minimum 3). Use water with sidr (lote tree leaves). Shroud in white cloth (kafan) — 3 pieces for men, 5 for women." },
      { heading: "Salat ul Janazah", body: "4 takbeers, no ruku or sujud:\n1st: Surah Fatiha\n2nd: Salawat on the Prophet\n3rd & 4th: Dua for the deceased\nEnd with salam on both sides" },
      { heading: "Burial", body: "Bury facing Qibla. Say: 'Bismillah wa 'ala millati rasulillah'. No elaborate grave structures. Men lower the body. Women do not attend the grave." },
    ],
  },
  {
    title: "Aqiqah Guide",
    content: [
      { heading: "What is Aqiqah?", body: "Sunnah to slaughter an animal on the 7th day after the birth of a child. 2 animals for a boy, 1 for a girl. The child's head is shaved and the weight of hair in silver is given as charity." },
      { heading: "Naming the Child", body: "Choose a good Islamic name. Best names: Abdullah and AbdurRahman. Names of prophets are also recommended. Name on the 7th day." },
    ],
  },
  {
    title: "Nikah Guide",
    content: [
      { heading: "Pillars of Nikah", body: "1. Proposal (Ijab) and acceptance (Qabul)\n2. Two Muslim male witnesses\n3. Wali (guardian) for the bride\n4. Mahr (dowry) — must be agreed upon" },
      { heading: "Sunnah Acts", body: "Khutbah before nikah • Announce the marriage • Walima (wedding feast) within 7 days — 1 day is sunnah" },
    ],
  },
  {
    title: "Halal & Haram Reference",
    content: [
      { heading: "Foods — Halal", body: "All vegetables and fruits • Fish (with or without scales) • Meat of animals slaughtered with Bismillah • Dairy products • Eggs from halal birds" },
      { heading: "Foods — Haram", body: "Pork and pork products • Alcohol and intoxicants • Blood • Dead animals (not slaughtered) • Animals slaughtered for other than Allah • Carnivorous animals and birds of prey" },
      { heading: "Business — Halal vs Haram", body: "Haram: Riba (interest) • Gambling • Fraud • Bribery • Selling forbidden goods\nHalal: Trade • Hiring services • Partnerships with fair terms" },
    ],
  },
];

const FarzGuidePage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<number | null>(0);

  const filtered = SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.content.some(
        (c) =>
          c.heading.toLowerCase().includes(search.toLowerCase()) ||
          c.body.toLowerCase().includes(search.toLowerCase())
      )
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-md pt-6 pb-3 px-4 border-b border-[var(--border)] space-y-3">
        <h1 className="font-cinzel text-3xl text-[var(--gold)] text-center">Farz Guide</h1>
        <p className="text-center text-xs text-[var(--muted)]">Islamic obligations & rulings reference</p>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" size={18} />
          <Input
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--surface)] border-[var(--border)] pl-10 py-5 rounded-xl"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filtered.map((section, i) => (
          <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-5 py-4 text-left"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="font-semibold text-[var(--text)]">{section.title}</span>
              {open === i ? <ChevronUp size={18} className="text-[var(--gold)]" /> : <ChevronDown size={18} className="text-[var(--muted)]" />}
            </button>
            {open === i && (
              <div className="border-t border-[var(--border)] divide-y divide-[var(--border)]">
                {section.content.map((c, j) => (
                  <div key={j} className="px-5 py-4">
                    <h3 className="font-semibold text-[var(--green)] text-sm mb-2">{c.heading}</h3>
                    <p className="text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">{c.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-[var(--muted)]">No results found.</div>
        )}
      </div>
    </div>
  );
};

export default FarzGuidePage;

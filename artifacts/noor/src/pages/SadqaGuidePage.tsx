import React, { useState } from "react";
import { Heart } from "lucide-react";
import { Input } from "@/components/ui/input";

const DAILY_SADQA = [
  "Smile at someone, the Prophet ﷺ said a smile is sadqa",
  "Remove something harmful from the path of others",
  "Say a kind word to a family member",
  "Help someone carry their load",
  "Share knowledge that benefits another Muslim",
  "Make dua for a fellow Muslim in their absence",
  "Feed a hungry person or animal",
  "Plant a tree or water a plant",
  "Teach a child something beneficial",
  "Visit a sick person",
];

const todaySadqa = DAILY_SADQA[new Date().getDay() % DAILY_SADQA.length];

const SadqaGuidePage: React.FC = () => {
  const [familySize, setFamilySize] = useState("1");
  const fitranaPerPerson = 70;
  const total = parseInt(familySize || "1", 10) * fitranaPerPerson;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-md pt-6 pb-3 px-4 border-b border-[var(--border)]">
        <h1 className="font-cinzel text-3xl text-[var(--gold)] text-center">Sadqa Guide</h1>
        <p className="text-center text-[var(--muted)] text-sm mt-1">The joy of giving for Allah's sake</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        <div className="bg-[var(--green)]/10 border border-[var(--green)]/30 rounded-2xl p-5 text-center">
          <Heart size={32} className="text-[var(--green)] mx-auto mb-3" />
          <p className="text-xs text-[var(--gold)] uppercase tracking-widest font-cinzel mb-2">Today's Sadqa</p>
          <p className="text-[var(--text)] leading-relaxed font-medium">{todaySadqa}</p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-3">
          <h2 className="font-cinzel text-lg text-[var(--gold)]">1. What is Sadqa?</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">Sadqa is voluntary charity given for the sake of Allah ﷻ. Unlike Zakat, it is not obligatory, but its rewards are immense. The Prophet ﷺ said: <em className="text-[var(--text)]">"Sadqa extinguishes sin as water extinguishes fire."</em> (Tirmidhi)</p>
          <p className="text-sm text-[var(--muted)] leading-relaxed">Difference from Zakat: Zakat is an obligatory annual payment of 2.5% on qualifying wealth. Sadqa is voluntary and can be given at any time, in any amount, to anyone.</p>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-3">
          <h2 className="font-cinzel text-lg text-[var(--gold)]">2. Sadqa Jariyah, Ongoing Reward</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed mb-3">The Prophet ﷺ said: <em className="text-[var(--text)]">"When a person dies, all their deeds end except three: ongoing sadqa, beneficial knowledge, or a righteous child who prays for them."</em> (Muslim)</p>
          {[
            { emoji: "💧", title: "Build or fund a well", desc: "Every sip of water gives you ongoing reward" },
            { emoji: "🕌", title: "Contribute to a mosque", desc: "Every salah prayed gives you reward" },
            { emoji: "📖", title: "Teach or sponsor education", desc: "Every application of knowledge rewards you" },
            { emoji: "🌳", title: "Plant a tree", desc: "Every fruit, shade, and bird's rest is sadqa" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 bg-[var(--card)] rounded-xl p-3">
              <span className="text-2xl">{item.emoji}</span>
              <div>
                <p className="font-semibold text-sm text-[var(--text)]">{item.title}</p>
                <p className="text-xs text-[var(--muted)]">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-3">
          <h2 className="font-cinzel text-lg text-[var(--gold)]">3. Sadqa ul Fitr (Fitrana)</h2>
          <p className="text-sm text-[var(--muted)] leading-relaxed">Fitrana is obligatory sadqa given before Eid ul Fitr prayer. It must be given on behalf of every family member.</p>
          <div className="bg-[var(--card)] rounded-xl p-4 space-y-3">
            <div>
              <label className="text-xs text-[var(--muted)] block mb-1">Number of family members</label>
              <Input
                type="number"
                min="1"
                value={familySize}
                onChange={(e) => setFamilySize(e.target.value)}
                className="bg-[var(--surface)] border-[var(--border)] w-full"
              />
            </div>
            <div className="flex justify-between items-center py-2 border-t border-[var(--border)]">
              <span className="text-sm text-[var(--muted)]">Amount per person</span>
              <span className="text-[var(--gold)] font-semibold">₹{fitranaPerPerson}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[var(--text)]">Total Fitrana due</span>
              <span className="font-cinzel text-2xl text-[var(--gold)]">₹{total}</span>
            </div>
            <p className="text-xs text-[var(--muted)] text-center italic">Must be given before Eid ul Fitr salah</p>
          </div>
        </div>

        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-3">
          <h2 className="font-cinzel text-lg text-[var(--gold)]">4. Non-Financial Sadqa</h2>
          <p className="text-sm text-[var(--text)] italic mb-3">"Your smile for your brother is sadqa. Commanding good and forbidding evil is sadqa. Your guiding a man in a land of no guide is sadqa. Your helping a man with bad eyesight is sadqa. Removing a stone, thorn or bone from the road is sadqa. Your pouring water from your bucket into a brother's bucket is sadqa."</p>
          <p className="text-xs text-[var(--muted)] text-right">- Tirmidhi</p>
        </div>
      </div>
    </div>
  );
};

export default SadqaGuidePage;

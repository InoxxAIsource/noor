import React, { useState, useEffect } from "react";
import { Calculator, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

const NISAB_GOLD_GRAMS = 87.48;

const ZakatCalculatorPage: React.FC = () => {
  const [goldPriceINR, setGoldPriceINR] = useState(6200);
  const [fields, setFields] = useState({
    cash: "", gold: "", goldGrams: "", silver: "",
    inventory: "", investments: "", owedToYou: "", debts: "",
  });
  const [result, setResult] = useState<{ total: number; nisab: number; due: number; obligatory: boolean } | null>(null);

  useEffect(() => {
    fetch("/api/zakat/gold-price")
      .then((r) => r.json())
      .then((d) => { if (d.pricePerGramINR) setGoldPriceINR(d.pricePerGramINR); })
      .catch(() => {});
  }, []);

  const parse = (v: string) => parseFloat(v.replace(/,/g, "")) || 0;

  const calculate = () => {
    const goldValue = fields.goldGrams
      ? parse(fields.goldGrams) * goldPriceINR
      : parse(fields.gold);
    const total =
      parse(fields.cash) + goldValue + parse(fields.silver) +
      parse(fields.inventory) + parse(fields.investments) +
      parse(fields.owedToYou) - parse(fields.debts);
    const nisab = NISAB_GOLD_GRAMS * goldPriceINR;
    const obligatory = total >= nisab;
    const due = obligatory ? total * 0.025 : 0;
    setResult({ total, nisab, due, obligatory });
    window.scrollTo({ top: 999999, behavior: "smooth" });
  };

  const fmt = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

  const fieldDefs = [
    { key: "cash", label: "Cash (bank + hand)", placeholder: "e.g. 50000" },
    { key: "gold", label: `Gold value (current price: ${fmt(goldPriceINR)}/g)`, placeholder: "Total gold value in ₹" },
    { key: "goldGrams", label: "OR: Gold in grams", placeholder: "We'll calculate the value" },
    { key: "silver", label: "Silver value", placeholder: "₹" },
    { key: "inventory", label: "Business inventory", placeholder: "₹" },
    { key: "investments", label: "Investments / shares", placeholder: "₹" },
    { key: "owedToYou", label: "Money owed to you", placeholder: "₹" },
    { key: "debts", label: "Minus: your debts", placeholder: "₹ (will be deducted)" },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pb-24 flex flex-col">
      <div className="sticky top-0 z-10 bg-[var(--bg)]/95 backdrop-blur-md pt-6 pb-3 px-4 border-b border-[var(--border)]">
        <h1 className="font-cinzel text-3xl text-[var(--gold)] text-center">Zakat Calculator</h1>
        <p className="text-center text-[var(--muted)] text-sm mt-1">2.5% of zakatable wealth above nisab</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-2 text-[var(--gold)]">
            <Calculator size={20} />
            <span className="font-semibold">Your Assets</span>
          </div>
          {fieldDefs.map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs text-[var(--muted)] block mb-1">{label}</label>
              <Input
                value={fields[key]}
                onChange={(e) => setFields((p) => ({ ...p, [key]: e.target.value }))}
                placeholder={placeholder}
                className="bg-[var(--card)] border-[var(--border)]"
                type="number"
                min="0"
              />
            </div>
          ))}
        </div>

        <button
          onClick={calculate}
          className="w-full py-4 rounded-2xl bg-[var(--green)] text-white font-cinzel text-lg font-semibold hover:bg-[var(--green)]/90 transition-colors"
        >
          Calculate Zakat
        </button>

        {result && (
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-5 space-y-4">
            <div className={`flex flex-col items-center py-4 rounded-xl border-2 ${
              result.obligatory
                ? "border-[var(--gold)] bg-[var(--gold)]/10"
                : "border-[var(--muted)]/30 bg-[var(--card)]"
            }`}>
              {result.obligatory ? (
                <>
                  <CheckCircle size={48} className="text-[var(--gold)] mb-2" />
                  <p className="font-cinzel text-xl text-[var(--gold)]">Zakat is obligatory on you</p>
                </>
              ) : (
                <>
                  <XCircle size={48} className="text-[var(--muted)] mb-2" />
                  <p className="font-cinzel text-xl text-[var(--muted)]">You are below nisab</p>
                  <p className="text-xs text-[var(--muted)] mt-1">No zakat due</p>
                </>
              )}
            </div>

            <div className="space-y-3 text-sm">
              {[
                { label: "Total zakatable wealth", value: fmt(result.total) },
                { label: "Nisab threshold (87.48g gold)", value: fmt(result.nisab) },
                ...(result.obligatory ? [{ label: "Zakat due (2.5%)", value: fmt(result.due) }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-[var(--border)]">
                  <span className="text-[var(--muted)]">{label}</span>
                  <span className="font-semibold text-[var(--gold)]">{value}</span>
                </div>
              ))}
            </div>

            {result.obligatory && (
              <div className="bg-[var(--card)] rounded-xl p-4">
                <p className="text-xs text-[var(--gold)] font-cinzel uppercase tracking-wider mb-3">Donate Your Zakat</p>
                {[
                  { name: "Islamic Relief India", url: "https://islamicrelief.org.in" },
                  { name: "Human Appeal", url: "https://humanappeal.org.uk" },
                  { name: "Edhi Foundation", url: "https://edhi.org" },
                ].map((org) => (
                  <a key={org.name} href={org.url} target="_blank" rel="noreferrer"
                    className="flex items-center justify-between py-2 text-[var(--green)] hover:text-[var(--gold)] transition-colors">
                    <span>{org.name}</span>
                    <span>→</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ZakatCalculatorPage;

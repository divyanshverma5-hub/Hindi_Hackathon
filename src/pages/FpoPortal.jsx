import React, { useState } from 'react';
import { 
  Building2, 
  Truck, 
  CheckCircle2
} from 'lucide-react';

export default function FpoPortal({ navigate }) {
  const [memberFarmersCount, setMemberFarmersCount] = useState(48);
  const [totalAggregatedQtl, setTotalAggregatedQtl] = useState(180);
  const [distanceKm, setDistanceKm] = useState(65);

  const individualPickupsNeeded = Math.ceil(totalAggregatedQtl / 20);
  const individualTransportCost = (individualPickupsNeeded * 350) + (2.8 * distanceKm * totalAggregatedQtl);

  const fpoTrucksNeeded = Math.ceil(totalAggregatedQtl / 100);
  const fpoTransportCost = (fpoTrucksNeeded * 1400) + (1.6 * distanceKm * totalAggregatedQtl);

  const totalSavings = individualTransportCost - fpoTransportCost;
  const savingsPerFarmer = Math.round(totalSavings / memberFarmersCount);
  const savingsPercent = Math.round((totalSavings / individualTransportCost) * 100);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] pb-20 transition-colors">
      
      {/* Header */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-color)] bg-[var(--bg-header)]">
        <div className="mx-auto max-w-5xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-green-subtle)] text-[#2e7d32] text-xs font-bold">
            <Building2 className="h-3.5 w-3.5" />
            <span>FPO व सहकारी समिति पोर्टल</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--text-main)]">
            सामूहिक शक्ति : बल्क ढुलाई व सीधा सौदा
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-2xl leading-relaxed">
            जब 50 किसान मिलकर बड़ा 10-चक्का ट्रक करते हैं, तो परिवहन लागत 35% घट जाती है और दलाली बचती है।
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        {/* Simulator */}
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5 sm:p-7 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
            <div>
              <span className="text-[11px] font-bold text-[#2e7d32] uppercase block">
                FPO सामूहिक लाभ सिम्युलेटर
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)] mt-0.5">
                बड़ा ट्रक बनाम छोटे पिकअप भाड़ा बचत गणित
              </h2>
            </div>
            <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 px-2.5 py-1 rounded-full">
              {savingsPercent}% तक भाड़े की बचत
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-5 text-xs sm:text-sm">
            <div>
              <div className="flex justify-between font-bold text-[var(--text-main)] mb-1">
                <span>सदस्य किसान:</span>
                <span className="text-[#2e7d32]">{memberFarmersCount} किसान</span>
              </div>
              <input
                type="range"
                min="10"
                max="150"
                step="2"
                value={memberFarmersCount}
                onChange={(e) => setMemberFarmersCount(Number(e.target.value))}
                className="w-full accent-[#2e7d32]"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-[var(--text-main)] mb-1">
                <span>एकत्रित फसल:</span>
                <span className="text-[#2e7d32]">{totalAggregatedQtl} क्विंटल</span>
              </div>
              <input
                type="range"
                min="50"
                max="500"
                step="10"
                value={totalAggregatedQtl}
                onChange={(e) => setTotalAggregatedQtl(Number(e.target.value))}
                className="w-full accent-[#2e7d32]"
              />
            </div>

            <div>
              <div className="flex justify-between font-bold text-[var(--text-main)] mb-1">
                <span>दूरी:</span>
                <span className="text-[#2e7d32]">{distanceKm} किमी</span>
              </div>
              <input
                type="range"
                min="20"
                max="200"
                step="5"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full accent-[#2e7d32]"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 space-y-1">
              <span className="text-[11px] font-bold text-red-800 dark:text-red-300 block">
                अकेले अलग-अलग जाने पर ({individualPickupsNeeded} पिकअप):
              </span>
              <div className="text-xl font-black text-red-700 dark:text-red-400">
                ₹{Math.round(individualTransportCost).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">
                FPO बड़ा ट्रक ({fpoTrucksNeeded} ट्रक):
              </span>
              <div className="text-xl font-black text-[#2e7d32]">
                ₹{Math.round(fpoTransportCost).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--brand-green-subtle)] text-[#2e7d32] border border-emerald-200 dark:border-emerald-800 space-y-1">
              <span className="text-[11px] font-bold block">
                FPO सामूहिक शुद्ध बचत:
              </span>
              <div className="text-2xl font-black">
                ₹{Math.round(totalSavings).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-[var(--text-muted)] block">
                प्रत्येक किसान को +₹{savingsPerFarmer} बचत
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <CheckCircle2 className="h-4 w-4 text-[#2e7d32]" />
              <span>e-NAM पोर्टल पर सामूहिक लॉट ट्रेड करने योग्य</span>
            </div>

            <button
              onClick={() => navigate('/app/compare')}
              className="px-4 py-2 rounded-xl bg-[#2e7d32] hover:bg-[#256629] text-white text-xs font-bold shadow-sm"
            >
              मंडी तुलना देखें →
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

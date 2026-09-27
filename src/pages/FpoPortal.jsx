import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Truck, 
  TrendingDown, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Coins,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { CROPS } from '../data/mandiData';

export default function FpoPortal({ navigate }) {
  const [memberFarmersCount, setMemberFarmersCount] = useState(48);
  const [totalAggregatedQtl, setTotalAggregatedQtl] = useState(180);
  const [selectedCrop, setSelectedCrop] = useState('onion');
  const [distanceKm, setDistanceKm] = useState(65);

  // Individual vs Collective transport calculations
  // Individual: 48 small pickups (rate ₹2.8/km/qtl + base ₹350 each)
  const individualPickupsNeeded = Math.ceil(totalAggregatedQtl / 20);
  const individualTransportCost = (individualPickupsNeeded * 350) + (2.8 * distanceKm * totalAggregatedQtl);

  // Collective FPO: 2 large 10-wheeler trucks (rate ₹1.6/km/qtl + base ₹1400 each)
  const fpoTrucksNeeded = Math.ceil(totalAggregatedQtl / 100);
  const fpoTransportCost = (fpoTrucksNeeded * 1400) + (1.6 * distanceKm * totalAggregatedQtl);

  const totalSavings = individualTransportCost - fpoTransportCost;
  const savingsPerFarmer = Math.round(totalSavings / memberFarmersCount);
  const savingsPercent = Math.round((totalSavings / individualTransportCost) * 100);

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-[#1E2922] pb-24">
      
      {/* Header */}
      <div className="bg-[#14231b] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#2d6a4f]/30">
        <div className="mx-auto max-w-5xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b3528] border border-[#e09f3e]/40 text-xs text-[#e09f3e] font-bold">
            <Building2 className="h-3.5 w-3.5" />
            <span>किसान उत्पादक संगठन (FPO) व सहकारी समिति पोर्टल</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            सामूहिक शक्ति : बल्क ढुलाई व सीधा सौदा
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            छोटा किसान अकेले मंडी जाता है तो गाड़ी भाड़ा और दलाली उसकी कमाई खा जाती है। जब 50 किसान मिलकर बड़ा ट्रक करते हैं, तो परिवहन लागत 35% घट जाती है और बिचौलिया दरकिनार हो जाता है।
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-6 space-y-6">

        {/* Collective Savings Calculator Widget */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <span className="text-xs font-bold text-[#2e7d32] uppercase tracking-wider block">
                FPO सामूहिक लाभ सिम्युलेटर
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#14231b] mt-0.5">
                बड़ा ट्रक बनाम छोटे पिकअप भाड़ा बचत गणित
              </h2>
            </div>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
              {savingsPercent}% तक भाड़े की सीधी बचत
            </span>
          </div>

          {/* Interactive Sliders */}
          <div className="grid sm:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="flex justify-between font-bold text-gray-700 mb-1">
                <span>सदस्य किसान संख्या:</span>
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
              <div className="flex justify-between font-bold text-gray-700 mb-1">
                <span>कुल एकत्रित फसल:</span>
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
              <div className="flex justify-between font-bold text-gray-700 mb-1">
                <span>मंडी की दूरी:</span>
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

          {/* Savings Highlight Display */}
          <div className="grid md:grid-cols-3 gap-4">
            
            {/* Solo Method */}
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2">
              <span className="text-xs font-bold text-red-800 block">
                यदि किसान अकेले अलग-अलग जाते ({individualPickupsNeeded} पिकअप)
              </span>
              <div className="text-2xl font-black text-red-700">
                ₹{Math.round(individualTransportCost).toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-red-600 block">कुल भाड़ा खर्च (ऊंची दर)</span>
            </div>

            {/* FPO Combined */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
              <span className="text-xs font-bold text-emerald-800 block">
                FPO बड़ा 10-चक्का ट्रक ({fpoTrucksNeeded} भारी ट्रक)
              </span>
              <div className="text-2xl font-black text-[#2e7d32]">
                ₹{Math.round(fpoTransportCost).toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-emerald-700 block">थोक सामूहिक भाड़ा</span>
            </div>

            {/* Total Savings */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#14231b] to-[#1b3528] text-white border border-[#e09f3e]/40 space-y-1">
              <span className="text-xs font-bold text-[#e09f3e] block">
                FPO सामूहिक शुद्ध बचत
              </span>
              <div className="text-3xl font-black text-[#e09f3e]">
                ₹{Math.round(totalSavings).toLocaleString('en-IN')}
              </div>
              <span className="text-xs text-gray-300 block">
                प्रत्येक किसान को सीधा +₹{savingsPerFarmer} की बचत
              </span>
            </div>

          </div>

          {/* FPO Action Buttons */}
          <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <CheckCircle2 className="h-4 w-4 text-[#2e7d32]" />
              <span>e-NAM पोर्टल पर सीधे थोक ट्रेड लॉट जारी करने योग्य</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/app/compare')}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
              >
                मंडी तुलना देखें
              </button>

              <button
                onClick={() => alert('FPO सामूहिक नीलामी बोली सफलतापूर्वक जनरेट की गई!')}
                className="px-5 py-2.5 rounded-xl bg-[#2e7d32] hover:bg-[#388e3c] text-white text-xs font-bold shadow transition-colors"
              >
                e-NAM बल्क टेंडर तैयार करें
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

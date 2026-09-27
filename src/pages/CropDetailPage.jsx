import React, { useState } from 'react';
import { 
  TrendingUp, 
  Volume2, 
  ArrowLeft, 
  ArrowRight
} from 'lucide-react';
import { CROPS, REGIONAL_MANDI_CLUSTERS } from '../data/mandiData';
import { bhasiniService } from '../services/bhasiniService';
import { getCropDynamicTimeline, formatHindiDate, addDays } from '../utils/dateUtils';

export default function CropDetailPage({ cropId = 'onion', navigate }) {
  const [timelineDays, setTimelineDays] = useState(30);

  const crop = CROPS.find(c => c.id === cropId) || CROPS[0];
  const timeline = getCropDynamicTimeline(crop);
  const gwaliorCluster = REGIONAL_MANDI_CLUSTERS.gwalior_chambal;
  const nashikCluster = REGIONAL_MANDI_CLUSTERS.nashik_cluster;

  const handleSpeakAnalysis = () => {
    bhasiniService.speak(`${crop.name} का AI विश्लेषण: ${timeline.reasonHindi}`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] pb-20 transition-colors">
      
      {/* Top Header */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-color)] bg-[var(--bg-header)]">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => navigate('/app')}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] mb-3 font-semibold"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>वापस जाएं</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--bg-card-subtle)] text-4xl border border-[var(--border-color)] shadow-sm">
                {crop.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-heading text-2xl sm:text-3xl font-black text-[var(--text-main)]">{crop.name}</h1>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-0.5 rounded-full">
                    {crop.category}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  किस्म: {crop.variety} · मानक: {crop.standardWeight}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleSpeakAnalysis}
                className="inline-flex items-center gap-1.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] px-4 py-2.5 text-xs sm:text-sm font-semibold shadow-sm transition-all"
              >
                <Volume2 className="h-4 w-4 text-[var(--brand-green)]" />
                <span>सलाह सुनें</span>
              </button>

              <button
                onClick={() => navigate('/app/compare')}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-sm transition-all"
              >
                <span>मंडी तुलना</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        {/* Forecast Card */}
        <div className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
            <div>
              <span className="text-[11px] font-bold text-[var(--brand-green)] uppercase block">
                Agmarknet + AI मॉडल
              </span>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[var(--text-main)]">
                मूल्य पूर्वानुमान व बिक्री समय
              </h2>
            </div>

            {/* Timeline Filter */}
            <div className="flex items-center gap-1 bg-[var(--bg-card-subtle)] p-1 rounded-2xl text-xs font-bold">
              {[7, 14, 30].map(days => (
                <button
                  key={days}
                  onClick={() => setTimelineDays(days)}
                  className={`px-3.5 py-1.5 rounded-xl transition-colors ${
                    timelineDays === days ? 'bg-[var(--brand-green)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {days} दिन
                </button>
              ))}
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 text-xs">
            <div className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)]">
              <span className="text-[var(--text-muted)] block">वर्तमान औसत भाव:</span>
              <span className="font-heading text-xl font-black text-[var(--text-main)] mt-0.5 block">₹{crop.currentAvgModalPrice}</span>
              <span className="text-[10px] text-[var(--text-muted)]">प्रति क्विंटल थोक</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--brand-green-subtle)] text-[var(--brand-green)]">
              <span className="font-semibold block">अपेक्षित शिखर भाव:</span>
              <span className="font-heading text-xl font-black mt-0.5 block">₹{crop.forecastPeakPrice}</span>
              <span className="text-[10px]">{timeline.peakDateStr} ({crop.forecastDays ? `+${crop.forecastDays} दिन` : 'आज'})</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--accent-gold-subtle)] text-[#D97706]">
              <span className="font-semibold block">शुद्ध लाभ:</span>
              <span className="font-heading text-xl font-black mt-0.5 block">+₹{crop.gainPerQuintal}</span>
              <span className="text-[10px]">भाड़ा काटकर</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)]">
              <span className="text-[var(--text-muted)] font-semibold block">सर्वोत्तम मंडी:</span>
              <span className="font-heading text-base font-bold text-[var(--text-main)] mt-0.5 block truncate">{crop.forecastBestMandi}</span>
              <span className="text-[10px] text-[var(--brand-green)] font-semibold">विश्वास: {crop.confidence}%</span>
            </div>
          </div>

          {/* SVG Projection Curve */}
          <div className="bg-[var(--bg-card-subtle)] rounded-2xl p-5 border border-[var(--border-color)] space-y-2">
            <div className="flex justify-between items-center text-xs text-[var(--text-muted)]">
              <span>ऐतिहासिक 180 दिन (आज तक)</span>
              <span className="text-[var(--brand-green)] font-bold">आगामी {timelineDays} दिन का AI पूर्वानुमान</span>
            </div>

            <svg viewBox="0 0 600 200" className="w-full h-44">
              <defs>
                <linearGradient id="cropDetailGradDynamic" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#236838" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#236838" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="50" x2="600" y2="50" stroke="currentColor" opacity="0.1" strokeDasharray="3 3" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="currentColor" opacity="0.1" strokeDasharray="3 3" />
              <line x1="0" y1="150" x2="600" y2="150" stroke="currentColor" opacity="0.1" strokeDasharray="3 3" />

              <line x1="420" y1="0" x2="420" y2="200" stroke="#236838" strokeDasharray="4 4" strokeWidth="1.5" />
              <text x="425" y="20" fill="currentColor" opacity="0.7" fontSize="11" fontWeight="bold">आज ({formatHindiDate(new Date(), { day: 'numeric', month: 'short' })})</text>

              <path
                d="M 10 150 Q 100 160, 200 120 T 350 110 T 420 90 T 520 35 T 590 55 L 590 190 L 10 190 Z"
                fill="url(#cropDetailGradDynamic)"
              />

              <path
                d="M 10 150 Q 100 160, 200 120 T 350 110 T 420 90 T 520 35 T 590 55"
                fill="none"
                stroke="#236838"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              <circle cx="520" cy="35" r="5.5" fill="#D97706" />
            </svg>

            <div className="flex justify-between text-[11px] text-[var(--text-muted)] font-mono">
              <span>3 माह पूर्व</span>
              <span>1 माह पूर्व</span>
              <span className="font-bold text-[var(--text-main)]">वर्तमान: ₹{crop.currentAvgModalPrice}</span>
              <span className="text-[#D97706] font-bold">शिखर: ₹{crop.forecastPeakPrice} ({timeline.peakDateStr})</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--bg-card-subtle)] text-xs sm:text-sm text-[var(--text-main)] leading-relaxed font-medium">
            {timeline.reasonHindi}
          </div>
        </div>

        {/* Mandi Rates Table */}
        <div className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-sm space-y-4">
          <h3 className="font-heading font-bold text-lg text-[var(--text-main)]">
            प्रमुख मंडियों में सजीव थोक भाव
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[var(--bg-card-subtle)] text-[var(--text-muted)] uppercase font-semibold border-b border-[var(--border-color)]">
                <tr>
                  <th className="p-3">मंडी</th>
                  <th className="p-3">जिला</th>
                  <th className="p-3">दैनिक आवक</th>
                  <th className="p-3">थोक भाव</th>
                  <th className="p-3">भुगतान</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {[...gwaliorCluster.mandis, ...nashikCluster.mandis.slice(0, 2)].map(m => (
                  <tr key={m.id} className="hover:bg-[var(--bg-card-subtle)] transition-colors">
                    <td className="p-3 font-bold text-[var(--text-main)]">{m.name}</td>
                    <td className="p-3 text-[var(--text-muted)]">{m.district}</td>
                    <td className="p-3 text-[var(--text-muted)]">{m.arrivalsTodayQtl?.toLocaleString('en-IN')} क्विंटल</td>
                    <td className="p-3 font-heading font-black text-[var(--brand-green)] text-sm">
                      ₹{m.prices[crop.id] || crop.currentAvgModalPrice} /qtl
                    </td>
                    <td className="p-3 text-[var(--text-muted)]">{m.paymentMode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

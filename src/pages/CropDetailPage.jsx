import React, { useState } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Volume2, 
  ArrowLeft, 
  ArrowRight,
  Info,
  BarChart2,
  CloudRain,
  Truck
} from 'lucide-react';
import { CROPS, REGIONAL_MANDI_CLUSTERS } from '../data/mandiData';
import { bhasiniService } from '../services/bhasiniService';

export default function CropDetailPage({ cropId = 'onion', navigate }) {
  const [timelineDays, setTimelineDays] = useState(30);

  const crop = CROPS.find(c => c.id === cropId) || CROPS[0];
  const gwaliorCluster = REGIONAL_MANDI_CLUSTERS.gwalior_chambal;
  const nashikCluster = REGIONAL_MANDI_CLUSTERS.nashik_cluster;

  const handleSpeakAnalysis = () => {
    bhasiniService.speak(`${crop.name} का AI विश्लेषण: ${crop.reasonHindi}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-[#1E2922] pb-24">
      
      {/* Top Header */}
      <div className="bg-[#14231b] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-[#2d6a4f]/30">
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => navigate('/app')}
            className="inline-flex items-center gap-1.5 text-xs text-gray-300 hover:text-white mb-4 transition-colors font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>डैशबोर्ड पर वापस जाएं</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-4xl border border-white/20">
                {crop.icon}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black">{crop.name}</h1>
                  <span className="text-xs bg-[#e09f3e] text-[#14231b] font-bold px-2.5 py-0.5 rounded-full">
                    {crop.category}
                  </span>
                </div>
                <p className="text-xs text-gray-300 mt-1">
                  किस्म: {crop.variety} · औसत मानक: {crop.standardWeight}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSpeakAnalysis}
                className="inline-flex items-center gap-2 rounded-xl bg-[#2e7d32] hover:bg-[#388e3c] text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow transition-all"
              >
                <Volume2 className="h-4 w-4 text-[#e09f3e]" />
                <span>AI विश्लेषण सुनें</span>
              </button>

              <button
                onClick={() => navigate('/app/compare')}
                className="inline-flex items-center gap-2 rounded-xl bg-[#e09f3e] hover:bg-[#d97706] text-[#14231b] px-4 py-2.5 text-xs sm:text-sm font-bold shadow transition-all"
              >
                <span>मंडी तुलना करें</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-5 space-y-6">

        {/* Forecast Summary Card */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
            <div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                Agmarknet + LSTM हाइब्रिड AI मॉडल
              </span>
              <h2 className="text-xl font-black text-[#14231b] mt-0.5">
                मूल्य पूर्वानुमान व सर्वोत्तम बिक्री खिड़की (Selling Window)
              </h2>
            </div>

            {/* Timeline Filter */}
            <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-bold text-gray-700">
              {[7, 14, 30].map(days => (
                <button
                  key={days}
                  onClick={() => setTimelineDays(days)}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    timelineDays === days ? 'bg-[#2e7d32] text-white shadow-sm' : 'hover:bg-white'
                  }`}
                >
                  {days} दिन
                </button>
              ))}
            </div>
          </div>

          {/* Forecast Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-gray-50 border">
              <span className="text-gray-500 block">वर्तमान औसत भाव:</span>
              <span className="text-xl font-black text-gray-900 mt-1 block">₹{crop.currentAvgModalPrice}</span>
              <span className="text-gray-400">प्रति क्विंटल थोक</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100">
              <span className="text-emerald-800 font-semibold block">अपेक्षित शिखर भाव:</span>
              <span className="text-xl font-black text-[#2e7d32] mt-1 block">₹{crop.forecastPeakPrice}</span>
              <span className="text-emerald-700">+{timelineDays === 7 ? '5' : timelineDays === 14 ? '12' : '22'} दिन में</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-100">
              <span className="text-amber-800 font-semibold block">शुद्ध लाभ लाभ (Net Gain):</span>
              <span className="text-xl font-black text-[#b45309] mt-1 block">+₹{crop.gainPerQuintal}</span>
              <span className="text-amber-700">भाड़ा व दलाली काटकर</span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100">
              <span className="text-blue-800 font-semibold block">अनुशंसित मंडी:</span>
              <span className="text-base font-black text-blue-950 mt-1 block truncate">{crop.forecastBestMandi}</span>
              <span className="text-blue-700 font-semibold">विश्वास: {crop.confidence}%</span>
            </div>
          </div>

          {/* Interactive SVG Projection Graph */}
          <div className="bg-[#14231b] rounded-2xl p-5 text-white border border-[#2d6a4f]/40 space-y-3">
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>ऐतिहासिक 180 दिन का डेटा</span>
              <span className="text-[#e09f3e] font-bold">आगामी {timelineDays} दिन का AI पूर्वानुमान</span>
            </div>

            <svg viewBox="0 0 600 220" className="w-full h-48">
              <defs>
                <linearGradient id="cropDetailGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e09f3e" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#2e7d32" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="0" y1="50" x2="600" y2="50" stroke="#24382c" strokeDasharray="3 3" />
              <line x1="0" y1="110" x2="600" y2="110" stroke="#24382c" strokeDasharray="3 3" />
              <line x1="0" y1="170" x2="600" y2="170" stroke="#24382c" strokeDasharray="3 3" />

              {/* Forecast Separation Line */}
              <line x1="420" y1="0" x2="420" y2="220" stroke="#e09f3e" strokeDasharray="4 4" strokeWidth="1.5" />
              <text x="425" y="25" fill="#e09f3e" fontSize="10" fontWeight="bold">आज (Now)</text>

              {/* Area */}
              <path
                d="M 10 160 Q 100 170, 200 130 T 350 120 T 420 100 T 520 40 T 590 60 L 590 210 L 10 210 Z"
                fill="url(#cropDetailGrad)"
              />

              {/* Curve */}
              <path
                d="M 10 160 Q 100 170, 200 130 T 350 120 T 420 100 T 520 40 T 590 60"
                fill="none"
                stroke="#e09f3e"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Peak Circle */}
              <circle cx="520" cy="40" r="6" fill="#e09f3e" className="animate-pulse" />
              <circle cx="520" cy="40" r="3" fill="#ffffff" />
            </svg>

            <div className="flex justify-between text-[11px] text-gray-400 font-mono">
              <span>3 माह पूर्व</span>
              <span>1 माह पूर्व</span>
              <span className="text-white font-bold">वर्तमान: ₹{crop.currentAvgModalPrice}</span>
              <span className="text-[#e09f3e] font-bold">शिखर: ₹{crop.forecastPeakPrice}</span>
            </div>
          </div>

          {/* Written AI Explanation */}
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h4 className="font-bold text-xs text-gray-700 uppercase mb-1">विस्तृत व्याख्या:</h4>
            <p className="text-sm text-gray-800 leading-relaxed font-medium">
              {crop.reasonHindi}
            </p>
          </div>
        </div>

        {/* Regional Mandi Price Variance Matrix */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-[#14231b]">
              प्रमुख मंडियों में सजीव थोक भाव (Live Mandi Rates)
            </h3>
            <span className="text-xs text-gray-500">स्रोत: Agmarknet व e-NAM</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase font-bold border-b">
                <tr>
                  <th className="p-3">मंडी का नाम</th>
                  <th className="p-3">जिला व राज्य</th>
                  <th className="p-3">दैनिक आवक (क्विंटल)</th>
                  <th className="p-3">घोषित थोक भाव</th>
                  <th className="p-3">भुगतान गति</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[...gwaliorCluster.mandis, ...nashikCluster.mandis.slice(0, 2)].map(m => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-bold text-gray-900">{m.name}</td>
                    <td className="p-3 text-gray-600">{m.district}, {m.state}</td>
                    <td className="p-3 text-gray-800">{m.arrivalsTodayQtl?.toLocaleString('en-IN')} qtl</td>
                    <td className="p-3 font-extrabold text-[#2e7d32] text-sm">
                      ₹{m.prices[crop.id] || crop.currentAvgModalPrice} /qtl
                    </td>
                    <td className="p-3 text-gray-600">{m.paymentMode}</td>
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

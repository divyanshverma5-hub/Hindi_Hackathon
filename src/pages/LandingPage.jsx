import React from 'react';
import { 
  ArrowRight, 
  Volume2, 
  TrendingUp, 
  CheckCircle2, 
  Calculator, 
  Layers, 
  Sparkles,
  Wheat,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { bhasiniService } from '../services/bhasiniService';
import { CROPS } from '../data/mandiData';
import { getCropDynamicTimeline, formatHindiDate } from '../utils/dateUtils';

export default function LandingPage({ navigate, onOpenVoiceModal }) {
  const onionCrop = CROPS[0];
  const onionTimeline = getCropDynamicTimeline(onionCrop);
  const todayStr = formatHindiDate(new Date(), { day: 'numeric', month: 'short' });

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] transition-colors">
      
      {/* Hero Section with Farm Landscape & Rising Sun SVG */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-20 border-b border-[var(--border-color)] bg-gradient-to-b from-[var(--brand-green-subtle)] via-[var(--bg-page)] to-[var(--bg-page)]">
        
        {/* Subtle Decorative Farm Field Curves Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 overflow-hidden">
          <svg viewBox="0 0 1440 400" className="w-full h-full object-cover">
            <path d="M0,220 C320,160 480,280 800,200 C1120,120 1280,240 1440,180 L1440,400 L0,400 Z" fill="#236838" opacity="0.06" />
            <path d="M0,260 C360,200 520,320 900,240 C1200,180 1360,270 1440,230 L1440,400 L0,400 Z" fill="#D97706" opacity="0.05" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Team & Hackathon Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] text-xs font-bold text-[#236838] shadow-sm">
                <Wheat className="h-3.5 w-3.5 text-[#D97706]" />
                <span>हिंदी हैकाथॉन 2026</span>
                <span className="text-[var(--text-muted)]">·</span>
                <span className="text-[var(--text-muted)]">IIITM ग्वालियर</span>
              </div>

              {/* Main Headline - STRICTLY MAX 2 LINES */}
              <h1 className="font-heading text-3xl sm:text-5xl font-black tracking-tight leading-[1.2] text-[var(--text-main)]">
                कब और कहाँ बेचें? <br />
                <span className="text-[var(--brand-green)]">
                  दलाली व भाड़ा काटकर असली शुद्ध मुनाफ़ा।
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-xl leading-relaxed">
                दूर की मंडी का ऊंचा भाव देखकर किसान अक्सर धोखे में आ जाता है। कृषिवाणी परिवहन खर्च, आढ़त और रास्ते की सड़न घटाकर आपके हाथ में आने वाला असली रोकड़ा बताता है।
              </p>

              {/* CTA Buttons: Only ONE Primary Button */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                {/* Single Primary Button */}
                <button
                  onClick={() => navigate('/app')}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-white font-bold px-7 py-3.5 text-base shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  <span>ऐप खोलें</span>
                  <ArrowRight className="h-5 w-5" />
                </button>

                {/* Secondary Outlined Button */}
                <button
                  onClick={() => navigate('/app/compare')}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] font-semibold px-5 py-3.5 text-sm transition-colors shadow-sm"
                >
                  <Scale className="h-4 w-4 text-[var(--brand-green)]" />
                  <span>मंडी तुलना</span>
                </button>

                {/* Text Link */}
                <button
                  onClick={onOpenVoiceModal}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[var(--brand-green)] hover:underline"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>बोलकर पूछें →</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-3 flex flex-wrap items-center gap-6 text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[var(--brand-green)]" />
                  <span>Agmarknet व eNAM सजीव भाव</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[var(--brand-green)]" />
                  <span>भाषिणी बोलती आवाज़</span>
                </div>
              </div>

            </div>

            {/* Right Card: Dynamic Forecast Preview with Agricultural Art */}
            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-md farmer-card space-y-4">
                
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🧅</span>
                    <div>
                      <span className="text-[11px] font-bold text-[var(--brand-green)] uppercase block">
                        AI मूल्य पूर्वानुमान
                      </span>
                      <h3 className="font-heading font-bold text-base text-[var(--text-main)]">
                        प्याज — 180 दिन का रुझान
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                    87% विश्वास
                  </span>
                </div>

                {/* SVG Curve with dynamic dates */}
                <div className="bg-[var(--bg-card-subtle)] rounded-2xl p-4 border border-[var(--border-color)]">
                  <div className="flex justify-between text-xs text-[var(--text-muted)] mb-1">
                    <span>न्यूनतम: ₹1,983</span>
                    <span className="text-[#D97706] font-bold">
                      शिखर: ₹2,788 ({onionTimeline.peakDateStr})
                    </span>
                  </div>

                  <svg viewBox="0 0 400 150" className="w-full h-32">
                    <defs>
                      <linearGradient id="landingChartGradDynamic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#236838" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#236838" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="35" x2="400" y2="35" stroke="currentColor" opacity="0.1" strokeDasharray="3 3" />
                    <line x1="0" y1="75" x2="400" y2="75" stroke="currentColor" opacity="0.1" strokeDasharray="3 3" />
                    <line x1="0" y1="115" x2="400" y2="115" stroke="currentColor" opacity="0.1" strokeDasharray="3 3" />

                    <path
                      d="M 10 120 Q 70 135, 120 95 T 220 65 T 320 30 T 390 15 L 390 145 L 10 145 Z"
                      fill="url(#landingChartGradDynamic)"
                    />
                    <path
                      d="M 10 120 Q 70 135, 120 95 T 220 65 T 320 30 T 390 15"
                      fill="none"
                      stroke="#236838"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <circle cx="390" cy="15" r="4.5" fill="#D97706" />
                  </svg>

                  <div className="flex justify-between text-[11px] text-[var(--text-muted)] font-medium mt-1">
                    <span>180 दिन पूर्व</span>
                    <span>आज ({todayStr})</span>
                    <span className="text-[var(--brand-green)] font-bold">+{onionCrop.forecastDays} दिन ({onionTimeline.peakDateStr})</span>
                  </div>
                </div>

                {/* Advice Action Strip */}
                <div className="p-3.5 rounded-2xl bg-[var(--brand-green-subtle)] border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[var(--brand-green)] block text-sm">
                      सलाह: {onionTimeline.actionText}
                    </span>
                    <span className="text-[var(--text-main)] font-medium">
                      उमराने मंडी में +₹184/क्विंटल का लाभ
                    </span>
                  </div>
                  <button
                    onClick={() => bhasiniService.speak(onionTimeline.spokenAdvice)}
                    className="p-2 rounded-xl bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-hover)] transition-transform hover:scale-105"
                    title="सलाह सुनें"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>

        {/* Soft Wave Field Divider */}
        <div className="w-full overflow-hidden leading-none -mb-1 mt-10">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-8 sm:h-12 fill-[var(--bg-card)]">
            <path d="M0,0 C300,90 600,-40 900,50 C1050,90 1150,40 1200,20 L1200,120 L0,120 Z"></path>
          </svg>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="py-16 bg-[var(--bg-card)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-[var(--text-main)]">
              कृषिवाणी : बोलकर समझो, समझकर बेचो
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              किसान की सबसे बड़ी उलझन — "कब और कहाँ बेचें?" का सम्पूर्ण AI समाधान
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-3xl bg-[var(--bg-page)] border border-[var(--border-color)] space-y-3 shadow-sm farmer-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-green-subtle)] text-[var(--brand-green)]">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-[var(--text-main)]">AI मूल्य पूर्वानुमान</h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                Agmarknet के पिछले 5 वर्षों के रुझानों के आधार पर आगामी 7 से 30 दिनों के भाव का सटीक अनुमान।
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--bg-page)] border border-[var(--border-color)] space-y-3 shadow-sm farmer-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-gold-subtle)] text-[#D97706]">
                <Volume2 className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-[var(--text-main)]">मातृभाषा में आवाज़ सलाह</h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                पढ़ना ज़रूरी नहीं — किसान अपनी भाषा में बोलकर पूछ सकता है और बोलती आवाज़ में सुन सकता है।
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--bg-page)] border border-[var(--border-color)] space-y-3 shadow-sm farmer-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-green-subtle)] text-[var(--brand-green)]">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-[var(--text-main)]">मुनाफ़ा कैलकुलेटर</h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                दलाली, गाड़ी भाड़ा और रास्ते की सड़न घटाकर बताता है कि असली शुद्ध पैसा किसमें ज्यादा मिलेगा।
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[var(--bg-page)] border border-[var(--border-color)] space-y-3 shadow-sm farmer-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-[#236838]">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="font-heading font-bold text-base text-[var(--text-main)]">धीमे नेटवर्क में भी काम</h3>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                कमज़ोर नेटवर्क में भी डेटा सुरक्षित रहता है और ज़रूरत पड़ने पर SMS से सलाह मिलती है।
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border-color)] py-8 bg-[var(--bg-header)] text-xs text-[var(--text-muted)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="font-bold text-[var(--text-main)]">कृषिवाणी</span> · टीम HD Falcons (IIITM ग्वालियर) · हिंदी हैकाथॉन 2026
          </div>
          <div className="flex items-center gap-5 font-medium">
            <button onClick={() => navigate('/app')} className="hover:underline">आज</button>
            <button onClick={() => navigate('/app/compare')} className="hover:underline">मंडी तुलना</button>
            <button onClick={() => navigate('/demo')} className="hover:underline">वॉकथ्रू</button>
          </div>
        </div>
      </footer>

    </div>
  );
}

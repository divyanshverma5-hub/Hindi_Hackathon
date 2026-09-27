import React from 'react';
import { 
  ArrowRight, 
  Volume2, 
  TrendingUp, 
  CheckCircle2, 
  Calculator,
  PlayCircle,
  Layers,
  Sparkles
} from 'lucide-react';
import { bhasiniService } from '../services/bhasiniService';

export default function LandingPage({ navigate, onOpenVoiceModal }) {
  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] transition-colors">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-[var(--border-color)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Subtle Team Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-green-subtle)] text-[#2e7d32] text-xs font-bold">
                <span>हिंदी हैकाथॉन 2026</span>
                <span>·</span>
                <span>IIITM ग्वालियर</span>
              </div>

              {/* Main Headline - MAX 2 LINES */}
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-[var(--text-main)]">
                कब और कहाँ बेचें? <br />
                <span className="text-[#2e7d32]">
                  दलाली व भाड़ा काटकर असली शुद्ध मुनाफ़ा।
                </span>
              </h1>

              {/* Sub-headline */}
              <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-xl leading-relaxed">
                दूर की मंडी का ऊंचा भाव देखकर किसान अक्सर घाटे में आ जाता है। कृषिवाणी परिवहन, आढ़त और फसल सड़न घटाकर आपके हाथ में आने वाला असली रोकड़ा बताता है।
              </p>

              {/* CTA Buttons: Only ONE Primary Button */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                {/* Single Primary Button */}
                <button
                  onClick={() => navigate('/app')}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#2e7d32] hover:bg-[#256629] text-white font-bold px-6 py-3.5 text-sm sm:text-base shadow-md transition-all transform hover:-translate-y-0.5"
                >
                  <span>ऐप खोलें</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* Secondary Outlined Button */}
                <button
                  onClick={() => navigate('/app/compare')}
                  className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] font-semibold px-4 py-3 text-sm transition-colors"
                >
                  <Calculator className="h-4 w-4 text-[#2e7d32]" />
                  <span>मंडी तुलना</span>
                </button>

                {/* Subtle Text Link */}
                <button
                  onClick={onOpenVoiceModal}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2e7d32] hover:underline"
                >
                  <Volume2 className="h-4 w-4" />
                  <span>बोलकर पूछें →</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-5 text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#2e7d32]" />
                  <span>Agmarknet व eNAM सजीव भाव</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#2e7d32]" />
                  <span>भाषिणी आवाज़ सहायक</span>
                </div>
              </div>

            </div>

            {/* Right Chart Preview Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5 shadow-lg space-y-3">
                <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
                  <div>
                    <span className="text-[11px] font-bold text-[#2e7d32] block">
                      AI मूल्य पूर्वानुमान
                    </span>
                    <h3 className="font-bold text-sm text-[var(--text-main)]">प्याज — 180 दिन का रुझान</h3>
                  </div>
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded font-bold">
                    87% विश्वास
                  </span>
                </div>

                {/* SVG Curve */}
                <div className="bg-[var(--bg-card-subtle)] rounded-xl p-3 border border-[var(--border-color)]">
                  <div className="flex justify-between text-[11px] text-[var(--text-muted)] mb-1">
                    <span>न्यूनतम: ₹1,983</span>
                    <span className="text-[#d97706] font-bold">शिखर: ₹2,788 (29 अगस्त)</span>
                  </div>

                  <svg viewBox="0 0 400 160" className="w-full h-32">
                    <defs>
                      <linearGradient id="landingChartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2e7d32" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#2e7d32" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="40" x2="400" y2="40" stroke="currentColor" opacity="0.1" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="400" y2="80" stroke="currentColor" opacity="0.1" strokeDasharray="3 3" />
                    <line x1="0" y1="120" x2="400" y2="120" stroke="currentColor" opacity="0.1" strokeDasharray="3 3" />

                    <path
                      d="M 10 130 Q 70 140, 120 100 T 220 70 T 320 35 T 390 20 L 390 150 L 10 150 Z"
                      fill="url(#landingChartGrad)"
                    />
                    <path
                      d="M 10 130 Q 70 140, 120 100 T 220 70 T 320 35 T 390 20"
                      fill="none"
                      stroke="#2e7d32"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="390" cy="20" r="4" fill="#d97706" />
                  </svg>

                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono mt-1">
                    <span>180 दिन पूर्व</span>
                    <span>आज</span>
                    <span className="text-[#2e7d32] font-bold">+5 दिन</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--brand-green-subtle)] border border-emerald-200 dark:border-emerald-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#2e7d32] block">सलाह: 5 दिन रुकें</span>
                    <span className="text-[var(--text-main)] font-medium">उमराने मंडी में +₹184/क्विंटल का लाभ</span>
                  </div>
                  <button
                    onClick={() => {
                      bhasiniService.speak('उमराने मंडी में 29 अगस्त को भाव ₹2,788 तक उछलने का अनुमान है। 5 दिन रुकने पर भाड़ा काटकर भी ₹184 प्रति क्विंटल का अतिरिक्त लाभ होगा।');
                    }}
                    className="p-1.5 rounded-lg bg-[#2e7d32] text-white hover:bg-[#256629]"
                    title="सलाह सुनें"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-main)]">
              कृषिवाणी : बोलकर समझो, समझकर बेचो
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">
              किसान की सबसे बड़ी उलझन — "कब और कहाँ बेचें?" का AI समाधान
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2.5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-green-subtle)] text-[#2e7d32]">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-[var(--text-main)]">AI मूल्य पूर्वानुमान</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Agmarknet के पिछले 5 वर्षों के रुझानों के आधार पर आगामी 7 से 30 दिनों के भाव का अनुमान।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2.5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950 text-[#d97706]">
                <Volume2 className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-[var(--text-main)]">मातृभाषा में आवाज़ सलाह</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                पढ़ना ज़रूरी नहीं — किसान अपनी भाषा में बोलकर पूछ सकता है और बोलती आवाज़ में सुन सकता है।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2.5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--brand-green-subtle)] text-[#2e7d32]">
                <Calculator className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-[var(--text-main)]">मुनाफ़ा कैलकुलेटर</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                दलाली, गाड़ी भाड़ा और रास्ते की सड़न घटाकर बताता है कि असली शुद्ध पैसा किसमें ज्यादा मिलेगा।
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] space-y-2.5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#2e7d32]">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm text-[var(--text-main)]">धीमे नेटवर्क में भी काम</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
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
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/app')} className="hover:underline">आज</button>
            <button onClick={() => navigate('/app/compare')} className="hover:underline">मंडी तुलना</button>
            <button onClick={() => navigate('/demo')} className="hover:underline">वॉकथ्रू</button>
          </div>
        </div>
      </footer>

    </div>
  );
}

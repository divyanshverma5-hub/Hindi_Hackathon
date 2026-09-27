import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Volume2, 
  Sparkles, 
  TrendingUp, 
  Truck, 
  ShieldAlert, 
  Layers, 
  CheckCircle2, 
  ChevronRight,
  Calculator,
  PlayCircle
} from 'lucide-react';
import { bhasiniService } from '../services/bhasiniService';

export default function LandingPage({ navigate, onOpenVoiceModal }) {
  const [activeCropTicker, setActiveCropTicker] = useState('onion');

  const tickerItems = [
    { crop: 'प्याज (Onion)', mandi: 'उमराने मंडी (नाशिक)', price: '₹2,788/क्विंटल', trend: '+14% उछाल अनुमान' },
    { crop: 'टमाटर (Tomato)', mandi: 'चांदवड़ मंडी (नाशिक)', price: '₹1,980/क्विंटल', trend: 'तुरंत बेचें' },
    { crop: 'गेहूँ (Wheat)', mandi: 'डबरा मंडी (ग्वालियर)', price: '₹2,780/क्विंटल', trend: '+₹165 का लाभ' },
    { crop: 'सरसों (Mustard)', mandi: 'मुरैना मंडी', price: '₹5,580/क्विंटल', trend: 'स्थिर मांग' }
  ];

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-[#1E2922]">
      
      {/* Live Agmarknet Price Ticker Ribbon */}
      <div className="bg-[#14231b] border-b border-[#2d6a4f]/30 text-xs py-2 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-[#e09f3e] tracking-wider uppercase text-[10px]">Agmarknet लाइव सजीव मंडी भाव:</span>
          </div>
          <div className="hidden sm:flex items-center gap-6 overflow-x-auto text-gray-300">
            {tickerItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-semibold text-white">{item.crop}:</span>
                <span className="text-gray-300">{item.mandi}</span>
                <span className="text-[#e09f3e] font-bold">{item.price}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/50 px-1 rounded">{item.trend}</span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => navigate('/app/compare')}
            className="text-[11px] font-semibold text-[#e09f3e] hover:underline flex items-center gap-1"
          >
            <span>सभी मंडियां देखें</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#14231b] via-[#1a3325] to-[#14231b] text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
        
        {/* Subtle Background SVG Grid & Waves */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="#2e7d32" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Hackathon Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1b3528] border border-[#e09f3e]/40 text-xs text-gray-200">
                <span className="flex h-2 w-2 rounded-full bg-[#e09f3e]"></span>
                <span className="font-bold text-[#e09f3e]">हिंदी हैकाथॉन 2026</span>
                <span className="text-gray-400">·</span>
                <span>टीम HD Falcons (IIITM ग्वालियर)</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                कब और कहाँ बेचें? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e09f3e] via-[#f4a261] to-[#e76f51]">
                  गाड़ी भाड़ा व दलाली काटकर
                </span> <br />
                असली शुद्ध मुनाफ़ा।
              </h1>

              {/* Sub-headline */}
              <p className="text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed font-normal">
                दूर की मंडी का घोषित भाव अधिक देखकर किसान अक्सर घाटे में आ जाता है। कृषिवाणी परिवहन खर्च, आढ़त/दलाली और फसल बर्बादी घटाकर बताता है कि आपके हाथ में वास्तव में कितना पैसा आएगा।
              </p>

              {/* Interactive CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/app')}
                  className="flex items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#e09f3e] to-[#d97706] hover:from-[#d97706] hover:to-[#b45309] text-[#14231b] font-extrabold px-6 py-3.5 text-base shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
                >
                  <span>ऐप खोलें (आज का निर्णय)</span>
                  <ArrowRight className="h-5 w-5" />
                </button>

                <button
                  onClick={() => navigate('/app/compare')}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#2e7d32] hover:bg-[#388e3c] text-white font-bold px-5 py-3.5 text-sm sm:text-base border border-[#e09f3e]/30 shadow-md transition-all"
                >
                  <Calculator className="h-4 w-4 text-[#e09f3e]" />
                  <span>3-4 मंडी शुद्ध मुनाफ़ा तुलना</span>
                </button>

                <button
                  onClick={onOpenVoiceModal}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#1b3528] hover:bg-[#244636] text-gray-200 font-semibold px-4 py-3.5 text-sm border border-[#2d6a4f] transition-all"
                >
                  <Volume2 className="h-4 w-4 text-[#e09f3e]" />
                  <span>बोलकर पूछें (भाषिणी AI)</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-gray-400 border-t border-[#2d6a4f]/40">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#e09f3e]" />
                  <span>Agmarknet व eNAM सजीव भाव</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#e09f3e]" />
                  <span>भाषिणी (BHASHINI) मातृभाषा आवाज़</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#e09f3e]" />
                  <span>LSTM व FB Prophet 7-30 दिन AI मॉडल</span>
                </div>
              </div>

            </div>

            {/* Right Interactive Chart Visual Card (The 180-day price wave) */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-[#0f1914] border border-[#2d6a4f] p-5 shadow-2xl space-y-4">
                
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-[#2d6a4f]/40 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#e09f3e] uppercase tracking-wider block">
                      सजीव AI पूर्वानुमान ग्राफ
                    </span>
                    <h3 className="font-bold text-white text-base">प्याज भाव — 180 दिन का रुझान व शिखर</h3>
                  </div>
                  <span className="text-xs bg-[#2e7d32] text-white px-2.5 py-1 rounded-full font-bold">
                    87% विश्वास
                  </span>
                </div>

                {/* Simulated Interactive SVG Price Curve */}
                <div className="relative bg-[#14231b] rounded-xl p-3 border border-[#2d6a4f]/30">
                  <div className="flex justify-between text-[11px] text-gray-400 mb-2">
                    <span>न्यूनतम: ₹1,983 (17 मार्च)</span>
                    <span className="text-[#e09f3e] font-bold">आगामी शिखर: ₹2,788 (29 अगस्त)</span>
                  </div>

                  {/* SVG Chart Wave */}
                  <svg viewBox="0 0 400 180" className="w-full h-36">
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#e09f3e" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#2e7d32" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid Lines */}
                    <line x1="0" y1="40" x2="400" y2="40" stroke="#24382c" strokeDasharray="3 3" />
                    <line x1="0" y1="90" x2="400" y2="90" stroke="#24382c" strokeDasharray="3 3" />
                    <line x1="0" y1="140" x2="400" y2="140" stroke="#24382c" strokeDasharray="3 3" />

                    {/* Gradient Fill under Curve */}
                    <path
                      d="M 10 140 Q 70 150, 120 110 T 220 80 T 320 40 T 390 25 L 390 170 L 10 170 Z"
                      fill="url(#chartGradient)"
                    />

                    {/* Curve Line */}
                    <path
                      d="M 10 140 Q 70 150, 120 110 T 220 80 T 320 40 T 390 25"
                      fill="none"
                      stroke="#e09f3e"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Peak Point Pulsing */}
                    <circle cx="390" cy="25" r="5" fill="#e09f3e" className="animate-ping" />
                    <circle cx="390" cy="25" r="4" fill="#ffffff" stroke="#e09f3e" strokeWidth="2" />
                  </svg>

                  <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-mono">
                    <span>180 दिन पूर्व</span>
                    <span>90 दिन पूर्व</span>
                    <span>आज (24 अगस्त)</span>
                    <span className="text-[#e09f3e] font-bold">+5 दिन (29 अगस्त)</span>
                  </div>
                </div>

                {/* Quick Advice Snippet */}
                <div className="p-3.5 rounded-xl bg-[#1b3528] border border-[#2d6a4f] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 block">निर्णय: 5 दिन रुकें (Hold 5 Days)</span>
                    <span className="text-xs text-gray-300">उमराने मंडी ले जाने पर +₹184/क्विंटल का अतिरिक्त शुद्ध लाभ</span>
                  </div>
                  <button
                    onClick={() => {
                      bhasiniService.speak('उमराने मंडी में 29 अगस्त को आवक कम होने से भाव ₹2,788 तक उछलने का अनुमान है। 5 दिन रुकने पर भाड़ा काटकर भी ₹184/क्विंटल का अतिरिक्त लाभ होगा।');
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#2e7d32] hover:bg-[#388e3c] text-white"
                    title="सलाह सुनें"
                  >
                    <Volume2 className="h-4 w-4 text-[#e09f3e]" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4 Pillars Section (Directly from Hackathon PPT Slides) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#2e7d32] bg-[#2e7d32]/10 px-3 py-1 rounded-full uppercase tracking-wider">
              तकनीकी दृष्टिकोण एवं समाधान
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#14231b] mt-3">
              कृषिवाणी : बोलकर समझो, समझकर बेचो
            </h2>
            <p className="text-gray-600 mt-3 text-sm sm:text-base">
              किसान की सबसे बड़ी उलझन — "कब और कहाँ बेचें?" इसका संपूर्ण AI समाधान
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: AI Price Forecasting */}
            <div className="p-6 rounded-2xl bg-[#F8F9F5] border border-gray-200 hover:border-[#2e7d32] hover:shadow-lg transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2e7d32]/10 text-[#2e7d32] group-hover:bg-[#2e7d32] group-hover:text-white transition-colors mb-4">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#14231b]">AI मूल्य पूर्वानुमान</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">LSTM व FB Prophet मॉडल</p>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                Agmarknet के पिछले 5 वर्षों के आवक व मूल्य रुझानों के आधार पर आगामी 7 से 30 दिनों के मंडी भाव का सटीक अनुमान।
              </p>
            </div>

            {/* Card 2: Bhasini Vernacular Voice */}
            <div className="p-6 rounded-2xl bg-[#F8F9F5] border border-gray-200 hover:border-[#e09f3e] hover:shadow-lg transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e09f3e]/10 text-[#e09f3e] group-hover:bg-[#e09f3e] group-hover:text-[#14231b] transition-colors mb-4">
                <Volume2 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#14231b]">मातृभाषा में आवाज़ सलाह</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">BHASHINI (MeitY) व AI4Bharat</p>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                पढ़ना ज़रूरी नहीं — किसान अपनी स्थानीय बोली में बोलकर पूछ सकता है और बोलती आवाज़ में सुन सकता है कि कब और कहाँ बेचना बेहतर है।
              </p>
            </div>

            {/* Card 3: Net Profit Comparator */}
            <div className="p-6 rounded-2xl bg-[#F8F9F5] border border-gray-200 hover:border-[#2e7d32] hover:shadow-lg transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2e7d32]/10 text-[#2e7d32] group-hover:bg-[#2e7d32] group-hover:text-white transition-colors mb-4">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#14231b]">मुनाफ़ा कैलकुलेटर</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">Net = Price - (Transport + Broker + Decay)</p>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                दलाली, गाड़ी भाड़ा और रास्ते की सड़न घटाकर बताता है कि दूर की चमकती मंडी बेहतर है या पास की स्थानीय मंडी।
              </p>
            </div>

            {/* Card 4: Low Connectivity & SMS */}
            <div className="p-6 rounded-2xl bg-[#F8F9F5] border border-gray-200 hover:border-[#e09f3e] hover:shadow-lg transition-all group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#e09f3e]/10 text-[#e09f3e] group-hover:bg-[#e09f3e] group-hover:text-[#14231b] transition-colors mb-4">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-[#14231b]">धीमे नेटवर्क में भी काम</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1">स्थानीय स्टोरेज व SMS अलर्ट</p>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                2G/3G या बिना इंटरनेट भी फोन में डेटा सुरक्षित रहता है। इंटरनेट न होने पर साधारण फोन पर SMS व IVR से तुरंत सलाह मिलती है।
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* The Core Illusion Problem Explained (As requested by user & images) */}
      <section className="py-16 bg-[#F0F2EB] border-y border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-red-700 bg-red-100 px-3 py-1 rounded-full uppercase">
                किसान की सबसे बड़ी भूल और हमारा समाधान
              </span>
              <h2 className="text-3xl font-extrabold text-[#14231b]">
                "भाव ₹200 ज्यादा दिख रहा है, तो क्या दूर जाना सही है?"
              </h2>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                अधिकतर किसान केवल बोर्ड पर लिखा थोक भाव देखते हैं। जब किसान 100 किमी दूर आगरा या नासिक मंडी जाता है, तो:
              </p>
              <ul className="space-y-2.5 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">1.</span>
                  <span><strong>गाड़ी भाड़ा:</strong> ₹250 से ₹300 प्रति क्विंटल कट जाता है।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">2.</span>
                  <span><strong>अवैध दलाली:</strong> निजी व्यापारी व बिचौलिए 5% से 6% कमीशन काट लेते हैं।</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">3.</span>
                  <span><strong>फसल बर्बादी:</strong> लम्बे सफर व जाम में 2% से 4% प्याज व टमाटर गल जाते हैं।</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => navigate('/app/compare')}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#14231b] hover:bg-[#2e7d32] text-white font-bold px-5 py-3 text-sm transition-colors"
                >
                  <Calculator className="h-4 w-4 text-[#e09f3e]" />
                  <span>अभी लाइव मंडी तुलना करके देखें</span>
                </button>
              </div>
            </div>

            {/* Visual Example Card */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="font-bold text-[#14231b] text-base">वास्तविक तुलना उदाहरण (40 क्विंटल प्याज)</span>
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">
                    ग्वालियर बनाम आगरा मंडी
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Mandi A (Nearby) */}
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <span className="text-xs font-bold text-emerald-800 block">पास की मंडी: डबरा (42 किमी)</span>
                    <div className="text-lg font-black text-gray-900">भाव: ₹2,540/क्विंटल</div>
                    <div className="text-xs text-gray-600 space-y-1 pt-1 border-t border-emerald-200">
                      <div>भाड़ा: -₹110/qtl</div>
                      <div>दलाली (2%): -₹50/qtl</div>
                      <div>सड़न: नगण्य</div>
                    </div>
                    <div className="pt-2 border-t border-emerald-200 font-extrabold text-sm text-[#2e7d32]">
                      शुद्ध हाथ में: ₹2,360/qtl <br />
                      <span className="text-xs font-bold text-gray-700">कुल: ₹94,400</span>
                    </div>
                    <div className="text-[11px] font-bold text-emerald-800 bg-emerald-200/60 p-1.5 rounded text-center">
                      ✅ ₹8,800 का अधिक फायदा!
                    </div>
                  </div>

                  {/* Mandi B (Trap Far) */}
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-2">
                    <span className="text-xs font-bold text-red-800 block">दूर की मंडी: आगरा (128 किमी)</span>
                    <div className="text-lg font-black text-gray-900">भाव: ₹2,790/क्विंटल</div>
                    <div className="text-xs text-gray-600 space-y-1 pt-1 border-t border-red-200">
                      <div>भाड़ा: -₹290/qtl</div>
                      <div>दलाली (5.5%): -₹153/qtl</div>
                      <div>सड़न (2.5%): -₹69/qtl</div>
                    </div>
                    <div className="pt-2 border-t border-red-200 font-extrabold text-sm text-red-700">
                      शुद्ध हाथ में: ₹2,140/qtl <br />
                      <span className="text-xs font-bold text-gray-700">कुल: ₹85,600</span>
                    </div>
                    <div className="text-[11px] font-bold text-red-800 bg-red-200/60 p-1.5 rounded text-center">
                      ⚠️ ₹8,800 का सीधा नुकसान!
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg border">
                  <strong>निष्कर्ष:</strong> आगरा में ₹250 अधिक भाव दिखने के बावजूद, भारी भाड़े व 5.5% दलाली के कारण किसान को <strong>₹8,800 का शुद्ध घाटा</strong> हुआ! कृषिवाणी यही भ्रामक भाव पकड़ता है।
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#14231b] text-gray-400 py-12 border-t border-[#2d6a4f]/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <span className="font-extrabold text-xl text-white">कृषि<span className="text-[#e09f3e]">वाणी</span></span>
              <p className="text-xs leading-relaxed">
                किसानों के लिए बोलती हुई फसल-मूल्य व शुद्ध मुनाफ़ा सहायक। ग्रामीण विकास एवं वित्तीय समावेशन · भारतीय भाषा एवं एआई।
              </p>
              <div className="text-xs text-[#e09f3e] font-semibold">
                हैकाथॉन 2026 · हिंदी क्लब, IIITM ग्वालियर
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3">त्वरित नेविगेशन</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => navigate('/app')} className="hover:text-white">आज का निर्णय (Dashboard)</button></li>
                <li><button onClick={() => navigate('/app/compare')} className="hover:text-white">मंडी तुलना व शुद्ध मुनाफ़ा</button></li>
                <li><button onClick={() => navigate('/app/holdings')} className="hover:text-white">फसल स्टॉक (Holdings)</button></li>
                <li><button onClick={() => navigate('/app/voice')} className="hover:text-white">भाषिणी आवाज़ कमरा (Voice)</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3">सरकारी डेटा व AI स्रोत</h4>
              <ul className="space-y-2 text-xs">
                <li>Agmarknet पोर्टल (कृषि मंत्रालय, भारत सरकार)</li>
                <li>e-NAM (राष्ट्रीय कृषि बाजार)</li>
                <li>BHASHINI (राष्ट्रीय भाषा अनुवाद मिशन, MeitY)</li>
                <li>AI4Bharat वाक्-पहचान व अनुवाद</li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-3">टीम HD Falcons</h4>
              <p className="text-xs leading-relaxed">
                दिव्यांश वर्मा · हर्षित गुप्ता <br />
                अटल बिहारी वाजपेयी - IIITM ग्वालियर
              </p>
              <div className="mt-3">
                <button
                  onClick={() => navigate('/demo')}
                  className="text-xs bg-[#2e7d32] text-white px-3 py-1.5 rounded-lg hover:bg-[#388e3c] font-semibold inline-flex items-center gap-1.5"
                >
                  <PlayCircle className="h-3.5 w-3.5 text-[#e09f3e]" />
                  <span>वॉकथ्रू डेमो देखें</span>
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#2d6a4f]/20 pt-6 text-center text-xs text-gray-500">
            © 2026 कृषिवाणी (KrishiVaani) · सर्वाधिकार सुरक्षित · भारत सरकार के डिजिटल समावेशन मिशन को समर्पित
          </div>
        </div>
      </footer>

    </div>
  );
}

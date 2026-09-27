import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  TrendingUp, 
  Calculator, 
  Mic, 
  Layers, 
  Database,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { bhasiniService } from '../services/bhasiniService';

export default function DemoPage({ navigate, onOpenVoiceModal }) {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      stepNumber: 1,
      title: 'डेटा संग्रह (Data Ingestion)',
      subtitle: 'Agmarknet व eNAM से सजीव मंडी भाव',
      icon: Database,
      badge: 'चरण 1',
      description: 'भारत सरकार के Agmarknet पोर्टल और राष्ट्रीय कृषि बाजार (eNAM) से देश भर की 2,500 से अधिक APMC मंडियों का दैनिक न्यूनतम, अधिकतम, औसत (Modal) थोक भाव व दैनिक आवक (क्विंटल में) एकत्र किया जाता है।',
      techUsed: 'Agmarknet API, eNAM Data Pipelines, Spatial Mapping',
      voicePrompt: 'पहला चरण: भारत सरकार के अधिकृत Agmarknet और eNAM पोर्टल से सभी मंडियों का सजीव थोक भाव और आवक डेटा स्वतः एकत्र होता है।'
    },
    {
      stepNumber: 2,
      title: 'AI मूल्य पूर्वानुमान (Price Forecasting)',
      subtitle: 'LSTM व FB Prophet हाइब्रिड मॉडल',
      icon: TrendingUp,
      badge: 'चरण 2',
      description: 'पिछले 5 वर्षों के मौसमी रुझान, वर्षा चक्र, फसल कटाई की तारीखों और आवक के आधार पर हमारा हाइब्रिड AI मॉडल आगामी 7 से 30 दिनों का मूल्य पूर्वानुमान लगाता है और बताता है कि भाव कब शिखर पर पहुंचेगा।',
      techUsed: 'PyTorch LSTM, Facebook Prophet, XGBoost Regression',
      voicePrompt: 'दूसरा चरण: पिछले 5 वर्षों के आंकड़ों और आवक के आधार पर AI मॉडल 7 से 30 दिनों के आगामी मंडी भाव का पूर्वानुमान लगाता है।'
    },
    {
      stepNumber: 3,
      title: 'शुद्ध मुनाफ़ा गणना (Net Profit Comparator)',
      subtitle: 'गाड़ी भाड़ा, दलाली व सड़न काटकर असली गणित',
      icon: Calculator,
      badge: 'चरण 3',
      description: 'असली शुद्ध मुनाफ़ा = मंडी का घोषित भाव - (परिवहन भाड़ा + बिचौलिए की दलाली + रास्ते की सड़न दर + तुलाई शुल्क)। यह इंजन किसान को भ्रामक दूर की चमकती मंडियों के धोखे से बचाता है।',
      techUsed: 'Spatial Distance Matrix, Vehicle Fuel Economics, Perishable Decay Physics',
      voicePrompt: 'तीसरा चरण: शुद्ध मुनाफ़ा कैलकुलेटर परिवहन खर्च, आढ़त दलाली और रास्ते की फसल बर्बादी काटकर बताता है कि किसान के हाथ में असली रोकड़ा कितना आएगा।'
    },
    {
      stepNumber: 4,
      title: 'मातृभाषा में बोलती सलाह (Vernacular Voice)',
      subtitle: 'BHASHINI (MeitY) व AI4Bharat वाक् सहायक',
      icon: Mic,
      badge: 'चरण 4',
      description: 'अंतिम निर्णय को किसान की अपनी बोली में आवाज़ के रूप में बदला जाता है। निरक्षर या कम पढ़े-लिखे किसान भी साधारण फोन या ऐप में एक बटन दबाकर सुन सकते हैं: "कब बेचें और कहाँ बेचें"।',
      techUsed: 'BHASHINI Speech-to-Speech API, AI4Bharat IndicTTS, Twilio/IVR Fallback',
      voicePrompt: 'चौथा चरण: राष्ट्रीय भाषा अनुवाद मिशन भाषिणी के माध्यम से किसान अपनी ही बोली में बोलकर पूछ सकता है और बोलती आवाज़ में सही निर्णय सुन सकता है।'
    }
  ];

  const currentStepData = steps.find(s => s.stepNumber === activeStep) || steps[0];
  const StepIcon = currentStepData.icon;

  const handleSpeakStep = () => {
    bhasiniService.speak(currentStepData.voicePrompt);
  };

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-[#1E2922] pb-24">
      
      {/* Header */}
      <div className="bg-[#14231b] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#2d6a4f]/30">
        <div className="mx-auto max-w-5xl text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b3528] border border-[#e09f3e]/40 text-xs text-[#e09f3e] font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>हैकाथॉन 2026 प्रेजेंटेशन वॉकथ्रू (Four Steps Architecture)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            यह काम कैसे करता है? (How It Works)
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            डेटा संग्रह से लेकर किसान के कान में बोलती सलाह तक — कृषिवाणी की 4-चरणीय वैज्ञानिक कार्यप्रणाली।
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-6 space-y-8">

        {/* 4 Step Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {steps.map((s) => {
            const Icon = s.icon;
            const isActive = activeStep === s.stepNumber;
            return (
              <button
                key={s.stepNumber}
                onClick={() => {
                  setActiveStep(s.stepNumber);
                  bhasiniService.speak(s.voicePrompt);
                }}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  isActive
                    ? 'bg-[#2e7d32] text-white border-[#e09f3e] shadow-xl ring-4 ring-emerald-500/20'
                    : 'bg-white text-gray-800 border-gray-200 hover:border-gray-300 shadow'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                    isActive ? 'bg-[#e09f3e] text-[#14231b]' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {s.badge}
                  </span>
                  <Icon className={`h-5 w-5 ${isActive ? 'text-[#e09f3e]' : 'text-[#2e7d32]'}`} />
                </div>
                <h3 className="font-extrabold text-sm line-clamp-1">{s.title}</h3>
                <p className={`text-[11px] mt-1 line-clamp-1 ${isActive ? 'text-gray-200' : 'text-gray-500'}`}>
                  {s.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Showcase Card */}
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-10 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2e7d32] text-white text-2xl shadow-inner">
                <StepIcon className="h-7 w-7 text-[#e09f3e]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#e09f3e] uppercase tracking-wider block">
                  {currentStepData.badge}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#14231b]">
                  {currentStepData.title}
                </h2>
              </div>
            </div>

            <button
              onClick={handleSpeakStep}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#e09f3e] hover:bg-[#d97706] text-[#14231b] font-bold text-xs sm:text-sm shadow transition-transform hover:scale-105"
            >
              <Volume2 className="h-4 w-4" />
              <span>यह चरण बोलकर सुनें (भाषिणी)</span>
            </button>
          </div>

          <div className="space-y-4">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
              {currentStepData.description}
            </p>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
              <span className="text-xs font-bold text-gray-500 uppercase block mb-1">
                प्रयुक्त तकनीक एवं मॉडल्स (Technologies Used):
              </span>
              <span className="font-mono text-xs sm:text-sm font-bold text-[#2e7d32]">
                {currentStepData.techUsed}
              </span>
            </div>
          </div>

          {/* Interactive Action for this Step */}
          <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <CheckCircle2 className="h-4 w-4 text-[#2e7d32]" />
              <span>सत्यापित एवं कामकाजी प्रोटोटाइप</span>
            </div>

            <div className="flex items-center gap-3">
              {activeStep < 4 ? (
                <button
                  onClick={() => {
                    const next = activeStep + 1;
                    setActiveStep(next);
                    bhasiniService.speak(steps[next - 1].voicePrompt);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2e7d32] hover:bg-[#388e3c] text-white font-bold text-sm shadow transition-colors"
                >
                  <span>अगला चरण देखें</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  onClick={() => navigate('/app')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#e09f3e] hover:bg-[#d97706] text-[#14231b] font-black text-sm shadow transition-colors"
                >
                  <span>मुख्य ऐप में उपयोग करें</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

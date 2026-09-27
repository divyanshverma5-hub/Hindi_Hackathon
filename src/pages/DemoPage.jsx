import React, { useState } from 'react';
import { 
  ArrowRight, 
  Volume2, 
  TrendingUp, 
  Calculator, 
  Mic, 
  Database,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { bhasiniService } from '../services/bhasiniService';

export default function DemoPage({ navigate, onOpenVoiceModal }) {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      stepNumber: 1,
      title: 'डेटा संग्रह',
      subtitle: 'Agmarknet व eNAM से सजीव मंडी भाव',
      icon: Database,
      badge: 'चरण 1',
      description: 'भारत सरकार के Agmarknet पोर्टल और राष्ट्रीय कृषि बाजार (eNAM) से देश भर की APMC मंडियों का दैनिक न्यूनतम, अधिकतम, औसत थोक भाव व दैनिक आवक एकत्र किया जाता है।',
      techUsed: 'Agmarknet API, eNAM Data Pipelines',
      voicePrompt: 'पहला चरण: भारत सरकार के अधिकृत Agmarknet और eNAM पोर्टल से सभी मंडियों का सजीव थोक भाव और आवक डेटा एकत्र होता है।'
    },
    {
      stepNumber: 2,
      title: 'AI मूल्य पूर्वानुमान',
      subtitle: 'LSTM व Prophet हाइब्रिड मॉडल',
      icon: TrendingUp,
      badge: 'चरण 2',
      description: 'पिछले 5 वर्षों के मौसमी रुझान, वर्षा चक्र और आवक के आधार पर हाइब्रिड AI मॉडल आगामी 7 से 30 दिनों का मूल्य पूर्वानुमान लगाता है और बताता है कि भाव कब शिखर पर पहुंचेगा।',
      techUsed: 'PyTorch LSTM, Facebook Prophet',
      voicePrompt: 'दूसरा चरण: पिछले 5 वर्षों के आंकड़ों और आवक के आधार पर AI मॉडल आगामी 7 से 30 दिनों के मंडी भाव का पूर्वानुमान लगाता है।'
    },
    {
      stepNumber: 3,
      title: 'शुद्ध मुनाफ़ा गणना',
      subtitle: 'गाड़ी भाड़ा, दलाली व सड़न काटकर असली गणित',
      icon: Calculator,
      badge: 'चरण 3',
      description: 'असली शुद्ध मुनाफ़ा = मंडी का घोषित भाव - (परिवहन भाड़ा + बिचौलिए की दलाली + रास्ते की सड़न दर + तुलाई शुल्क)। यह इंजन किसान को भ्रामक दूर की मंडियों के नुकसान से बचाता है।',
      techUsed: 'Spatial Distance Matrix, Vehicle Fuel Economics',
      voicePrompt: 'तीसरा चरण: शुद्ध मुनाफ़ा कैलकुलेटर परिवहन खर्च, आढ़त दलाली और रास्ते की फसल बर्बादी काटकर बताता है कि किसान के हाथ में असली रोकड़ा कितना आएगा।'
    },
    {
      stepNumber: 4,
      title: 'मातृभाषा में बोलती सलाह',
      subtitle: 'भाषिणी व IndicTTS वाक् सहायक',
      icon: Mic,
      badge: 'चरण 4',
      description: 'अंतिम निर्णय को किसान की अपनी बोली में आवाज़ के रूप में बदला जाता है। कम पढ़े-लिखे किसान भी साधारण फोन या ऐप में एक बटन दबाकर सुन सकते हैं: कब और कहाँ बेचें।',
      techUsed: 'BHASHINI Speech-to-Speech API, AI4Bharat IndicTTS',
      voicePrompt: 'चौथा चरण: राष्ट्रीय भाषा अनुवाद मिशन भाषिणी के माध्यम से किसान अपनी ही बोली में बोलकर पूछ सकता है और बोलती आवाज़ में सही निर्णय सुन सकता है।'
    }
  ];

  const currentStepData = steps.find(s => s.stepNumber === activeStep) || steps[0];
  const StepIcon = currentStepData.icon;

  const handleSpeakStep = () => {
    bhasiniService.speak(currentStepData.voicePrompt);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] pb-20 transition-colors">
      
      {/* Header */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-color)] bg-[var(--bg-header)] text-center">
        <div className="mx-auto max-w-4xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-green-subtle)] text-[#2e7d32] text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>हैकाथॉन 2026 वॉकथ्रू</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[var(--text-main)]">
            यह काम कैसे करता है?
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto">
            डेटा संग्रह से लेकर बोलती सलाह तक — कृषिवाणी की 4-चरणीय कार्यप्रणाली।
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        {/* 4 Step Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
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
                className={`p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-[#2e7d32] text-white border-[#2e7d32] shadow-sm'
                    : 'bg-[var(--bg-card)] text-[var(--text-main)] border-[var(--border-color)] hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[var(--bg-card-subtle)] text-[var(--text-muted)]'
                  }`}>
                    {s.badge}
                  </span>
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-xs sm:text-sm line-clamp-1">{s.title}</h3>
                <p className={`text-[10px] line-clamp-1 mt-0.5 ${isActive ? 'text-gray-200' : 'text-[var(--text-muted)]'}`}>
                  {s.subtitle}
                </p>
              </button>
            );
          })}
        </div>

        {/* Showcase Card */}
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5 sm:p-7 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#2e7d32] text-white">
                <StepIcon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#2e7d32] uppercase block">
                  {currentStepData.badge}
                </span>
                <h2 className="text-xl font-bold text-[var(--text-main)]">
                  {currentStepData.title}
                </h2>
              </div>
            </div>

            <button
              onClick={handleSpeakStep}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] text-xs font-semibold"
            >
              <Volume2 className="h-3.5 w-3.5 text-[#2e7d32]" />
              <span>बोलकर सुनें</span>
            </button>
          </div>

          <p className="text-sm text-[var(--text-main)] leading-relaxed">
            {currentStepData.description}
          </p>

          <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs">
            <span className="text-[var(--text-muted)] block mb-0.5">तकनीक:</span>
            <span className="font-mono font-bold text-[#2e7d32]">
              {currentStepData.techUsed}
            </span>
          </div>

          <div className="pt-3 border-t border-[var(--border-color)] flex justify-end">
            {activeStep < 4 ? (
              <button
                onClick={() => {
                  const next = activeStep + 1;
                  setActiveStep(next);
                  bhasiniService.speak(steps[next - 1].voicePrompt);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2e7d32] hover:bg-[#256629] text-white font-bold text-xs"
              >
                <span>अगला चरण</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={() => navigate('/app')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#2e7d32] hover:bg-[#256629] text-white font-bold text-xs"
              >
                <span>ऐप खोलें</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

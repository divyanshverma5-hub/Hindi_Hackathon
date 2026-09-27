import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  Sparkles, 
  ArrowRight, 
  PhoneCall, 
  Radio, 
  MessageSquare,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { bhasiniService } from '../services/bhasiniService';
import { BHASHINI_VOICE_QUERIES } from '../data/mandiData';

export default function VoicePage({ navigate }) {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [typedQuery, setTypedQuery] = useState('');
  const [conversationHistory, setConversationHistory] = useState([
    {
      id: 1,
      query: 'आज प्याज बेचना सही रहेगा या कुछ दिन रुकना चाहिए?',
      reply: 'किसान भाई, हमारे AI मॉडल के अनुसार आपको प्याज 5 दिन रोककर रखना चाहिए। 29 अगस्त को उमराने मंडी में आवक कम होने से भाव ₹2,788 तक जाएगा। इससे आपको ढुलाई खर्च काटकर भी ₹184 प्रति क्विंटल का शुद्ध मुनाफा होगा।',
      badge: 'प्याज AI सलाह',
      actionLink: '/app/crop/onion',
      timestamp: 'आज, दोपहर 1:15'
    },
    {
      id: 2,
      query: 'ग्वालियर और आगरा मंडी में से किसमें ज्यादा शुद्ध पैसा मिलेगा?',
      reply: 'सावधान किसान भाई! आगरा मंडी में दिखने वाला भाव ₹2,790 है जो ग्वालियर से ₹370 अधिक दिखता है, लेकिन 128 किमी का भारी भाड़ा और वहां के आढ़तियों की 5.5% दलाली के कारण आपको उल्टे ₹220 प्रति क्विंटल का घाटा होगा! पास की डबरा या ग्वालियर मंडी में बेचना ही सबसे अकलमंदी है।',
      badge: 'मंडी तुलना',
      actionLink: '/app/compare',
      timestamp: 'आज, सुबह 11:40'
    }
  ]);
  const [statusMessage, setStatusMessage] = useState('माइक दबाकर अपनी बोली में बोलें...');

  useEffect(() => {
    const unsub = bhasiniService.subscribe((event) => {
      if (event.type === 'listening_start') {
        setIsListening(true);
        setStatusMessage('सुन रहा हूँ... अपनी बात कहें...');
      }
      if (event.type === 'listening_end') {
        setIsListening(false);
        if (event.transcript) {
          handleExecuteQuery(event.transcript);
        } else {
          setStatusMessage('आवाज़ नहीं मिली। कृपया माइक दबाकर पुनः बोलें।');
        }
      }
      if (event.type === 'speaking_start') {
        setIsPlaying(true);
      }
      if (event.type === 'speaking_end') {
        setIsPlaying(false);
      }
    });
    return unsub;
  }, []);

  const handleStartMic = () => {
    if (isPlaying) bhasiniService.stopSpeaking();
    bhasiniService.startListening({
      onResult: (text) => handleExecuteQuery(text),
      onError: (err) => setStatusMessage(err)
    });
  };

  const handleExecuteQuery = (text) => {
    if (!text || !text.trim()) return;
    setStatusMessage('भाषिणी AI विश्लेषण कर रहा है...');
    const result = bhasiniService.processHindiQuery(text);

    const newEntry = {
      id: Date.now(),
      query: text,
      reply: result.reply,
      badge: result.badge,
      actionLink: result.actionLink,
      timestamp: 'अभी'
    };

    setConversationHistory([newEntry, ...conversationHistory]);
    setStatusMessage('सलाह तैयार है! सुनिए...');
    bhasiniService.speak(result.reply, null, () => {
      setStatusMessage('माइक दबाकर नया प्रश्न पूछें...');
    });
  };

  const handlePlayAudio = (replyText) => {
    if (isPlaying) {
      bhasiniService.stopSpeaking();
    } else {
      bhasiniService.speak(replyText);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-[#1E2922] pb-24">
      
      {/* Header */}
      <div className="bg-[#14231b] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#2d6a4f]/30">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1b3528] border border-[#e09f3e]/40 text-xs text-[#e09f3e] font-bold">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
            <span>राष्ट्रीय भाषा अनुवाद मिशन (MeitY) · भाषिणी Voice Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            बोलकर समझो, समझकर बेचो
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
            पढ़ना-लिखना जरूरी नहीं। माइक दबाएं और सीधे अपनी भाषा में पूछें। कृषिवाणी बोलकर समझाएगा कि कब और कहाँ बेचना बेहतर है।
          </p>

          {/* Big Center Microphone */}
          <div className="pt-4 flex flex-col items-center justify-center">
            <button
              onClick={isListening ? () => bhasiniService.stopListening() : handleStartMic}
              className={`relative flex h-24 w-24 items-center justify-center rounded-3xl shadow-2xl transition-all transform hover:scale-105 ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse ring-8 ring-red-400'
                  : 'bg-gradient-to-br from-[#e09f3e] via-[#d97706] to-[#b45309] text-[#14231b]'
              }`}
              title="बोलने के लिए दबाएं"
            >
              {isListening ? <MicOff className="h-10 w-10" /> : <Mic className="h-10 w-10" />}
              
              {/* Ripple circles when listening */}
              {isListening && (
                <span className="absolute -inset-2 rounded-3xl border-2 border-red-400 animate-ping opacity-75"></span>
              )}
            </button>

            <span className="mt-3 text-xs sm:text-sm font-bold text-[#e09f3e]">
              {statusMessage}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-6 space-y-6">

        {/* Text Input Bar (For Typing Alternative) */}
        <div className="rounded-2xl bg-white p-3 shadow-lg border border-gray-200 flex items-center gap-2">
          <input
            type="text"
            value={typedQuery}
            onChange={(e) => setTypedQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleExecuteQuery(typedQuery);
                setTypedQuery('');
              }
            }}
            placeholder="यदि लिखना चाहें तो यहाँ प्रश्न लिखें (उदा. टमाटर कब बेचें?)..."
            className="w-full px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={() => {
              handleExecuteQuery(typedQuery);
              setTypedQuery('');
            }}
            className="px-5 py-2.5 rounded-xl bg-[#2e7d32] hover:bg-[#388e3c] text-white font-bold text-xs shrink-0 transition-colors shadow"
          >
            पूछें
          </button>
        </div>

        {/* Quick Voice Topics */}
        <div className="rounded-2xl bg-white p-5 border border-gray-200 shadow-md space-y-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
            एक क्लिक में सुनें (One-Tap Voice Prompts):
          </span>
          <div className="grid sm:grid-cols-2 gap-3">
            {BHASHINI_VOICE_QUERIES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleExecuteQuery(preset.queryText)}
                className="text-left p-3 rounded-xl bg-gray-50 hover:bg-emerald-50/70 border border-gray-200 hover:border-[#2e7d32] transition-all text-xs font-semibold text-gray-800 flex items-center justify-between group"
              >
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-[#e09f3e] group-hover:scale-110" />
                  <span>{preset.queryText}</span>
                </div>
                <span className="text-[10px] text-gray-400 bg-white px-2 py-0.5 rounded border">
                  {preset.audioBadge}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Stream History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-[#14231b] flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#2e7d32]" />
              <span>हाल ही में पूछे गए सवाल व बोलती सलाह:</span>
            </h3>
            <span className="text-xs text-gray-500">{conversationHistory.length} संवाद</span>
          </div>

          {conversationHistory.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-white border border-gray-200 p-5 sm:p-6 shadow-md space-y-3 transition-all hover:border-[#2e7d32]"
            >
              {/* Question */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 font-bold text-gray-900 text-sm sm:text-base">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-[#2e7d32] text-xs shrink-0 font-mono">
                    Q
                  </span>
                  <span>"{item.query}"</span>
                </div>
                <span className="text-[11px] text-gray-400 shrink-0">{item.timestamp}</span>
              </div>

              {/* Spoken Answer */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#14231b] to-[#1b3528] text-white space-y-2 border border-[#2d6a4f]/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#e09f3e] bg-black/40 px-2.5 py-0.5 rounded-full border border-[#e09f3e]/30">
                    {item.badge}
                  </span>

                  <button
                    onClick={() => handlePlayAudio(item.reply)}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#2e7d32] hover:bg-[#388e3c] text-white text-xs font-bold transition-colors"
                  >
                    <Volume2 className="h-3.5 w-3.5 text-[#e09f3e]" />
                    <span>आवाज़ में सुनें</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-medium">
                  {item.reply}
                </p>

                {item.actionLink && (
                  <div className="pt-2 border-t border-[#2d6a4f]/40 flex justify-end">
                    <button
                      onClick={() => navigate(item.actionLink)}
                      className="text-xs font-bold text-[#e09f3e] hover:underline flex items-center gap-1"
                    >
                      <span>संबंधित गणित व रिपोर्ट देखें</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

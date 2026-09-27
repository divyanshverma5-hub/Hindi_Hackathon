import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, ArrowRight, CornerDownLeft } from 'lucide-react';
import { bhasiniService } from '../services/bhasiniService';
import { BHASHINI_VOICE_QUERIES } from '../data/mandiData';

export default function VoiceAssistantModal({ isOpen, onClose, navigate }) {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [activeConversation, setActiveConversation] = useState({
    query: 'आज प्याज कहाँ बेचना बेहतर रहेगा?',
    reply: 'किसान भाई, हमारे AI मॉडल के अनुसार आपको प्याज 5 दिन रोककर रखना चाहिए। 29 अगस्त को उमराने मंडी में आवक कम होने से भाव ₹2,788 तक जाएगा। इससे आपको ढुलाई खर्च काटकर भी ₹184 प्रति क्विंटल का शुद्ध मुनाफा होगा।',
    badge: 'भाषिणी प्याज सलाह',
    actionLink: '/app/crop/onion'
  });
  const [statusMessage, setStatusMessage] = useState('बोलने के लिए माइक दबाएं या नीचे दिए प्रश्न चुनें');

  useEffect(() => {
    const unsub = bhasiniService.subscribe((event) => {
      if (event.type === 'listening_start') {
        setIsListening(true);
        setStatusMessage('सुन रहा हूँ... अपनी भाषा में बोलें...');
      }
      if (event.type === 'listening_end') {
        setIsListening(false);
        if (event.transcript) {
          handleProcessQuery(event.transcript);
        } else {
          setStatusMessage('आवाज़ नहीं सुनी जा सकी। कृपया पुनः बोलें।');
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

  if (!isOpen) return null;

  const handleStartMic = () => {
    if (isPlaying) bhasiniService.stopSpeaking();
    bhasiniService.startListening({
      onResult: (text) => {
        setQueryInput(text);
        handleProcessQuery(text);
      },
      onError: (err) => {
        setStatusMessage(err);
      }
    });
  };

  const handleStopMic = () => {
    bhasiniService.stopListening();
  };

  const handleProcessQuery = (text) => {
    if (!text || !text.trim()) return;
    setStatusMessage('भाषिणी AI विश्लेषण कर रहा है...');
    const result = bhasiniService.processHindiQuery(text);
    setActiveConversation(result);
    setStatusMessage('सलाह तैयार है! सुनिए...');
    
    // Automatically speak out the response in Hindi
    bhasiniService.speak(result.reply, null, () => {
      setStatusMessage('बोलने के लिए माइक दबाएं या नया प्रश्न पूछें');
    });
  };

  const handleSelectPreset = (preset) => {
    setQueryInput(preset.queryText);
    const result = {
      query: preset.queryText,
      reply: preset.replyText,
      badge: preset.audioBadge,
      actionLink: preset.actionLink
    };
    setActiveConversation(result);
    setStatusMessage('सलाह सुनिए...');
    bhasiniService.speak(preset.replyText, null, () => {
      setStatusMessage('बोलने के लिए माइक दबाएं या नया प्रश्न पूछें');
    });
  };

  const handleToggleAudio = () => {
    if (isPlaying) {
      bhasiniService.stopSpeaking();
    } else if (activeConversation?.reply) {
      bhasiniService.speak(activeConversation.reply);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#14231b] border border-[#2d6a4f] text-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2d6a4f]/40 bg-[#1b3528]/80">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2e7d32] border border-[#e09f3e]/40 shadow-inner">
              <Sparkles className="h-5 w-5 text-[#e09f3e]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-white">कृषिवाणी — भाषिणी आवाज़ सहायक</h3>
                <span className="text-[10px] bg-[#e09f3e] text-[#14231b] font-bold px-2 py-0.5 rounded-full uppercase">
                  BHASHINI MeitY
                </span>
              </div>
              <p className="text-xs text-gray-300">अपनी मातृभाषा में बोलकर पूछें, AI बोलकर समझाएगा</p>
            </div>
          </div>
          <button
            onClick={() => {
              bhasiniService.stopSpeaking();
              bhasiniService.stopListening();
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-[#2d6a4f]/40 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conversation Display Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Active Audio Waveform Animation */}
          <div className="flex flex-col items-center justify-center py-4 bg-[#0f1914] rounded-2xl border border-[#2d6a4f]/30 px-4">
            <div className="flex items-center justify-center gap-1.5 h-14 mb-2">
              <span className={`w-1.5 bg-[#e09f3e] rounded-full transition-all ${isPlaying || isListening ? 'animate-audio-bar-1' : 'h-3'}`}></span>
              <span className={`w-1.5 bg-[#40916c] rounded-full transition-all ${isPlaying || isListening ? 'animate-audio-bar-2' : 'h-6'}`}></span>
              <span className={`w-1.5 bg-[#e09f3e] rounded-full transition-all ${isPlaying || isListening ? 'animate-audio-bar-3' : 'h-10'}`}></span>
              <span className={`w-1.5 bg-[#52b788] rounded-full transition-all ${isPlaying || isListening ? 'animate-audio-bar-4' : 'h-5'}`}></span>
              <span className={`w-1.5 bg-[#e09f3e] rounded-full transition-all ${isPlaying || isListening ? 'animate-audio-bar-5' : 'h-2'}`}></span>
            </div>
            
            <p className="text-xs text-[#e09f3e] font-medium tracking-wide">
              {statusMessage}
            </p>
          </div>

          {/* User's Spoken Query Bubble */}
          {activeConversation?.query && (
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-[#2e7d32] p-4 text-white shadow-md">
                <div className="flex items-center gap-2 mb-1 text-[11px] text-[#e09f3e] font-semibold">
                  <Mic className="h-3.5 w-3.5" />
                  <span>किसान का प्रश्न:</span>
                </div>
                <p className="text-sm sm:text-base font-medium leading-relaxed">
                  "{activeConversation.query}"
                </p>
              </div>
            </div>
          )}

          {/* AI Response Bubble with Audio Playback */}
          {activeConversation?.reply && (
            <div className="flex justify-start">
              <div className="max-w-[90%] rounded-2xl rounded-tl-none bg-[#1b3528] border border-[#2d6a4f] p-4 text-white shadow-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#e09f3e] bg-[#0f1914] px-2.5 py-0.5 rounded-full border border-[#e09f3e]/30">
                      {activeConversation.badge || 'कृषिवाणी AI'}
                    </span>
                    <span className="text-[11px] text-gray-400">आवाज़ सलाह</span>
                  </div>

                  <button
                    onClick={handleToggleAudio}
                    className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#2e7d32] hover:bg-[#388e3c] text-white transition-colors"
                  >
                    {isPlaying ? <VolumeX className="h-3.5 w-3.5 text-[#e09f3e]" /> : <Volume2 className="h-3.5 w-3.5 text-[#e09f3e]" />}
                    <span>{isPlaying ? 'आवाज़ रोकें' : 'पुनः सुनें'}</span>
                  </button>
                </div>

                <p className="text-sm sm:text-base text-gray-100 font-medium leading-relaxed">
                  {activeConversation.reply}
                </p>

                {activeConversation.actionLink && (
                  <div className="pt-2 border-t border-[#2d6a4f]/40 flex justify-end">
                    <button
                      onClick={() => {
                        bhasiniService.stopSpeaking();
                        onClose();
                        navigate(activeConversation.actionLink);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#e09f3e] hover:text-white transition-colors bg-[#0f1914] px-3 py-1.5 rounded-lg border border-[#e09f3e]/40 hover:bg-[#2e7d32]"
                    >
                      <span>विस्तृत रिपोर्ट व गणित देखें</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Clickable Spoken Questions */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider block">
              अक्सर पूछे जाने वाले सवाल (क्लिक करें):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BHASHINI_VOICE_QUERIES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectPreset(item)}
                  className="text-left p-2.5 rounded-xl bg-[#0f1914]/80 border border-[#2d6a4f]/40 hover:border-[#e09f3e] hover:bg-[#1b3528] transition-all text-xs text-gray-200 group flex items-start gap-2"
                >
                  <Volume2 className="h-3.5 w-3.5 text-[#e09f3e] shrink-0 mt-0.5 group-hover:scale-110" />
                  <span className="line-clamp-2 leading-relaxed">{item.queryText}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Bar with Big Mic Button */}
        <div className="p-4 border-t border-[#2d6a4f]/40 bg-[#1b3528] flex items-center gap-3">
          <button
            onClick={isListening ? handleStopMic : handleStartMic}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-lg transition-all ${
              isListening
                ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-400'
                : 'bg-gradient-to-br from-[#e09f3e] to-[#d97706] text-[#14231b] hover:scale-105'
            }`}
            title={isListening ? 'बोलना बंद करें' : 'बोलकर पूछें'}
          >
            {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </button>

          <div className="relative flex-1">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleProcessQuery(queryInput);
              }}
              placeholder="यहाँ अपनी फसल या मंडी का नाम लिखें या ऊपर माइक दबाएं..."
              className="w-full rounded-xl bg-[#0f1914] border border-[#2d6a4f] px-4 py-3 text-sm text-white placeholder-gray-400 focus:border-[#e09f3e] focus:outline-none pr-10"
            />
            <button
              onClick={() => handleProcessQuery(queryInput)}
              className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-[#2e7d32] text-white hover:bg-[#388e3c] transition-colors"
            >
              <CornerDownLeft className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

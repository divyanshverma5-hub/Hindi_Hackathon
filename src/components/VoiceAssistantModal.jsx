import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, X, ArrowRight, CornerDownLeft, AlertCircle } from 'lucide-react';
import { bhasiniService } from '../services/bhasiniService';
import { BHASHINI_VOICE_QUERIES, CROPS } from '../data/mandiData';
import { getCropDynamicTimeline } from '../utils/dateUtils';

export default function VoiceAssistantModal({ isOpen, onClose, navigate }) {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queryInput, setQueryInput] = useState('');
  const [interimSpeech, setInterimSpeech] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [rawErrorCode, setRawErrorCode] = useState(null);

  // Dynamic default conversation initialized from today's live crop timeline
  const [activeConversation, setActiveConversation] = useState(() => {
    const onionTimeline = getCropDynamicTimeline(CROPS[0]);
    return {
      query: 'आज प्याज कहाँ बेचना बेहतर रहेगा?',
      reply: onionTimeline.spokenAdvice,
      badge: 'प्याज सलाह',
      actionLink: '/app/crop/onion'
    };
  });

  const [statusMessage, setStatusMessage] = useState('बोलने के लिए माइक दबाएं या नीचे दिए प्रश्न चुनें');

  useEffect(() => {
    const unsub = bhasiniService.subscribe((event) => {
      if (event.type === 'listening_start') {
        setIsListening(true);
        setErrorMessage(null);
        setRawErrorCode(null);
        setInterimSpeech('');
        setStatusMessage('सुन रहा हूँ... अपनी भाषा में बोलें...');
      }
      if (event.type === 'listening_interim') {
        setInterimSpeech(event.transcript);
        setStatusMessage(`पहचाना जा रहा है: "${event.transcript}"`);
      }
      if (event.type === 'listening_result') {
        setIsListening(false);
        setInterimSpeech('');
        if (event.transcript) {
          setQueryInput(event.transcript);
          handleProcessQuery(event.transcript);
        }
      }
      if (event.type === 'listening_error') {
        setIsListening(false);
        setRawErrorCode(event.error);
        setErrorMessage(event.message || `माइक त्रुटि [${event.error}]`);
        setStatusMessage('माइक में समस्या आई');
      }
      if (event.type === 'listening_end') {
        setIsListening(false);
        if (event.transcript) {
          setQueryInput(event.transcript);
          handleProcessQuery(event.transcript);
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

  const handleStartMic = async () => {
    if (isPlaying) bhasiniService.stopSpeaking();
    setErrorMessage(null);
    setRawErrorCode(null);
    setInterimSpeech('');
    setStatusMessage('माइक प्रारंभ हो रहा है...');

    bhasiniService.startListening({
      onResult: (text) => {
        setQueryInput(text);
        handleProcessQuery(text);
      },
      onInterim: (text) => {
        setInterimSpeech(text);
      },
      onError: (err, code) => {
        setErrorMessage(err);
        setRawErrorCode(code);
        setStatusMessage('माइक में समस्या आई');
      }
    });
  };

  const handleStopMic = () => {
    bhasiniService.stopListening();
  };

  const handleProcessQuery = (text) => {
    if (!text || !text.trim()) return;
    setStatusMessage('AI विश्लेषण कर रहा है...');
    const result = bhasiniService.processHindiQuery(text);
    if (!result) return;

    setActiveConversation(result);
    setStatusMessage('सलाह तैयार है! सुनिए...');
    
    bhasiniService.speak(result.reply, null, () => {
      setStatusMessage('बोलने के लिए माइक दबाएं या नया प्रश्न पूछें');
    });
  };

  const handleSelectPreset = (preset) => {
    setQueryInput(preset.queryText);
    setErrorMessage(null);
    setRawErrorCode(null);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)] bg-[var(--bg-card-subtle)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand-green)] text-white shadow-sm">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-bold text-lg text-[var(--text-main)]">कृषिवाणी बोलती सलाह</h3>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  भाषिणी
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">अपनी बोली में पूछें, AI बोलकर समझाएगा</p>
            </div>
          </div>
          <button
            onClick={() => {
              bhasiniService.stopSpeaking();
              bhasiniService.stopListening();
              onClose();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-card-subtle)] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conversation Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {/* Active Audio Waveform or Status Box */}
          <div className="flex flex-col items-center justify-center py-5 bg-[var(--bg-card-subtle)] rounded-2xl border border-[var(--border-color)] px-4">
            <div className="flex items-center justify-center gap-2 h-10 mb-2">
              <span className={`w-2 bg-[var(--brand-green)] rounded-full transition-all ${isPlaying || isListening ? 'animate-audio-bar-1' : 'h-2'}`}></span>
              <span className={`w-2 bg-[var(--accent-gold)] rounded-full transition-all ${isPlaying || isListening ? 'animate-audio-bar-2' : 'h-5'}`}></span>
              <span className={`w-2 bg-[var(--brand-green)] rounded-full transition-all ${isPlaying || isListening ? 'animate-audio-bar-3' : 'h-8'}`}></span>
              <span className={`w-2 bg-[var(--accent-gold)] rounded-full transition-all ${isPlaying || isListening ? 'animate-audio-bar-4' : 'h-4'}`}></span>
              <span className={`w-2 bg-[var(--brand-green)] rounded-full transition-all ${isPlaying || isListening ? 'animate-audio-bar-5' : 'h-2'}`}></span>
            </div>
            
            <p className="text-xs sm:text-sm text-[var(--text-main)] font-semibold text-center">
              {interimSpeech ? (
                <span className="text-[var(--brand-green)]">पहचाना जा रहा है: "{interimSpeech}"</span>
              ) : (
                statusMessage
              )}
            </p>

            {/* Error Message with code */}
            {errorMessage && (
              <div className="mt-3 flex items-center gap-2 p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-medium">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="flex-1">{errorMessage}</span>
                {rawErrorCode && (
                  <span className="font-mono text-[10px] bg-red-200 dark:bg-red-900 px-1.5 py-0.5 rounded text-red-900 dark:text-red-100 shrink-0">
                    कोड: {rawErrorCode}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* User's Spoken Query */}
          {activeConversation?.query && (
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-[var(--brand-green)] p-4 text-white shadow-sm">
                <span className="text-[11px] text-emerald-200 font-bold block mb-0.5">आपका प्रश्न:</span>
                <p className="text-sm font-semibold leading-relaxed">
                  "{activeConversation.query}"
                </p>
              </div>
            </div>
          )}

          {/* AI Response Bubble */}
          {activeConversation?.reply && (
            <div className="flex justify-start">
              <div className="max-w-[90%] rounded-2xl rounded-tl-none bg-[var(--bg-card-subtle)] border border-[var(--border-color)] p-4 sm:p-5 text-[var(--text-main)] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[var(--brand-green)] bg-[var(--brand-green-subtle)] px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    {activeConversation.badge || 'कृषिवाणी AI'}
                  </span>

                  <button
                    onClick={handleToggleAudio}
                    className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-white transition-colors"
                  >
                    {isPlaying ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                    <span>{isPlaying ? 'रोकें' : 'पुनः सुनें'}</span>
                  </button>
                </div>

                <p className="text-sm sm:text-base leading-relaxed font-medium">
                  {activeConversation.reply}
                </p>

                {activeConversation.actionLink && (
                  <div className="pt-2 border-t border-[var(--border-color)] flex justify-end">
                    <button
                      onClick={() => {
                        bhasiniService.stopSpeaking();
                        onClose();
                        navigate(activeConversation.actionLink);
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--brand-green)] hover:underline"
                    >
                      <span>विस्तृत विवरण देखें</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick Clickable Spoken Questions */}
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
              अक्सर पूछे जाने वाले सवाल:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {BHASHINI_VOICE_QUERIES.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectPreset(item)}
                  className="text-left p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] hover:border-[var(--brand-green)] transition-all text-xs text-[var(--text-main)] group flex items-start gap-2.5"
                >
                  <Volume2 className="h-4 w-4 text-[var(--brand-green)] shrink-0 mt-0.5" />
                  <span className="line-clamp-2 leading-relaxed font-medium">{item.queryText}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input Bar with Animated Ripple Mic Button */}
        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card-subtle)] flex items-center gap-3">
          <button
            onClick={isListening ? handleStopMic : handleStartMic}
            className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-md transition-all ${
              isListening
                ? 'bg-red-600 text-white animate-pulse ring-4 ring-red-300 dark:ring-red-900'
                : 'bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-white hover:scale-105'
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
              placeholder="यहाँ प्रश्न लिखें या माइक दबाकर बोलें..."
              className="w-full rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] px-4 py-2.5 text-xs sm:text-sm text-[var(--text-main)] placeholder-gray-400 focus:border-[var(--brand-green)] focus:outline-none pr-10"
            />
            <button
              onClick={() => handleProcessQuery(queryInput)}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--brand-green)] text-white hover:bg-[var(--brand-green-hover)] transition-colors"
            >
              <CornerDownLeft className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

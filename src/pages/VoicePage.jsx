import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Mic, 
  MicOff, 
  ArrowRight, 
  Radio, 
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { bhasiniService } from '../services/bhasiniService';
import { BHASHINI_VOICE_QUERIES } from '../data/mandiData';

export default function VoicePage({ navigate }) {
  const [isListening, setIsListening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [typedQuery, setTypedQuery] = useState('');
  const [interimSpeech, setInterimSpeech] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [rawErrorCode, setRawErrorCode] = useState(null);

  const [conversationHistory, setConversationHistory] = useState([
    {
      id: 1,
      query: 'आज प्याज बेचना सही रहेगा या कुछ दिन रुकना चाहिए?',
      reply: 'किसान भाई, हमारे AI मॉडल के अनुसार आपको प्याज 5 दिन रोककर रखना चाहिए। 29 अगस्त को उमराने मंडी में आवक कम होने से भाव ₹2,788 तक जाएगा। इससे आपको ढुलाई खर्च काटकर भी ₹184 प्रति क्विंटल का शुद्ध मुनाफा होगा।',
      badge: 'प्याज सलाह',
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
        setErrorMessage(null);
        setRawErrorCode(null);
        setInterimSpeech('');
        setStatusMessage('सुन रहा हूँ... अपनी बात कहें...');
      }
      if (event.type === 'listening_interim') {
        setInterimSpeech(event.transcript);
        setStatusMessage(`पहचाना जा रहा है: "${event.transcript}"`);
      }
      if (event.type === 'listening_result') {
        setIsListening(false);
        setInterimSpeech('');
        if (event.transcript) {
          handleExecuteQuery(event.transcript);
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
          handleExecuteQuery(event.transcript);
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

  const handleStartMic = async () => {
    if (isPlaying) bhasiniService.stopSpeaking();
    setErrorMessage(null);
    setRawErrorCode(null);
    setInterimSpeech('');
    setStatusMessage('माइक प्रारंभ हो रहा है...');

    bhasiniService.startListening({
      onResult: (text) => handleExecuteQuery(text),
      onInterim: (text) => setInterimSpeech(text),
      onError: (err, code) => {
        setErrorMessage(err);
        setRawErrorCode(code);
        setStatusMessage('माइक में समस्या आई');
      }
    });
  };

  const handleExecuteQuery = (text) => {
    if (!text || !text.trim()) return;
    setStatusMessage('AI विश्लेषण कर रहा है...');
    const result = bhasiniService.processHindiQuery(text);
    if (!result) return;

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
    <div className="min-h-screen pb-20 bg-[var(--bg-page)] text-[var(--text-main)] transition-colors">
      
      {/* Header */}
      <div className="py-10 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-color)] bg-[var(--bg-header)] text-center">
        <div className="mx-auto max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--brand-green-subtle)] text-[#2e7d32] text-xs font-bold">
            <Radio className="h-3.5 w-3.5" />
            <span>भाषिणी वाक् सहायक</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            बोलकर समझो, समझकर बेचो
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto">
            माइक दबाएं और सीधे अपनी भाषा में पूछें। कृषिवाणी बोलकर समझाएगा कि कब और कहाँ बेचना बेहतर है।
          </p>

          {/* Center Mic Button */}
          <div className="pt-4 flex flex-col items-center justify-center">
            <button
              onClick={isListening ? () => bhasiniService.stopListening() : handleStartMic}
              className={`flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg transition-all transform hover:scale-105 ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse ring-8 ring-red-200 dark:ring-red-900'
                  : 'bg-[#2e7d32] hover:bg-[#256629] text-white'
              }`}
              title="बोलने के लिए दबाएं"
            >
              {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </button>

            <span className="mt-3 text-xs sm:text-sm font-semibold text-[var(--text-main)]">
              {interimSpeech ? `सुन रहा हूँ: "${interimSpeech}"` : statusMessage}
            </span>

            {/* Error Message with Code */}
            {errorMessage && (
              <div className="mt-2.5 max-w-md flex items-center gap-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-medium text-left">
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
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        {/* Text Input Option */}
        <div className="rounded-xl bg-[var(--bg-card)] p-2 shadow-sm border border-[var(--border-color)] flex items-center gap-2">
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
            placeholder="यहाँ प्रश्न लिखें या ऊपर माइक दबाएं..."
            className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent text-[var(--text-main)] placeholder-gray-400 focus:outline-none"
          />
          <button
            onClick={() => {
              handleExecuteQuery(typedQuery);
              setTypedQuery('');
            }}
            className="px-4 py-2 rounded-lg bg-[#2e7d32] hover:bg-[#256629] text-white font-bold text-xs shrink-0 transition-colors shadow-sm"
          >
            पूछें
          </button>
        </div>

        {/* Quick Voice Topics */}
        <div className="rounded-xl bg-[var(--bg-card)] p-4 border border-[var(--border-color)] shadow-sm space-y-2.5">
          <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-wider block">
            एक क्लिक में पूछें:
          </span>
          <div className="grid sm:grid-cols-2 gap-2">
            {BHASHINI_VOICE_QUERIES.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleExecuteQuery(preset.queryText)}
                className="text-left p-2.5 rounded-lg bg-[var(--bg-card-subtle)] hover:bg-[var(--brand-green-subtle)] border border-[var(--border-color)] hover:border-[#2e7d32] transition-all text-xs font-medium text-[var(--text-main)] flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Volume2 className="h-3.5 w-3.5 text-[#2e7d32]" />
                  <span>{preset.queryText}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[var(--text-main)] flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-[#2e7d32]" />
              <span>हाल के सवाल व जवाब</span>
            </h3>
            <span className="text-xs text-[var(--text-muted)]">{conversationHistory.length} सवाल</span>
          </div>

          {conversationHistory.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-4 shadow-sm space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="font-semibold text-[var(--text-main)] text-sm">
                  "{item.query}"
                </div>
                <span className="text-[10px] text-[var(--text-muted)] shrink-0">{item.timestamp}</span>
              </div>

              <div className="p-3.5 rounded-lg bg-[var(--bg-card-subtle)] text-[var(--text-main)] space-y-2 border border-[var(--border-color)]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#2e7d32] bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    {item.badge}
                  </span>

                  <button
                    onClick={() => handlePlayAudio(item.reply)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#2e7d32] hover:bg-[#256629] text-white text-xs font-semibold"
                  >
                    <Volume2 className="h-3 w-3" />
                    <span>सुनें</span>
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed font-medium">
                  {item.reply}
                </p>

                {item.actionLink && (
                  <div className="pt-1.5 border-t border-[var(--border-color)] flex justify-end">
                    <button
                      onClick={() => navigate(item.actionLink)}
                      className="text-xs font-semibold text-[#2e7d32] hover:underline flex items-center gap-1"
                    >
                      <span>गणना देखें</span>
                      <ArrowRight className="h-3 w-3" />
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

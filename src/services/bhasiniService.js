// कृषिवाणी (KrishiVaani) - वाक् सहायक व भाषिणी (Speech Recognition & TTS Engine)
// Browser Web Speech API (webkitSpeechRecognition) + SpeechSynthesis with 'hi-IN'
// All voice responses are generated dynamically from today's live crop timeline

import { getBhasiniVoiceQueries, CROPS } from '../data/mandiData';
import { getCropDynamicTimeline } from '../utils/dateUtils';

class BhasiniVoiceService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.activeRecognition = null;
    this.isListening = false;
    this.isPlaying = false;
    this.onStateChangeCallbacks = [];
    this.lastErrorCode = null;
    this.lastErrorMessage = null;
  }

  subscribe(callback) {
    this.onStateChangeCallbacks.push(callback);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter(cb => cb !== callback);
    };
  }

  notify(event) {
    this.onStateChangeCallbacks.forEach(cb => {
      try {
        cb(event);
      } catch (e) {
        console.error('Error in voice service subscriber callback:', e);
      }
    });
  }

  /**
   * Request microphone permission explicitly via getUserMedia
   */
  async requestMicPermission() {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return { ok: true };
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return { ok: true };
    } catch (err) {
      console.warn('[Mic Permission Warning]', err);
      const isDenied = err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError';
      const isNotFound = err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError';
      return {
        ok: false,
        errorCode: isDenied ? 'not-allowed' : isNotFound ? 'audio-capture' : err.name,
        errorMessage: isDenied 
          ? 'माइक की अनुमति दें (ब्राउज़र में माइक अनुमति अस्वीकृत है)' 
          : isNotFound 
          ? 'माइक्रोफ़ोन नहीं मिला' 
          : `माइक त्रुटि: ${err.message}`
      };
    }
  }

  /**
   * Start listening to farmer's voice in Hindi using browser Web Speech API
   */
  async startListening({ onResult, onError, onInterim, onEnd }) {
    if (typeof window === 'undefined') return;

    this.stopListening();
    this.stopSpeaking();
    this.lastErrorCode = null;
    this.lastErrorMessage = null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      const errorMsg = 'आपके ब्राउज़र में आवाज़ पहचान (Web Speech API) उपलब्ध नहीं है। कृपया Google Chrome या Edge का उपयोग करें।';
      this.lastErrorCode = 'unsupported';
      this.lastErrorMessage = errorMsg;
      this.notify({ type: 'listening_error', error: 'unsupported', message: errorMsg });
      if (onError) onError(errorMsg, 'unsupported');
      return;
    }

    const perm = await this.requestMicPermission();
    if (!perm.ok) {
      this.lastErrorCode = perm.errorCode;
      this.lastErrorMessage = `${perm.errorMessage} [त्रुटि: ${perm.errorCode}]`;
      this.notify({ 
        type: 'listening_error', 
        error: perm.errorCode, 
        message: this.lastErrorMessage 
      });
      if (onError) onError(this.lastErrorMessage, perm.errorCode);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      this.activeRecognition = recognition;
      let hasError = false;
      let finalTranscript = '';

      recognition.onstart = () => {
        this.isListening = true;
        this.notify({ type: 'listening_start' });
      };

      recognition.onresult = (event) => {
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscript += item[0].transcript;
          } else {
            interimText += item[0].transcript;
          }
        }

        const currentText = finalTranscript || interimText;
        if (currentText) {
          this.notify({ type: 'listening_interim', transcript: currentText });
          if (onInterim) onInterim(currentText);
        }

        if (finalTranscript) {
          const trimmed = finalTranscript.trim();
          this.notify({ type: 'listening_result', transcript: trimmed });
          if (onResult) onResult(trimmed);
        }
      };

      recognition.onerror = (event) => {
        hasError = true;
        this.isListening = false;
        console.error('[WebSpeech Recognition Error]', event.error, event);

        let hindiMessage = 'माइक में समस्या आई';
        const errCode = event.error;

        switch (errCode) {
          case 'not-allowed':
          case 'service-not-allowed':
            hindiMessage = 'माइक की अनुमति दें (ब्राउज़र में माइक ब्लॉक है)';
            break;
          case 'no-speech':
            hindiMessage = 'कुछ सुनाई नहीं दिया, कृपया फिर से बोलें';
            break;
          case 'network':
            hindiMessage = 'नेटवर्क समस्या: ब्राउज़र स्पीच सेवा से संपर्क नहीं हुआ (इंटरनेट जांचें)';
            break;
          case 'audio-capture':
            hindiMessage = 'माइक्रोफ़ोन नहीं मिला या अन्य ऐप उपयोग कर रहा है';
            break;
          case 'aborted':
            hindiMessage = 'आवाज़ पहचान रद्द हुई';
            break;
          case 'language-not-supported':
            hindiMessage = 'हिंदी भाषा पैकेज लोड नहीं हो सका';
            break;
          default:
            hindiMessage = `माइक त्रुटि: ${errCode}`;
        }

        const fullMessageWithCode = `${hindiMessage} [त्रुटि: ${errCode}]`;
        this.lastErrorCode = errCode;
        this.lastErrorMessage = fullMessageWithCode;

        this.notify({ 
          type: 'listening_error', 
          error: errCode, 
          message: fullMessageWithCode 
        });

        if (onError) onError(fullMessageWithCode, errCode);
      };

      recognition.onend = () => {
        this.isListening = false;
        this.activeRecognition = null;
        
        if (!hasError) {
          this.notify({ 
            type: 'listening_end', 
            transcript: finalTranscript.trim() 
          });
          if (onEnd) onEnd(finalTranscript.trim());
        }
      };

      recognition.start();
    } catch (err) {
      console.error('[WebSpeech start error]', err);
      this.isListening = false;
      const fullMsg = `माइक शुरू करने में समस्या आई: ${err.message} [त्रुटि: start-failed]`;
      this.lastErrorCode = 'start-failed';
      this.lastErrorMessage = fullMsg;
      this.notify({ type: 'listening_error', error: 'start-failed', message: fullMsg });
      if (onError) onError(fullMsg, 'start-failed');
    }
  }

  stopListening() {
    if (this.activeRecognition) {
      try {
        this.activeRecognition.stop();
      } catch (e) {
        // ignore
      }
      this.activeRecognition = null;
    }
    this.isListening = false;
    this.notify({ type: 'listening_end' });
  }

  /**
   * Speak out text in Hindi using SpeechSynthesis (TTS)
   */
  speak(text, onStart, onEnd) {
    if (!this.synth || typeof window === 'undefined') {
      if (onEnd) onEnd();
      return;
    }

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const voices = this.synth.getVoices();
    const hindiVoice = voices.find(v => 
      v.lang.toLowerCase().includes('hi') || 
      v.name.includes('Hindi') || 
      v.name.includes('Kalpana') || 
      v.name.includes('Hemant')
    );
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    utterance.onstart = () => {
      this.isPlaying = true;
      this.notify({ type: 'speaking_start', text });
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isPlaying = false;
      this.notify({ type: 'speaking_end' });
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.isPlaying = false;
      console.warn('[SpeechSynthesis Error]', e);
      this.notify({ type: 'speaking_end' });
      if (onEnd) onEnd();
    };

    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // ignore
      }
      this.isPlaying = false;
      this.notify({ type: 'speaking_end' });
    }
  }

  /**
   * Process a Hindi query dynamically - all advice matches current date & card metrics
   */
  processHindiQuery(query) {
    if (!query) return null;
    const qLower = query.toLowerCase().trim();

    const presets = getBhasiniVoiceQueries();
    const preset = presets.find(p => 
      qLower.includes(p.queryText.toLowerCase().substring(0, 8)) ||
      p.queryText.toLowerCase().includes(qLower)
    );
    if (preset) {
      return {
        query,
        reply: preset.replyText,
        badge: preset.audioBadge,
        actionLink: preset.actionLink
      };
    }

    // Dynamic crop-based reasoning
    if (qLower.includes('प्याज') || qLower.includes('onion')) {
      const timeline = getCropDynamicTimeline(CROPS[0]);
      return {
        query,
        reply: timeline.spokenAdvice,
        badge: 'प्याज सलाह',
        actionLink: '/app/crop/onion'
      };
    }

    if (qLower.includes('टमाटर') || qLower.includes('tomato')) {
      const timeline = getCropDynamicTimeline(CROPS[1]);
      return {
        query,
        reply: timeline.spokenAdvice,
        badge: 'टमाटर बिक्री',
        actionLink: '/app/crop/tomato'
      };
    }

    if (qLower.includes('गेहूं') || qLower.includes('गेहूँ') || qLower.includes('wheat')) {
      const timeline = getCropDynamicTimeline(CROPS[2]);
      return {
        query,
        reply: timeline.spokenAdvice,
        badge: 'गेहूँ सलाह',
        actionLink: '/app/crop/wheat'
      };
    }

    if (qLower.includes('सरसों') || qLower.includes('mustard')) {
      const timeline = getCropDynamicTimeline(CROPS[3]);
      return {
        query,
        reply: timeline.spokenAdvice,
        badge: 'सरसों सलाह',
        actionLink: '/app/crop/mustard'
      };
    }

    if (qLower.includes('दलाली') || qLower.includes('भाड़ा') || qLower.includes('खर्च') || qLower.includes('मुनाफा') || qLower.includes('मुनाफ़ा')) {
      return {
        query,
        reply: 'दूर की मंडी में भाव अधिक दिखे तो भी सतर्क रहें! कई व्यापारी 5 से 6 प्रतिशत दलाली और भारी ढुलाई भाड़ा काट लेते हैं। कृषिवाणी के मंडी तुलना पेज पर जाकर अपना असली शुद्ध पैसा जरूर जांचें।',
        badge: 'दलाली व भाड़ा अलर्ट',
        actionLink: '/app/compare'
      };
    }

    if (qLower.includes('ग्वालियर') || qLower.includes('डबरा') || qLower.includes('आगरा') || qLower.includes('मंडी')) {
      return {
        query,
        reply: 'ग्वालियर संभाग में डबरा मंडी गेहूं और प्याज में अच्छा शुद्ध भाव दे रही है। आगरा मंडी का घोषित भाव अधिक है लेकिन 128 किमी भाड़ा और 5.5% आढ़त के कारण वहां जाने पर घाटा होगा।',
        badge: 'मंडी तुलना',
        actionLink: '/app/compare'
      };
    }

    return {
      query,
      reply: `राम-राम किसान भाई! आपके प्रश्न "${query}" के आधार पर, हम सलाह देते हैं कि फसल बेचने से पहले भाड़ा और दलाली काटकर असली शुद्ध मुनाफ़ा देखें। आप 'मंडी तुलना' में जाकर अपनी फसल और मात्रा चुनकर सटीक गणित देख सकते हैं।`,
      badge: 'कृषिवाणी सलाह',
      actionLink: '/app/compare'
    };
  }
}

export const bhasiniService = new BhasiniVoiceService();

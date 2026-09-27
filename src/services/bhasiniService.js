// कृषिवाणी (KrishiVaani) - भाषिणी (BHASHINI) Vernacular Voice & Audio Engine
// Aligned with National Language Translation Mission (MeitY) & AI4Bharat

import { BHASHINI_VOICE_QUERIES, CROPS, REGIONAL_MANDI_CLUSTERS } from '../data/mandiData';

class BhasiniVoiceService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.recognition = null;
    this.isListening = false;
    this.isPlaying = false;
    this.currentUtterance = null;
    this.onStateChangeCallbacks = [];

    this.initSpeechRecognition();
  }

  initSpeechRecognition() {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'hi-IN'; // Default Hindi
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
    }
  }

  subscribe(callback) {
    this.onStateChangeCallbacks.push(callback);
    return () => {
      this.onStateChangeCallbacks = this.onStateChangeCallbacks.filter(cb => cb !== callback);
    };
  }

  notify(event) {
    this.onStateChangeCallbacks.forEach(cb => cb(event));
  }

  /**
   * Start listening to farmer's voice query in Hindi
   */
  startListening({ onResult, onError, onEnd }) {
    if (!this.recognition) {
      if (onError) onError('आपके ब्राउज़र में आवाज़ पहचान (Mic) उपलब्ध नहीं है। कृपया लिखकर पूछें या दिए गए प्रश्नों को चुनें।');
      return;
    }

    try {
      this.isListening = true;
      this.notify({ type: 'listening_start' });

      this.recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        this.isListening = false;
        this.notify({ type: 'listening_end', transcript });
        if (onResult) onResult(transcript);
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        this.notify({ type: 'listening_error', error: event.error });
        if (onError) onError(`माइक त्रुटि: ${event.error}`);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.notify({ type: 'listening_end' });
        if (onEnd) onEnd();
      };

      this.recognition.start();
    } catch (err) {
      this.isListening = false;
      if (onError) onError('माइक शुरू करने में समस्या आई: ' + err.message);
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.notify({ type: 'listening_end' });
    }
  }

  /**
   * Speak out text in Hindi using Bhasini Voice Synthesis (TTS)
   */
  speak(text, onStart, onEnd) {
    if (!this.synth) {
      if (onEnd) onEnd();
      return;
    }

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95; // Slightly slower, calm cadence for rural clarity
    utterance.pitch = 1.0;

    // Pick Hindi voice if available
    const voices = this.synth.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes('hi') || v.name.includes('Hindi') || v.name.includes('Kalpana') || v.name.includes('Hemant'));
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

    utterance.onerror = () => {
      this.isPlaying = false;
      this.notify({ type: 'speaking_end' });
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isPlaying = false;
      this.notify({ type: 'speaking_end' });
    }
  }

  /**
   * Process a natural language Hindi query and return advice + spoken response
   */
  processHindiQuery(query) {
    const qLower = query.toLowerCase();

    // Check pre-configured questions first
    const preset = BHASHINI_VOICE_QUERIES.find(p => qLower.includes(p.queryText.toLowerCase().substring(0, 10)));
    if (preset) {
      return {
        query: query,
        reply: preset.replyText,
        badge: preset.audioBadge,
        actionLink: preset.actionLink
      };
    }

    // Keyword based agricultural reasoning
    if (qLower.includes('प्याज') || qLower.includes('onion')) {
      return {
        query,
        reply: 'किसान भाई, प्याज के लिए हमारा सुझाव है कि आप 5 दिन रुकें। 29 अगस्त को उमराने मंडी में भाव ₹2,788 तक पहुंचने का अनुमान है, जिससे आपको ₹184 प्रति क्विंटल अधिक शुद्ध मुनाफा मिलेगा।',
        badge: 'प्याज AI सलाह',
        actionLink: '/app/crop/onion'
      };
    }

    if (qLower.includes('टमाटर') || qLower.includes('tomato')) {
      return {
        query,
        reply: 'टमाटर के लिए तुरंत आज ही चांदवड़ मंडी जाएं। स्थानीय यार्ड के बजाय चांदवड़ में ₹202 प्रति क्विंटल अधिक मिल रहे हैं। रुकने पर फसल गलने का नुकसान हो सकता है।',
        badge: 'टमाटर तुरंत बिक्री',
        actionLink: '/app/crop/tomato'
      };
    }

    if (qLower.includes('गेहूं') || qLower.includes('गेहूँ') || qLower.includes('wheat')) {
      return {
        query,
        reply: 'गेहूँ को अभी सूखे गोदाम में संभाल कर रखें। डबरा मंडी में फ्लोर मिलों की नई मांग से अगले 8 दिनों में भाव ₹2,780 तक पहुंचेंगे, जिससे प्रति क्विंटल ₹165 का फायदा होगा।',
        badge: 'गेहूँ होल्ड सलाह',
        actionLink: '/app/crop/wheat'
      };
    }

    if (qLower.includes('सरसों') || qLower.includes('mustard')) {
      return {
        query,
        reply: 'सरसों की बिक्री के लिए मुरैना मंडी सर्वोत्तम है। 3 दिन में स्थानीय स्तर पर बेचने से परिवहन खर्च कम होगा और शुद्ध भाव ₹5,580 तक मिलेगा।',
        badge: 'सरसों मंडी सलाह',
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
        badge: 'क्षेत्रीय मंडी विश्लेषण',
        actionLink: '/app/compare'
      };
    }

    // Default polite intelligent fallback
    return {
      query,
      reply: `राम-राम किसान भाई! आपके प्रश्न "${query}" के आधार पर, हम सलाह देते हैं कि फसल बेचने से पहले भाड़ा और दलाली काटकर असली शुद्ध मुनाफ़ा देखें। आप 'मंडी तुलना' में जाकर अपनी फसल और मात्रा चुनकर सटीक गणित देख सकते हैं।`,
      badge: 'कृषिवाणी AI सलाह',
      actionLink: '/app/compare'
    };
  }
}

export const bhasiniService = new BhasiniVoiceService();

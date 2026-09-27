// कृषिवाणी (KrishiVaani) - वाक् सहायक व भाषिणी (Speech Recognition & TTS Engine)
// Browser Web Speech API (webkitSpeechRecognition) + SpeechSynthesis with 'hi-IN'
// All voice responses are generated dynamically from today's live crop timeline

import { getBhasiniVoiceQueries, CROPS, REGIONAL_MANDI_CLUSTERS, TRANSPORT_MODES } from '../data/mandiData.js';
import { getCropDynamicTimeline, formatHindiDate, addDays } from '../utils/dateUtils.js';
import { parseFarmerVoiceQuery } from './voiceNluService.js';
import { getTransparentForecast } from './forecastEngine.js';
import { compareRegionalMandis, calculateMandiNetProfit } from './arbitrageEngine.js';

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
   * Process a Hindi query dynamically - understands farmer's location, crop, quantity & units
   */
  processHindiQuery(query) {
    if (!query) return null;
    const parsed = parseFarmerVoiceQuery(query);
    const { crop: cropMeta, location: locMeta, quantity: qtyMeta, intent } = parsed;

    // 1. Check for Unsupported Location (e.g. Bhopal, Jabalpur, etc.) - Answer Honestly!
    if (locMeta && !locMeta.isSupported) {
      const cityName = locMeta.cityName;
      const nearestHint = locMeta.nearestHint || 'निकटवर्ती संभाग';
      
      let cropPriceHint = '';
      if (cropMeta) {
        const cropObj = CROPS.find(c => c.id === cropMeta.id) || CROPS[0];
        const forecast = getTransparentForecast(cropObj.id);
        cropPriceHint = ` हमारे पास निकटतम ${nearestHint} की मंडियों का डेटा है, जहां ${cropMeta.nameHindi} का भाव ${forecast.priceRangeStr} प्रति क्विंटल के बीच रहने का अनुमान है (${forecast.confidence}% विश्वसनीयता)।`;
      }

      return {
        query,
        reply: `किसान भाई, ${cityName} मंडी का सजीव डेटा वर्तमान में हमारे पास उपलब्ध नहीं है।${cropPriceHint} आप निकटतम संभाग की मंडी तुलना देख सकते हैं।`,
        badge: `${cityName} डेटा अनुपलब्ध`,
        actionLink: '/app/compare',
        parsed
      };
    }

    // 2. Identify the Crop
    const targetCrop = cropMeta 
      ? (CROPS.find(c => c.id === cropMeta.id) || CROPS[0])
      : null;

    // 3. Identify the Location & Regional Cluster
    let clusterKey = 'gwalior_chambal';
    let userCityName = 'ग्वालियर';
    
    if (locMeta && locMeta.isSupported) {
      clusterKey = locMeta.location.clusterId;
      userCityName = locMeta.location.nameHindi;
    }

    const regionalCluster = REGIONAL_MANDI_CLUSTERS[clusterKey] || REGIONAL_MANDI_CLUSTERS.gwalior_chambal;
    const mandisInRegion = regionalCluster.mandis;

    // 4. Quantity in Quintals
    const quantityQtl = qtyMeta ? qtyMeta.quantityQtl : (targetCrop ? (targetCrop.id === 'wheat' ? 40 : 20) : 40);
    const isSmallQuantity = quantityQtl <= 2; // e.g. 100 kg (1 qtl) or 2 qtl

    // 5. If we have a recognized crop, run realistic arbitrage & transport calculation
    if (targetCrop) {
      const cropId = targetCrop.id;
      const forecast = getTransparentForecast(cropId);
      const isPerishable = targetCrop.transportSensitivity === 'high' || targetCrop.shelfLifeDays <= 7;

      // Select suitable transport vehicle based on quantity:
      let vehicleId = 'pickup';
      if (isSmallQuantity) {
        vehicleId = 'cart'; // local loader / cart
      } else if (quantityQtl > 60) {
        vehicleId = 'truck';
      }

      const compResults = compareRegionalMandis({
        clusterMandis: mandisInRegion,
        cropId,
        quantityQtl,
        vehicleId
      });

      const bestMandi = compResults.bestMandi;
      const trapDetails = compResults.trapDetails;

      // Case A: Small Quantity (e.g. 100 kg = 1 qtl or 2 qtl in Nagpur, Indore, etc.)
      if (isSmallQuantity) {
        const nearestMandi = compResults.rankedMandis.find(m => m.isLocal) || compResults.rankedMandis[0];
        const rawRate = nearestMandi.rawQuotedPrice;
        // In local mandi for 1-2 qtl, small loading/cess of ~₹35-40/qtl
        const localDeduction = 40;
        const netPerQtl = rawRate - localDeduction;
        const totalNetInHand = Math.round(netPerQtl * quantityQtl);

        const qtyDisplay = qtyMeta ? qtyMeta.displayHindi : `${quantityQtl} क्विंटल`;

        let smallQtyReply = `किसान भाई, ${userCityName} में ${qtyDisplay} ${targetCrop.name} जैसी छोटी मात्रा के लिए दूर की मंडी जाना घाटे का सौदा होगा क्योंकि केवल गाड़ी का भाड़ा ही ₹300-₹500 लग जाएगा। `;
        smallQtyReply += `इसलिए अपने सबसे नजदीकी ${nearestMandi.mandiName} (${nearestMandi.distanceKm} किमी) में ही स्थानीय साधन (ऑटो/बाइक/लोडर) से बेचना सबसे समझदारी है। `;
        smallQtyReply += `वहाँ आज का थोक भाव लगभग ₹${rawRate.toLocaleString('en-IN')}/क्विंटल है, जहाँ स्थानीय तुलाई व खर्च काटकर आपके हाथ में ₹${netPerQtl.toLocaleString('en-IN')}/क्विंटल (कुल लगभग ₹${totalNetInHand.toLocaleString('en-IN')}) शुद्ध रोकड़ा आएगा।`;

        return {
          query,
          reply: smallQtyReply,
          badge: `${userCityName} स्थानीय बिक्री`,
          actionLink: `/app/crop/${cropId}`,
          parsed
        };
      }

      // Case B: Perishable crop and/or Intent is Timing ("आज बेचूं या रुकूं?")
      // e.g. "5 टन टमाटर है नासिक में, आज बेचूं या रुकूं?"
      if (intent === 'timing_hold_or_sell' || (isPerishable && intent !== 'price_enquiry')) {
        const qtyDisplay = qtyMeta ? qtyMeta.displayHindi : `${quantityQtl} क्विंटल`;
        const netRate = bestMandi.netRatePerQtl;
        const totalNet = bestMandi.netInHandTotal;

        if (isPerishable) {
          let adviceText = `किसान भाई, ${userCityName} में ${qtyDisplay} ${targetCrop.name} के लिए हमारी स्पष्ट सलाह है कि आज ही बेचें, बिल्कुल न रुकें! `;
          adviceText += `${targetCrop.name} शीघ्र नष्ट होने वाली फसल है। 2-3 दिन रुकने पर गोदाम व रास्ते में 6-8% फसल सड़ जाएगी और आवक बढ़ने से भाव गिरने का अनुमान है। `;
          adviceText += `${bestMandi.mandiName} (${bestMandi.distanceKm} किमी) में आज भाव ₹${bestMandi.rawQuotedPrice.toLocaleString('en-IN')}/क्विंटल है। `;
          adviceText += `परिवहन भाड़ा व दलाली काटकर आपके हाथ में ₹${netRate.toLocaleString('en-IN')}/क्विंटल यानी कुल लगभग ₹${totalNet.toLocaleString('en-IN')} का शुद्ध रोकड़ा तुरंत मिलेगा।`;

          return {
            query,
            reply: adviceText,
            badge: `${targetCrop.name} तुरंत बिक्री`,
            actionLink: `/app/crop/${cropId}`,
            parsed
          };
        } else {
          // Storable crop (e.g. Wheat or Onion)
          const holdDays = targetCrop.forecastDays || 5;
          const peakDate = addDays(new Date(), holdDays);
          const peakDateStr = formatHindiDate(peakDate, { day: 'numeric', month: 'long' });

          let adviceText = `किसान भाई, ${userCityName} में ${qtyDisplay} ${targetCrop.name} के लिए पिछले 180 दिनों के भावों के रुझान व आवक के अनुसार आपको ${holdDays} दिन रुकना चाहिए। `;
          adviceText += `${peakDateStr} तक ${bestMandi.mandiName} में भाव ${forecast.priceRangeStr} प्रति क्विंटल के बीच रहने का अनुमान है (${forecast.confidence}% विश्वसनीयता)। `;
          adviceText += `ढुलाई व दलाली काटकर भी आपको लगभग ₹${targetCrop.gainPerQuintal}/क्विंटल का अतिरिक्त लाभ होगा।`;

          return {
            query,
            reply: adviceText,
            badge: `${targetCrop.name} रुकने की सलाह`,
            actionLink: `/app/crop/${cropId}`,
            parsed
          };
        }
      }

      // Case C: Where to sell ("कहाँ बेचूं?") / Mandi choice
      // e.g. "ग्वालियर में 40 क्विंटल गेहूं है, कहाँ बेचूं?"
      if (intent === 'mandi_choice' || (qtyMeta && !intent.includes('timing'))) {
        const qtyDisplay = qtyMeta ? qtyMeta.displayHindi : `${quantityQtl} क्विंटल`;
        let mandiReply = `किसान भाई, ${userCityName} में ${qtyDisplay} ${targetCrop.name} के लिए ${bestMandi.mandiName} (${bestMandi.distanceKm} किमी) सबसे लाभदायक मंडी है। `;
        mandiReply += `यहाँ घोषित भाव ₹${bestMandi.rawQuotedPrice.toLocaleString('en-IN')}/क्विंटल है। ढुलाई भाड़ा (₹${bestMandi.transportPerQtl}) व दलाली काटकर आपके हाथ में ₹${bestMandi.netRatePerQtl.toLocaleString('en-IN')}/क्विंटल यानी कुल लगभग ₹${bestMandi.netInHandTotal.toLocaleString('en-IN')} शुद्ध रोकड़ा आएगा। `;

        if (trapDetails) {
          mandiReply += `सावधान: ${trapDetails.trapMandiName} में भाव ₹${trapDetails.rawQuotedDifference} अधिक दिख रहा है, लेकिन अधिक दूरी व भारी दलाली के कारण वहां आपको उल्टे प्रति क्विंटल ₹${trapDetails.netLossPerQtl} का नुकसान होगा!`;
        }

        return {
          query,
          reply: mandiReply,
          badge: `${bestMandi.mandiName} सर्वश्रेष्ठ`,
          actionLink: '/app/compare',
          parsed
        };
      }

      // Case D: Pure Price enquiry (e.g. "सोयाबीन का भाव क्या है?")
      const targetMandi = mandisInRegion.find(m => m.isLocal) || mandisInRegion[0];
      const todayPrice = targetMandi.prices[cropId] || targetCrop.currentAvgModalPrice;
      let priceReply = `किसान भाई, ${userCityName} क्षेत्र में ${targetCrop.name} का आज का औसत थोक भाव ₹${todayPrice.toLocaleString('en-IN')} प्रति क्विंटल चल रहा है। `;
      priceReply += `पिछले 180 दिनों के रुझान के अनुसार आगामी दिनों में भाव ${forecast.priceRangeStr} प्रति क्विंटल के बीच रहने का अनुमान है (${forecast.confidence}% विश्वसनीयता)।`;

      return {
        query,
        reply: priceReply,
        badge: `${targetCrop.name} भाव रुझान`,
        actionLink: `/app/crop/${cropId}`,
        parsed
      };
    }

    // 6. Generic presets or queries (Dalaali / Transport / General)
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
        actionLink: preset.actionLink,
        parsed
      };
    }

    if (qLower.includes('दलाली') || qLower.includes('भाड़ा') || qLower.includes('खर्च') || qLower.includes('कमीशन')) {
      return {
        query,
        reply: 'दूर की मंडी का ऊंचा भाव देखकर किसान अक्सर धोखे में आ जाते हैं। कई गैर-विनियमित मंडियों में 5 से 6 प्रतिशत दलाली और भारी ढुलाई भाड़ा कट जाता है। कृषिवाणी के मंडी तुलना पेज पर जाकर अपनी फसल और मात्रा डालकर असली शुद्ध रोकड़ा जरूर जांचें।',
        badge: 'दलाली व भाड़ा अलर्ट',
        actionLink: '/app/compare',
        parsed
      };
    }

    return {
      query,
      reply: `राम-राम किसान भाई! आपके प्रश्न "${query}" के आधार पर, हम सलाह देते हैं कि फसल बेचने से पहले भाड़ा और दलाली काटकर असली शुद्ध मुनाफ़ा देखें। आप 'मंडी तुलना' में जाकर अपनी फसल और मात्रा चुनकर सटीक गणित देख सकते हैं।`,
      badge: 'कृषिवाणी सलाह',
      actionLink: '/app/compare',
      parsed
    };
  }
}

export const bhasiniService = new BhasiniVoiceService();

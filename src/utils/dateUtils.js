// कृषिवाणी (KrishiVaani) - Dynamic Hindi Date & Calendar Utilities
// Calculates all dates dynamically from today (new Date())

/**
 * Format a Date object in Hindi (Devanagari)
 * Example: 27 सितंबर or 02 अक्टूबर
 */
export function formatHindiDate(date, options = {}) {
  const d = date instanceof Date ? date : new Date(date);
  const defaultOptions = {
    day: 'numeric',
    month: 'long',
    ...options
  };

  try {
    return new Intl.DateTimeFormat('hi-IN', defaultOptions).format(d);
  } catch (e) {
    // Fallback if hi-IN intl is restricted
    const monthsHi = [
      'जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
      'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
    ];
    return `${d.getDate()} ${monthsHi[d.getMonth()]}`;
  }
}

/**
 * Format date in short Hindi
 * Example: 27 सितं or 02 अक्टू
 */
export function formatHindiDateShort(date) {
  const d = date instanceof Date ? date : new Date(date);
  try {
    return new Intl.DateTimeFormat('hi-IN', { day: 'numeric', month: 'short' }).format(d);
  } catch (e) {
    return formatHindiDate(d);
  }
}

/**
 * Format date as ISO string (YYYY-MM-DD)
 */
export function formatIsoDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Add days to a date
 */
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + Number(days));
  return result;
}

/**
 * Subtract days from a date
 */
export function subDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() - Number(days));
  return result;
}

/**
 * Dynamic crop timeline generator based on today's date
 */
export function getCropDynamicTimeline(crop) {
  const today = new Date();
  
  if (!crop.forecastDays || crop.forecastDays === 0) {
    return {
      peakDate: today,
      peakDateStr: 'आज ही',
      peakDateFullStr: formatHindiDate(today),
      actionText: 'मंडी बदलें',
      actionVerb: 'आज ही बेचें',
      daysDiff: 0,
      reasonHindi: `स्थानीय यार्ड के बजाय आज ही ${crop.forecastBestMandi} में बेचें। अधिक दूरी के बावजूद मांग तेज है और ₹${crop.gainPerQuintal} प्रति क्विंटल अधिक शुद्ध मुनाफा मिलेगा। रुकने पर फसल गलने का खतरा है।`,
      spokenAdvice: `किसान भाई, ${crop.name} के लिए तुरंत आज ही ${crop.forecastBestMandi} जाएं। स्थानीय यार्ड के मुकाबले ₹${crop.gainPerQuintal} प्रति क्विंटल अधिक शुद्ध मुनाफा मिलेगा।`
    };
  }

  const peakDate = addDays(today, crop.forecastDays);
  const peakDateStr = formatHindiDate(peakDate, { day: 'numeric', month: 'long' });

  return {
    peakDate,
    peakDateStr,
    peakDateFullStr: peakDateStr,
    actionText: `${crop.forecastDays} दिन रुकें`,
    actionVerb: 'रोककर रखें',
    daysDiff: crop.forecastDays,
    reasonHindi: `${crop.forecastBestMandi} में ${peakDateStr} को आवक कम होने से भाव ₹${crop.forecastPeakPrice.toLocaleString('en-IN')} तक उछलने का अनुमान है। ${crop.forecastDays} दिन रुकने पर भाड़ा काटकर भी ₹${crop.gainPerQuintal}/क्विंटल का अतिरिक्त लाभ होगा।`,
    spokenAdvice: `किसान भाई, हमारे AI मॉडल के अनुसार आपको ${crop.name} ${crop.forecastDays} दिन रोककर रखना चाहिए। ${peakDateStr} को ${crop.forecastBestMandi} में भाव ₹${crop.forecastPeakPrice.toLocaleString('en-IN')} तक जाएगा। इससे आपको ढुलाई खर्च काटकर भी ₹${crop.gainPerQuintal} प्रति क्विंटल का शुद्ध मुनाफा होगा।`
  };
}

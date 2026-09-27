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
  
  // Calculate price range (+/- 2.5% around peak)
  const rangeLower = Math.round(crop.forecastPeakPrice * 0.975);
  const rangeUpper = Math.round(crop.forecastPeakPrice * 1.025);
  const priceRangeStr = `₹${rangeLower.toLocaleString('en-IN')}–₹${rangeUpper.toLocaleString('en-IN')}`;

  if (!crop.forecastDays || crop.forecastDays === 0) {
    return {
      peakDate: today,
      peakDateStr: 'आज ही',
      peakDateFullStr: formatHindiDate(today),
      actionText: 'मंडी बदलें',
      actionVerb: 'आज ही बेचें',
      daysDiff: 0,
      priceRangeStr,
      reasonHindi: `स्थानीय यार्ड के बजाय आज ही ${crop.forecastBestMandi} में बेचें। पिछले रुझान के अनुसार रुकने पर फसल गलने का खतरा है और यहाँ ₹${crop.gainPerQuintal}/क्विंटल अधिक शुद्ध मुनाफा मिलेगा।`,
      spokenAdvice: `किसान भाई, ${crop.name} शीघ्र नष्ट होने वाली फसल है। पिछले भावों के रुझान व मौसमी आवक के अनुसार रुकने पर सड़न से भारी नुकसान होगा। तुरंत आज ही ${crop.forecastBestMandi} में बेचें, जहाँ ढुलाई काटकर भी ₹${crop.gainPerQuintal} प्रति क्विंटल अधिक शुद्ध मुनाफा मिलेगा।`
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
    priceRangeStr,
    reasonHindi: `${crop.forecastBestMandi} में ${peakDateStr} तक भाव ${priceRangeStr} तक रहने का अनुमान है (${crop.confidence}% विश्वसनीयता)। ${crop.forecastDays} दिन रुकने पर भाड़ा काटकर भी ₹${crop.gainPerQuintal}/क्विंटल का अतिरिक्त लाभ होगा।`,
    spokenAdvice: `किसान भाई, पिछले 180 दिनों के भावों के रुझान व आवक के अनुसार आपको ${crop.name} ${crop.forecastDays} दिन रोककर रखना चाहिए। ${peakDateStr} को ${crop.forecastBestMandi} में भाव ${priceRangeStr} के बीच रहने का अनुमान है (${crop.confidence}% विश्वसनीयता)। इससे आपको ढुलाई खर्च काटकर भी ₹${crop.gainPerQuintal} प्रति क्विंटल का अतिरिक्त शुद्ध मुनाफा होगा।`
  };
}

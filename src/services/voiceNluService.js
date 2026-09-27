// कृषिवाणी (KrishiVaani) - Hindi Agro NLU & Query Parser
// Extracts City/Location, Crop, Quantity (with proper unit conversion), and Intent.

export const SUPPORTED_LOCATIONS = {
  nagpur: {
    id: 'nagpur',
    nameHindi: 'नागपुर',
    state: 'महाराष्ट्र',
    clusterId: 'nagpur_cluster',
    aliases: ['नागपुर', 'nagpur', 'नागपूर']
  },
  gwalior: {
    id: 'gwalior',
    nameHindi: 'ग्वालियर',
    state: 'मध्य प्रदेश',
    clusterId: 'gwalior_chambal',
    aliases: ['ग्वालियर', 'gwalior', 'डबरा', 'मुरार']
  },
  nashik: {
    id: 'nashik',
    nameHindi: 'नासिक',
    state: 'महाराष्ट्र',
    clusterId: 'nashik_cluster',
    aliases: ['नासिक', 'nashik', 'नाशिक', 'निफाड़', 'लासलगांव']
  },
  indore: {
    id: 'indore',
    nameHindi: 'इंदौर',
    state: 'मध्य प्रदेश',
    clusterId: 'indore_cluster',
    aliases: ['इंदौर', 'indore', 'इन्दौर', 'चोइथराम']
  },
  morena: {
    id: 'morena',
    nameHindi: 'मुरैना',
    state: 'मध्य प्रदेश',
    clusterId: 'gwalior_chambal',
    aliases: ['मुरैना', 'morena']
  },
  agra: {
    id: 'agra',
    nameHindi: 'आगरा',
    state: 'उत्तर प्रदेश',
    clusterId: 'gwalior_chambal',
    aliases: ['आगरा', 'agra']
  }
};

// Known but unsupported cities - to answer honestly
export const UNSUPPORTED_CITIES = [
  { nameHindi: 'भोपाल', aliases: ['भोपाल', 'bhopal'], nearestHint: 'मालवा (इंदौर/उज्जैन) या ग्वालियर' },
  { nameHindi: 'जबलपुर', aliases: ['जबलपुर', 'jabalpur'], nearestHint: 'मध्य प्रदेश संभाग' },
  { nameHindi: 'जयपुर', aliases: ['जयपुर', 'jaipur'], nearestHint: 'राजस्थान संभाग' },
  { nameHindi: 'दिल्ली', aliases: ['दिल्ली', 'delhi'], nearestHint: 'आगरा व उत्तर भारत' },
  { nameHindi: 'पुणे', aliases: ['पुणे', 'pune'], nearestHint: 'नासिक व पश्चिम महाराष्ट्र' }
];

export const CROP_MAPPINGS = [
  { id: 'onion', nameHindi: 'प्याज', aliases: ['प्याज', 'प्याज़', 'कांदा', 'onion'] },
  { id: 'tomato', nameHindi: 'टमाटर', aliases: ['टमाटर', 'tamatar', 'tomato'] },
  { id: 'wheat', nameHindi: 'गेहूँ', aliases: ['गेहूं', 'गेहूँ', 'कनक', 'wheat', 'gehu'] },
  { id: 'mustard', nameHindi: 'सरसों', aliases: ['सरसों', 'राई', 'mustard', 'sarson'] },
  { id: 'potato', nameHindi: 'आलू', aliases: ['आलू', 'बटाटा', 'potato', 'aloo'] },
  { id: 'soybean', nameHindi: 'सोयाबीन', aliases: ['सोयाबीन', 'सोया', 'soybean', 'soya'] }
];

/**
 * Hindi Number Word to Digit Map
 */
const HINDI_NUM_WORDS = {
  'एक': 1,
  'दो': 2,
  'तीन': 3,
  'चार': 4,
  'पांच': 5,
  'पाँच': 5,
  'छह': 6,
  'सात': 7,
  'आठ': 8,
  'नौ': 9,
  'दस': 10,
  'बीस': 20,
  'पच्चीस': 25,
  'तीस': 30,
  'चालीस': 40,
  'पचास': 50,
  'साठ': 60,
  'सत्तर': 70,
  'अस्सी': 80,
  'नब्बे': 90,
  'सौ': 100,
  'हजार': 1000
};

/**
 * Parse Quantity and Convert to Quintals
 * 100 किलो / kg = 1 क्विंटल
 * 1 टन = 10 क्विंटल
 * 1 क्विंटल = 1 क्विंटल
 * 1 बोरी / कट्टा = 0.5 क्विंटल
 */
export function extractQuantityInQuintals(text) {
  if (!text) return null;
  const t = text.toLowerCase();

  // 1. Ton / टन regex: (e.g. "5 टन", "5 tonne", "२ टन", "पांच टन")
  const tonRegex = /(\d+(?:\.\d+)?|[एक|दो|तीन|चार|पांच|पाँच|छह|सात|आठ|नौ|दस]+)\s*(?:टन|ton|tonne|tonnes)/i;
  const tonMatch = t.match(tonRegex);
  if (tonMatch) {
    const rawVal = tonMatch[1];
    const val = Number(rawVal) || HINDI_NUM_WORDS[rawVal] || 1;
    return {
      rawNumber: val,
      rawUnit: 'टन',
      quantityQtl: val * 10, // 1 Ton = 10 Quintals
      displayHindi: `${val} टन (${val * 10} क्विंटल)`
    };
  }

  // 2. Kilo / किलो / kg regex: (e.g. "100 किलो", "50 kg", "सौ किलो")
  const kgRegex = /(\d+(?:\.\d+)?|[एक|दो|तीन|चार|पांच|पाँच|छह|सात|आठ|नौ|दस|बीस|पचास|सौ]+)\s*(?:किलो|किलोग्राम|kg|kgs|kilo)/i;
  const kgMatch = t.match(kgRegex);
  if (kgMatch) {
    const rawVal = kgMatch[1];
    const val = Number(rawVal) || HINDI_NUM_WORDS[rawVal] || 100;
    const qtl = Number((val / 100).toFixed(2)); // 100 kg = 1 Quintal
    return {
      rawNumber: val,
      rawUnit: 'किलो',
      quantityQtl: qtl,
      displayHindi: `${val} किलो (${qtl} क्विंटल)`
    };
  }

  // 3. Quintal / क्विंटल regex: (e.g. "40 क्विंटल", "2 क्विंटल", "चालीस क्विंटल")
  const qtlRegex = /(\d+(?:\.\d+)?|[एक|दो|तीन|चार|पांच|पाँच|छह|सात|आठ|नौ|दस|बीस|पच्चीस|तीस|चालीस|पचास|साठ|सत्तर|अस्सी|नब्बे|सौ]+)\s*(?:क्विंटल|कविंटल|qtl|quintal|quintals)/i;
  const qtlMatch = t.match(qtlRegex);
  if (qtlMatch) {
    const rawVal = qtlMatch[1];
    const val = Number(rawVal) || HINDI_NUM_WORDS[rawVal] || 1;
    return {
      rawNumber: val,
      rawUnit: 'क्विंटल',
      quantityQtl: val,
      displayHindi: `${val} क्विंटल`
    };
  }

  // 4. Bori / कट्टा regex (e.g. "10 बोरी")
  const boriRegex = /(\d+(?:\.\d+)?|[एक|दो|तीन|चार|पांच|पाँच|छह|सात|आठ|नौ|दस|बीस|पचास]+)\s*(?:बोरी|कट्टा|कट्टे|बोरे)/i;
  const boriMatch = t.match(boriRegex);
  if (boriMatch) {
    const rawVal = boriMatch[1];
    const val = Number(rawVal) || HINDI_NUM_WORDS[rawVal] || 1;
    const qtl = Number((val * 0.5).toFixed(1));
    return {
      rawNumber: val,
      rawUnit: 'बोरी',
      quantityQtl: qtl,
      displayHindi: `${val} बोरी (~${qtl} क्विंटल)`
    };
  }

  return null;
}

/**
 * Detect Location
 */
export function extractLocation(text) {
  if (!text) return null;
  const t = text.toLowerCase();

  // Check supported locations
  for (const locKey of Object.keys(SUPPORTED_LOCATIONS)) {
    const loc = SUPPORTED_LOCATIONS[locKey];
    for (const alias of loc.aliases) {
      if (t.includes(alias)) {
        return { isSupported: true, location: loc };
      }
    }
  }

  // Check known unsupported cities
  for (const uns of UNSUPPORTED_CITIES) {
    for (const alias of uns.aliases) {
      if (t.includes(alias)) {
        return { 
          isSupported: false, 
          cityName: uns.nameHindi, 
          nearestHint: uns.nearestHint 
        };
      }
    }
  }

  return null;
}

/**
 * Detect Crop
 */
export function extractCrop(text) {
  if (!text) return null;
  const t = text.toLowerCase();

  for (const c of CROP_MAPPINGS) {
    for (const alias of c.aliases) {
      if (t.includes(alias)) {
        return c;
      }
    }
  }
  return null;
}

/**
 * Detect Intent
 */
export function extractIntent(text) {
  if (!text) return 'general';
  const t = text.toLowerCase();

  if (t.includes('रुकूं') || t.includes('रूकूं') || t.includes('रुकना') || t.includes('बेचूं या') || t.includes('रोककर')) {
    return 'timing_hold_or_sell';
  }
  if (t.includes('कहाँ') || t.includes('कहा') || t.includes('किधर') || t.includes('कौन सी मंडी') || t.includes('किस मंडी')) {
    return 'mandi_choice';
  }
  if (t.includes('भाव') || t.includes('रेट') || t.includes('कीमत') || t.includes('दाम')) {
    return 'price_enquiry';
  }
  if (t.includes('दलाली') || t.includes('भाड़ा') || t.includes('कमीशन') || t.includes('काटकर')) {
    return 'deduction_breakdown';
  }
  return 'general_advisory';
}

/**
 * Complete NLU Parse for farmer voice query
 */
export function parseFarmerVoiceQuery(query) {
  const quantityInfo = extractQuantityInQuintals(query);
  const locationInfo = extractLocation(query);
  const cropInfo = extractCrop(query);
  const intent = extractIntent(query);

  return {
    rawQuery: query,
    crop: cropInfo,
    location: locationInfo,
    quantity: quantityInfo,
    intent
  };
}

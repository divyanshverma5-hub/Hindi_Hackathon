// कृषिवाणी (KrishiVaani) - Mandi Datasets & Agro-Intelligence
// Source schemas aligned with Agmarknet (कृषि मंत्रालय, भारत सरकार) & eNAM

export const CROPS = [
  {
    id: 'onion',
    name: 'प्याज (Onion)',
    hindiName: 'प्याज',
    variety: 'लाल नासिक / मध्यम गोल',
    category: 'सब्जी (Perishable)',
    shelfLifeDays: 25,
    decayRatePerDayPercent: 0.35,
    transportSensitivity: 'medium', // 0.25% decay per 50km
    standardWeight: 'क्विंटल (100 kg)',
    currentAvgModalPrice: 2450,
    forecastTrend: 'upward', // 'upward' | 'downward' | 'stable'
    forecastDays: 5,
    forecastPeakPrice: 2788,
    forecastBestMandi: 'उमराने (Umrane)',
    gainPerQuintal: 184,
    confidence: 87,
    reasonHindi: 'उमराने मंडी में 29 अगस्त को आवक कम होने से भाव ₹2,788 तक उछलने का अनुमान है। 5 दिन रुकने पर भाड़ा काटकर भी ₹184/क्विंटल का अतिरिक्त लाभ होगा।',
    icon: '🧅'
  },
  {
    id: 'tomato',
    name: 'टमाटर (Tomato)',
    hindiName: 'टमाटर',
    variety: 'देशी हाइब्रिड',
    category: 'शीघ्र नष्ट होने वाली सब्जी (Highly Perishable)',
    shelfLifeDays: 4,
    decayRatePerDayPercent: 1.8,
    transportSensitivity: 'high', // 0.8% decay per 50km
    standardWeight: 'क्विंटल (100 kg)',
    currentAvgModalPrice: 1650,
    forecastTrend: 'downward',
    forecastDays: 0,
    forecastPeakPrice: 1980,
    forecastBestMandi: 'चांदवड़ (Chandwad)',
    gainPerQuintal: 202,
    confidence: 94,
    reasonHindi: 'लोकल यार्ड के बजाय आज ही चांदवड़ मंडी में बेचें। अधिक दूरी के बावजूद चांदवड़ में मांग तेज है और ₹202 प्रति क्विंटल अधिक शुद्ध मुनाफा मिलेगा। रुकने पर टमाटर गलने का भारी खतरा है।',
    icon: '🍅'
  },
  {
    id: 'wheat',
    name: 'गेहूँ (Wheat)',
    hindiName: 'गेहूँ',
    variety: 'शरबती / लोक-1',
    category: 'अनाज (Non-Perishable)',
    shelfLifeDays: 360,
    decayRatePerDayPercent: 0.01,
    transportSensitivity: 'low',
    standardWeight: 'क्विंटल (100 kg)',
    currentAvgModalPrice: 2580,
    forecastTrend: 'upward',
    forecastDays: 8,
    forecastPeakPrice: 2790,
    forecastBestMandi: 'डबरा मंडी (Dabra)',
    gainPerQuintal: 165,
    confidence: 89,
    reasonHindi: 'गेहूँ को अभी सूखे गोदाम में रखें। डबरा मंडी में रोलर फ्लोर मिलों की नई खरीदारी से 8 दिन बाद भाव ₹2,790 पहुंचने की संभावना है।',
    icon: '🌾'
  },
  {
    id: 'mustard',
    name: 'सरसों (Mustard)',
    hindiName: 'सरसों',
    variety: 'काली पूसा बोल्ड (42% तेल)',
    category: 'तिलहन (Oilseed)',
    shelfLifeDays: 240,
    decayRatePerDayPercent: 0.02,
    transportSensitivity: 'low',
    standardWeight: 'क्विंटल (100 kg)',
    currentAvgModalPrice: 5350,
    forecastTrend: 'stable',
    forecastDays: 3,
    forecastPeakPrice: 5580,
    forecastBestMandi: 'मुरैना मंडी (Morena)',
    gainPerQuintal: 140,
    confidence: 85,
    reasonHindi: 'मुरैना तेल मिलों में सरसों की मांग स्थिर है। 3 दिन में स्थानीय स्तर पर बेचने से परिवहन खर्च शून्य रहेगा और शुद्ध मुनाफा अधिकतम होगा।',
    icon: '🌻'
  },
  {
    id: 'potato',
    name: 'आलू (Potato)',
    hindiName: 'आलू',
    variety: 'चिपसोना / पुखराज',
    category: 'सब्जी (Semi-Perishable)',
    shelfLifeDays: 60,
    decayRatePerDayPercent: 0.15,
    transportSensitivity: 'medium',
    standardWeight: 'क्विंटल (100 kg)',
    currentAvgModalPrice: 1320,
    forecastTrend: 'upward',
    forecastDays: 12,
    forecastPeakPrice: 1540,
    forecastBestMandi: 'आगरा मंडी (Agra)',
    gainPerQuintal: 110,
    confidence: 82,
    reasonHindi: 'कोल्ड स्टोरेज में स्टॉक सुरक्षित रखें। 12 दिनों बाद आगरा मंडी में चिप्स कंपनियों की खरीद बढ़ने से ₹110/क्विंटल अतिरिक्त लाभ मिलेगा।',
    icon: '🥔'
  },
  {
    id: 'soybean',
    name: 'सोयाबीन (Soybean)',
    hindiName: 'सोयाबीन',
    variety: 'JS 9560 पीला',
    category: 'तिलहन (Oilseed)',
    shelfLifeDays: 180,
    decayRatePerDayPercent: 0.02,
    transportSensitivity: 'low',
    standardWeight: 'क्विंटल (100 kg)',
    currentAvgModalPrice: 4620,
    forecastTrend: 'upward',
    forecastDays: 6,
    forecastPeakPrice: 4890,
    forecastBestMandi: 'उज्जैन मंडी (Ujjain)',
    gainPerQuintal: 175,
    confidence: 90,
    reasonHindi: 'उज्जैन व इंदौर प्लांटों में पेराई मांग बढ़ने से 6 दिन में ₹175/क्विंटल का शुद्ध इजाफा होगा।',
    icon: '🌱'
  }
];

// 3-4 Mandis Per Region for Comparison
export const REGIONAL_MANDI_CLUSTERS = {
  gwalior_chambal: {
    regionName: 'ग्वालियर - चंबल संभाग (MP)',
    baseFarmerLocation: 'घाटीगांव / मुरार, ग्वालियर',
    mandis: [
      {
        id: 'gwalior_laxmiganj',
        name: 'लक्ष्मीगंज मंडी, ग्वालियर (Laxmiganj APMC)',
        district: 'ग्वालियर',
        state: 'मध्य प्रदेश',
        distanceKm: 14,
        isLocal: true,
        apmcRegulated: true,
        brokerCommissionPercent: 1.5, // सरकारी नियमित
        handlingFeePerQtl: 18,
        congestionWaitHours: 2,
        prices: {
          onion: 2420,
          tomato: 1620,
          wheat: 2610,
          mustard: 5320,
          potato: 1310,
          soybean: 4580
        },
        arrivalsTodayQtl: 3450,
        paymentMode: 'तत्काल बैंक ट्रांसफर / नकद 2 घंटे में'
      },
      {
        id: 'dabra_mandi',
        name: 'डबरा कृषि उपज मंडी (Dabra APMC)',
        district: 'ग्वालियर',
        state: 'मध्य प्रदेश',
        distanceKm: 42,
        isLocal: false,
        apmcRegulated: true,
        brokerCommissionPercent: 2.0,
        handlingFeePerQtl: 20,
        congestionWaitHours: 4,
        prices: {
          onion: 2540,
          tomato: 1710,
          wheat: 2780, // High wheat demand (millers)
          mustard: 5410,
          potato: 1360,
          soybean: 4680
        },
        arrivalsTodayQtl: 6200,
        paymentMode: 'eNAM RTGS / 24 घंटे में'
      },
      {
        id: 'morena_mandi',
        name: 'मुरैना अनाज व तिलहन मंडी (Morena APMC)',
        district: 'मुरैना',
        state: 'मध्य प्रदेश',
        distanceKm: 58,
        isLocal: false,
        apmcRegulated: true,
        brokerCommissionPercent: 2.5,
        handlingFeePerQtl: 22,
        congestionWaitHours: 5,
        prices: {
          onion: 2490,
          tomato: 1680,
          wheat: 2680,
          mustard: 5620, // Mustard capital of MP
          potato: 1390,
          soybean: 4640
        },
        arrivalsTodayQtl: 7800,
        paymentMode: 'eNAM सीधे खाते में'
      },
      {
        id: 'agra_mandi',
        name: 'आगरा नवीन गल्ला मंडी (Agra APMC / UP)',
        district: 'आगरा',
        state: 'उत्तर प्रदेश',
        distanceKm: 128,
        isLocal: false,
        apmcRegulated: false, // Private big traders / unregulated cuts
        brokerCommissionPercent: 5.5, // High broker cut! (Illustration of trap)
        handlingFeePerQtl: 35,
        congestionWaitHours: 9,
        prices: {
          onion: 2790, // Seemingly high raw price!
          tomato: 1940,
          wheat: 2840,
          mustard: 5740,
          potato: 1540,
          soybean: 4780
        },
        arrivalsTodayQtl: 14500,
        paymentMode: 'आढ़तिया चेक / 3 दिन का समय'
      }
    ]
  },
  nashik_cluster: {
    regionName: 'नासिक - उत्तर महाराष्ट्र क्लस्टर (MH)',
    baseFarmerLocation: 'निफाड़ (Niphad), नासिक',
    mandis: [
      {
        id: 'lasalgaon',
        name: 'लासलगांव मंडी (Lasalgaon - एशिया की सबसे बड़ी प्याज मंडी)',
        district: 'नासिक',
        state: 'महाराष्ट्र',
        distanceKm: 18,
        isLocal: true,
        apmcRegulated: true,
        brokerCommissionPercent: 1.5,
        handlingFeePerQtl: 16,
        congestionWaitHours: 3,
        prices: {
          onion: 2560,
          tomato: 1640,
          wheat: 2590,
          mustard: 5280,
          potato: 1300,
          soybean: 4610
        },
        arrivalsTodayQtl: 28000,
        paymentMode: 'RTGS उसी दिन'
      },
      {
        id: 'umrane',
        name: 'उमराने मंडी (Umrane APMC)',
        district: 'नासिक',
        state: 'महाराष्ट्र',
        distanceKm: 48,
        isLocal: false,
        apmcRegulated: true,
        brokerCommissionPercent: 2.0,
        handlingFeePerQtl: 20,
        congestionWaitHours: 4,
        prices: {
          onion: 2788, // Peak onion
          tomato: 1730,
          wheat: 2620,
          mustard: 5310,
          potato: 1340,
          soybean: 4650
        },
        arrivalsTodayQtl: 12500,
        paymentMode: 'नकद व बैंक ट्रांसफर'
      },
      {
        id: 'chandwad',
        name: 'चांदवड़ मंडी (Chandwad APMC)',
        district: 'नासिक',
        state: 'महाराष्ट्र',
        distanceKm: 36,
        isLocal: false,
        apmcRegulated: true,
        brokerCommissionPercent: 1.8,
        handlingFeePerQtl: 18,
        congestionWaitHours: 3,
        prices: {
          onion: 2640,
          tomato: 1980, // Peak tomato
          wheat: 2600,
          mustard: 5290,
          potato: 1320,
          soybean: 4630
        },
        arrivalsTodayQtl: 9800,
        paymentMode: 'सीधे बैंक खाते में'
      },
      {
        id: 'pimpalgaon',
        name: 'पिंपलगांव बसवंत (Pimpalgaon APMC)',
        district: 'नासिक',
        state: 'महाराष्ट्र',
        distanceKm: 28,
        isLocal: false,
        apmcRegulated: true,
        brokerCommissionPercent: 2.2,
        handlingFeePerQtl: 19,
        congestionWaitHours: 5,
        prices: {
          onion: 2680,
          tomato: 1890,
          wheat: 2610,
          mustard: 5300,
          potato: 1330,
          soybean: 4640
        },
        arrivalsTodayQtl: 19200,
        paymentMode: 'तत्काल भुगतान'
      }
    ]
  }
};

// Transport Vehicles Specification
export const TRANSPORT_MODES = [
  {
    id: 'pickup',
    name: 'छोटा हाथी / महिन्द्रा पिकअप (Pickup)',
    capacityQuintals: 20,
    baseRentRupees: 350,
    ratePerKmPerQuintal: 2.8, // ₹2.8 per km per quintal
    loadingUnloadingPerQtl: 15,
    speedKmH: 45,
    icon: '🛻',
    suitableFor: 'छोटे किसान (10-25 क्विंटल)'
  },
  {
    id: 'tractor',
    name: 'ट्रैक्टर - ट्रॉली (Tractor Trolley)',
    capacityQuintals: 50,
    baseRentRupees: 500,
    ratePerKmPerQuintal: 2.2,
    loadingUnloadingPerQtl: 18,
    speedKmH: 30,
    icon: '🚜',
    suitableFor: 'मध्यम किसान (25-60 क्विंटल)'
  },
  {
    id: 'truck',
    name: 'बड़ा 10-चक्का ट्रक / आयशर (Truck)',
    capacityQuintals: 150,
    baseRentRupees: 1400,
    ratePerKmPerQuintal: 1.6, // Bulk efficiency
    loadingUnloadingPerQtl: 22,
    speedKmH: 55,
    icon: '🚛',
    suitableFor: 'FPO / बड़े किसान समूह (60-200 क्विंटल)'
  },
  {
    id: 'cart',
    name: 'जुगाड़ वाहन / स्थानीय लोडर (Local Cart)',
    capacityQuintals: 12,
    baseRentRupees: 200,
    ratePerKmPerQuintal: 3.5,
    loadingUnloadingPerQtl: 10,
    speedKmH: 20,
    icon: '🛒',
    suitableFor: 'अति निकट मंडी (0-15 किमी)'
  }
];

// Default Farmer Lots in Store (फसल स्टॉक)
export const INITIAL_HOLDINGS = [
  {
    id: 'lot-onion-1',
    cropId: 'onion',
    cropName: 'प्याज (Onion)',
    quantityQuintal: 40,
    storageDate: '2026-08-22',
    storageCondition: 'हवादार जालीदार कमरा (Well Ventilated)',
    location: 'मुरार / ग्वालियर (MP)',
    recommendedAction: 'HOLD',
    recommendedDays: 5,
    targetMandiId: 'umrane',
    targetMandiName: 'उमराने मंडी (Umrane)',
    peakDateStr: '29 अगस्त',
    currentLocalPrice: 2420,
    targetPrice: 2788,
    gainPerQuintal: 184,
    totalGain: 7360,
    confidence: 87,
    statusTextHindi: '5 दिन रुकें। 29 अगस्त को भाव ₹2,788 का शिखर छुएगा। भाड़ा काटकर भी ₹7,360 अतिरिक्त मुनाफा होगा।'
  },
  {
    id: 'lot-tomato-2',
    cropId: 'tomato',
    cropName: 'टमाटर (Tomato)',
    quantityQuintal: 15,
    storageDate: '2026-08-24',
    storageCondition: 'खेत पर क्रेट्स में (Crates on field)',
    location: 'चांदवड़ / नासिक',
    recommendedAction: 'MOVE',
    recommendedDays: 0,
    targetMandiId: 'chandwad',
    targetMandiName: 'चांदवड़ मंडी (Chandwad)',
    peakDateStr: 'आज ही बेचें (Today)',
    currentLocalPrice: 1620,
    targetPrice: 1980,
    gainPerQuintal: 202,
    totalGain: 3030,
    confidence: 94,
    statusTextHindi: 'मंडी बदलें। स्थानीय यार्ड के बजाय चांदवड़ जाएं। ₹202 प्रति क्विंटल अतिरिक्त मिलेंगे।'
  },
  {
    id: 'lot-wheat-3',
    cropId: 'wheat',
    cropName: 'गेहूँ (Wheat)',
    quantityQuintal: 65,
    storageDate: '2026-08-10',
    storageCondition: 'पक्का सूखा गोदाम (Dry Godown)',
    location: 'घाटीगांव, ग्वालियर',
    recommendedAction: 'HOLD',
    recommendedDays: 8,
    targetMandiId: 'dabra_mandi',
    targetMandiName: 'डबरा मंडी (Dabra)',
    peakDateStr: '01 सितम्बर',
    currentLocalPrice: 2610,
    targetPrice: 2780,
    gainPerQuintal: 165,
    totalGain: 10725,
    confidence: 89,
    statusTextHindi: '8 दिन रुकें। डबरा मंडी में रोलर मिलों की खरीद से कुल ₹10,725 का सीधा लाभ होगा।'
  }
];

// Presets for Spoken Bhasini Queries
export const BHASHINI_VOICE_QUERIES = [
  {
    id: 'q1',
    queryText: 'आज प्याज बेचना सही रहेगा या कुछ दिन रुकना चाहिए?',
    audioBadge: 'प्याज सलाह',
    replyText: 'किसान भाई, हमारे AI मॉडल के अनुसार आपको प्याज 5 दिन रोककर रखना चाहिए। 29 अगस्त को उमराने मंडी में आवक कम होने से भाव ₹2,788 तक जाएगा। इससे आपको ढुलाई खर्च काटकर भी ₹184 प्रति क्विंटल का शुद्ध मुनाफा होगा।',
    actionLink: '/app/crop/onion'
  },
  {
    id: 'q2',
    queryText: 'ग्वालियर और आगरा मंडी में से किसमें ज्यादा शुद्ध पैसा मिलेगा?',
    audioBadge: 'मंडी तुलना',
    replyText: 'सावधान किसान भाई! आगरा मंडी में दिखने वाला भाव ₹2,790 है जो ग्वालियर से ₹370 अधिक दिखता है, लेकिन 128 किमी का भारी भाड़ा और वहां के आढ़तियों की 5.5% दलाली के कारण आपको उल्टे ₹220 प्रति क्विंटल का घाटा होगा! पास की डबरा या ग्वालियर मंडी में बेचना ही सबसे अकलमंदी है।',
    actionLink: '/app/compare'
  },
  {
    id: 'q3',
    queryText: 'टमाटर का क्या हाल है? क्या रुकने से भाव बढ़ेगा?',
    audioBadge: 'टमाटर चेतावनी',
    replyText: 'बिल्कुल नहीं! टमाटर शीघ्र नष्ट होने वाली फसल है। आगामी 3 दिनों में अधिक आवक से भाव ₹150 प्रति क्विंटल गिरेंगे और सड़न भी होगी। तुरंत आज ही चांदवड़ मंडी में माल बेचें।',
    actionLink: '/app/crop/tomato'
  },
  {
    id: 'q4',
    queryText: 'दलाली और गाड़ी भाड़े में किसान का कितना पैसा कट जाता है?',
    audioBadge: 'मुनाफ़ा गणित',
    replyText: 'औसतन एक किसान अपनी कमाई का 12 से 22 प्रतिशत हिस्सा बेफिजूल दलाली और अनियोजित परिवहन में गँवा देता है। कृषिवाणी का मुनाफ़ा कैलकुलेटर आपको बताता है कि कौन सी गाड़ी और कौन सी अधिकृत मंडी आपके लिए सबसे ज्यादा हाथ में शुद्ध पैसा देगी।',
    actionLink: '/app/compare'
  }
];

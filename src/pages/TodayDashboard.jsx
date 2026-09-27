import React, { useState } from 'react';
import { 
  TrendingUp, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  Printer,
  Calendar,
  Sparkles
} from 'lucide-react';
import { getInitialHoldings, CROPS } from '../data/mandiData';
import { bhasiniService } from '../services/bhasiniService';
import { formatHindiDate, formatIsoDate, getCropDynamicTimeline } from '../utils/dateUtils';

export default function TodayDashboard({ 
  navigate, 
  onGeneratePass, 
  onOpenVoiceModal 
}) {
  const [holdings, setHoldings] = useState(() => getInitialHoldings());
  const [expandedLotId, setExpandedLotId] = useState(null);
  const [isSpeakingLotId, setIsSpeakingLotId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New lot form
  const [newCropId, setNewCropId] = useState('onion');
  const [newQuantity, setNewQuantity] = useState(30);
  const [newLocation, setNewLocation] = useState('ग्वालियर');

  const tickerItems = [
    { crop: 'प्याज', mandi: 'उमराने मंडी', price: '₹2,788/qtl', trend: '+14% उछाल' },
    { crop: 'टमाटर', mandi: 'चांदवड़ मंडी', price: '₹1,980/qtl', trend: 'तुरंत बेचें' },
    { crop: 'गेहूँ', mandi: 'डबरा मंडी', price: '₹2,780/qtl', trend: '+₹165 लाभ' },
    { crop: 'सरसों', mandi: 'मुरैना मंडी', price: '₹5,580/qtl', trend: 'स्थिर मांग' }
  ];

  const toggleExpand = (lotId) => {
    setExpandedLotId(expandedLotId === lotId ? null : lotId);
  };

  const handleSpeakAdvice = (lot) => {
    if (isSpeakingLotId === lot.id) {
      bhasiniService.stopSpeaking();
      setIsSpeakingLotId(null);
    } else {
      setIsSpeakingLotId(lot.id);
      bhasiniService.speak(lot.statusTextHindi, null, () => {
        setIsSpeakingLotId(null);
      });
    }
  };

  const handleAddNewLot = (e) => {
    e.preventDefault();
    const cropObj = CROPS.find(c => c.id === newCropId) || CROPS[0];
    const timeline = getCropDynamicTimeline(cropObj);

    const newLot = {
      id: `lot-custom-${Date.now()}`,
      cropId: cropObj.id,
      cropName: cropObj.name,
      quantityQuintal: Number(newQuantity),
      storageDate: formatIsoDate(new Date()),
      storageCondition: 'हवादार किसान गोदाम',
      location: newLocation,
      recommendedAction: cropObj.forecastDays > 0 ? 'HOLD' : 'MOVE',
      recommendedDays: cropObj.forecastDays,
      targetMandiId: cropObj.forecastBestMandi,
      targetMandiName: cropObj.forecastBestMandi,
      peakDateStr: timeline.peakDateStr,
      currentLocalPrice: cropObj.currentAvgModalPrice,
      targetPrice: cropObj.forecastPeakPrice,
      gainPerQuintal: cropObj.gainPerQuintal,
      totalGain: cropObj.gainPerQuintal * Number(newQuantity),
      confidence: cropObj.confidence,
      statusTextHindi: timeline.reasonHindi
    };

    setHoldings([newLot, ...holdings]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] pb-24 transition-colors">
      
      {/* Slim Live Price Ticker Ribbon */}
      <div className="border-b border-[var(--border-color)] bg-[var(--bg-card-subtle)] text-xs py-2 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-[var(--brand-green)] text-[11px] uppercase tracking-wide">
              Agmarknet भाव:
            </span>
            <span className="text-[10px] font-semibold text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border-color)] px-1.5 py-0.5 rounded">
              डेमो डेटा
            </span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto text-[11px] text-[var(--text-muted)]">
            {tickerItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-semibold text-[var(--text-main)]">{item.crop}:</span>
                <span>{item.mandi}</span>
                <span className="font-bold text-[var(--brand-green)]">{item.price}</span>
                <span className="text-[10px] text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.2 rounded font-medium">
                  {item.trend}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/app/compare')}
            className="text-[11px] font-bold text-[var(--brand-green)] hover:underline shrink-0"
          >
            मंडी तुलना →
          </button>
        </div>
      </div>

      {/* Top Section Header */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-color)] bg-[var(--bg-header)]">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl sm:text-4xl font-black tracking-tight text-[var(--text-main)]">
              गोदाम में {holdings.length} फसलें स्टॉक में
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
              रंग, निर्णय और आपके हाथ में शुद्ध रोकड़ा।
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] px-4 py-2.5 text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              <Plus className="h-4 w-4 text-[var(--brand-green)]" />
              <span>फसल जोड़ें</span>
            </button>

            <button
              onClick={onOpenVoiceModal}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-white px-4 py-2.5 text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              <Volume2 className="h-4 w-4" />
              <span>बोलकर पूछें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lot Cards with Crop Color Top Strips */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        
        {holdings.map((lot) => {
          const isExpanded = expandedLotId === lot.id;
          const isHoldingCrop = lot.recommendedAction === 'HOLD';
          const isSpeaking = isSpeakingLotId === lot.id;
          const cropObj = CROPS.find(c => c.id === lot.cropId) || CROPS[0];
          const cropTheme = cropObj.theme;

          return (
            <div
              key={lot.id}
              className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm overflow-hidden farmer-card"
            >
              {/* Soft Colored Top Strip matching the Crop */}
              <div 
                className="h-2 w-full"
                style={{ backgroundColor: cropTheme.stripColor }}
              />

              {/* Card Header Bar */}
              <div className="flex flex-wrap items-center justify-between p-5 border-b border-[var(--border-color)] gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl text-3xl shadow-sm border border-[var(--border-color)] bg-[var(--bg-card-subtle)]">
                    {cropObj.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-heading text-xl sm:text-2xl font-black text-[var(--text-main)]">
                        {lot.cropName}
                      </h2>
                      <span className="text-xs bg-[var(--bg-card-subtle)] text-[var(--text-muted)] font-bold px-2.5 py-0.5 rounded-full border border-[var(--border-color)]">
                        {lot.quantityQuintal} क्विंटल
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 flex items-center gap-2">
                      <span>स्थान: {lot.location}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        भंडारित: {formatHindiDate(lot.storageDate)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Big Clear Decision Badge */}
                  <div className={`px-4 py-2 rounded-2xl text-center font-heading font-black text-sm sm:text-base border shadow-sm ${
                    isHoldingCrop
                      ? 'bg-amber-100/90 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                      : 'bg-emerald-100/90 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800'
                  }`}>
                    <span className="block text-[9px] uppercase tracking-wider font-sans font-bold opacity-75">
                      {isHoldingCrop ? 'प्रतीक्षा सलाह' : 'तुरंत बिक्री'}
                    </span>
                    <span>
                      {isHoldingCrop ? `${lot.recommendedDays} दिन रुकें` : 'मंडी बदलें'}
                    </span>
                  </div>

                  {/* Audio Button */}
                  <button
                    onClick={() => handleSpeakAdvice(lot)}
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-all ${
                      isSpeaking
                        ? 'bg-amber-500 text-white border-amber-500 animate-pulse ring-4 ring-amber-300'
                        : 'border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--brand-green)] hover:text-white hover:border-[var(--brand-green)] shadow-sm'
                    }`}
                    title={isSpeaking ? 'आवाज़ रोकें' : 'सलाह सुनें'}
                  >
                    {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Status Sentence */}
              <div className="px-5 py-3.5 bg-[var(--bg-card-subtle)] border-b border-[var(--border-color)]">
                <p className="text-xs sm:text-sm text-[var(--text-main)] font-medium leading-relaxed">
                  {lot.statusTextHindi}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="p-5 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <div className="p-3.5 rounded-2xl bg-[var(--brand-green-subtle)] border border-emerald-200 dark:border-emerald-800/50">
                  <span className="text-[10px] font-bold text-[var(--brand-green)] uppercase block">
                    प्रति क्विंटल शुद्ध लाभ
                  </span>
                  <div className="font-heading text-xl sm:text-2xl font-black text-[var(--brand-green)] mt-0.5">
                    +₹{lot.gainPerQuintal}
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)]">भाड़ा व दलाली काटकर</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--accent-gold-subtle)] border border-amber-200 dark:border-amber-800/50">
                  <span className="text-[10px] font-bold text-[#D97706] uppercase block">
                    कुल फसल पर अतिरिक्त कमाई
                  </span>
                  <div className="font-heading text-xl sm:text-2xl font-black text-[#D97706] mt-0.5">
                    +₹{lot.totalGain?.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)]">{lot.quantityQuintal} क्विंटल लॉट पर</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">
                    सर्वोत्तम मंडी
                  </span>
                  <div className="font-heading text-base font-bold text-[var(--text-main)] mt-0.5 truncate">
                    {lot.targetMandiName}
                  </div>
                  <span className="text-[11px] font-semibold text-[var(--brand-green)]">{lot.peakDateStr}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">
                    AI मॉडल विश्वास
                  </span>
                  <div className="font-heading text-xl sm:text-2xl font-black text-[var(--text-main)] mt-0.5">
                    {lot.confidence}%
                  </div>
                  <span className="text-[10px] text-[var(--text-muted)]">Agmarknet ट्रेंड</span>
                </div>
              </div>

              {/* Expandable Breakdown Drawer */}
              {isExpanded && (
                <div className="border-t border-[var(--border-color)] bg-[var(--bg-card-subtle)] p-5 space-y-3.5 animate-fadeIn text-xs">
                  <h3 className="font-heading font-bold text-sm text-[var(--text-main)] flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-[var(--brand-green)]" />
                    <span>यह गणना कैसे हुई? (कटौती विवरण)</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)]">
                      <span className="text-[var(--text-muted)] block">घोषित भाव:</span>
                      <span className="font-bold text-[var(--text-main)] text-sm">₹{lot.targetPrice} /क्विंटल</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-red-600">
                      <span className="block">(-) गाड़ी भाड़ा:</span>
                      <span className="font-bold text-sm">-₹110 /क्विंटल</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-red-600">
                      <span className="block">(-) दलाली (2%):</span>
                      <span className="font-bold text-sm">-₹55 /क्विंटल</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[var(--brand-green-subtle)] border border-emerald-200 dark:border-emerald-800 text-[var(--brand-green)]">
                      <span className="block font-semibold">(=) शुद्ध हाथ में भाव:</span>
                      <span className="font-black text-sm">₹{lot.targetPrice - 165} /क्विंटल</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2.5">
                    <button
                      onClick={() => {
                        onGeneratePass({
                          cropName: lot.cropName,
                          quantityQtl: lot.quantityQuintal,
                          mandiName: lot.targetMandiName,
                          rawQuotedPrice: lot.targetPrice,
                          transportPerQtl: 110,
                          brokerPerQtl: 55,
                          brokerPercent: 2.0,
                          handlingPerQtl: 18,
                          decayLossPerQtl: 0,
                          netRatePerQtl: lot.targetPrice - 183,
                          netInHandTotal: (lot.targetPrice - 183) * lot.quantityQuintal,
                          distanceKm: 45
                        });
                      }}
                      className="px-3.5 py-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] font-bold text-xs flex items-center gap-1.5"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      <span>मंडी पर्ची बनाएं</span>
                    </button>

                    <button
                      onClick={() => navigate('/app/compare')}
                      className="px-4 py-2 rounded-xl bg-[var(--brand-green)] text-white font-bold text-xs hover:bg-[var(--brand-green-hover)] shadow-sm"
                    >
                      मंडी तुलना खोलें →
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Footer Bar */}
              <div className="flex items-center justify-between px-5 py-3 bg-[var(--bg-card-subtle)] border-t border-[var(--border-color)] text-xs">
                <button
                  onClick={() => toggleExpand(lot.id)}
                  className="flex items-center gap-1 font-bold text-[var(--brand-green)] hover:underline"
                >
                  <span>{isExpanded ? 'विवरण छुपाएं' : 'कटौती विवरण देखें'}</span>
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                <button
                  onClick={() => navigate(`/app/crop/${lot.cropId}`)}
                  className="font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1"
                >
                  <span>30 दिन का मूल्य चार्ट</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

            </div>
          );
        })}

      </main>

      {/* Add New Lot Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-3xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6 shadow-2xl space-y-4 text-[var(--text-main)]">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <h3 className="font-heading text-lg font-bold">नई फसल जोड़ें</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewLot} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold mb-1">फसल चुनें:</label>
                <select
                  value={newCropId}
                  onChange={(e) => setNewCropId(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2.5 focus:border-[var(--brand-green)] focus:outline-none"
                >
                  {CROPS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (भाव ₹{c.currentAvgModalPrice}/qtl)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">मात्रा (क्विंटल):</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2.5 focus:border-[var(--brand-green)] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">स्थान / गांव:</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2.5 focus:border-[var(--brand-green)] focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[var(--text-muted)] hover:bg-[var(--bg-card-subtle)] font-medium"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--brand-green)] hover:bg-[var(--brand-green-hover)] text-white font-bold"
                >
                  सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

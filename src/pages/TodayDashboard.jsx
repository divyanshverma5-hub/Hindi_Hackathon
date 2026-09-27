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
  Printer
} from 'lucide-react';
import { INITIAL_HOLDINGS, CROPS } from '../data/mandiData';
import { bhasiniService } from '../services/bhasiniService';

export default function TodayDashboard({ 
  navigate, 
  onGeneratePass, 
  onOpenVoiceModal 
}) {
  const [holdings, setHoldings] = useState(INITIAL_HOLDINGS);
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
    const newLot = {
      id: `lot-custom-${Date.now()}`,
      cropId: cropObj.id,
      cropName: cropObj.name,
      quantityQuintal: Number(newQuantity),
      storageDate: new Date().toISOString().split('T')[0],
      storageCondition: 'हवादार किसान गोदाम',
      location: newLocation,
      recommendedAction: cropObj.forecastDays > 0 ? 'HOLD' : 'MOVE',
      recommendedDays: cropObj.forecastDays,
      targetMandiId: cropObj.forecastBestMandi,
      targetMandiName: cropObj.forecastBestMandi,
      peakDateStr: cropObj.forecastDays > 0 ? `+${cropObj.forecastDays} दिन` : 'आज ही',
      currentLocalPrice: cropObj.currentAvgModalPrice,
      targetPrice: cropObj.forecastPeakPrice,
      gainPerQuintal: cropObj.gainPerQuintal,
      totalGain: cropObj.gainPerQuintal * Number(newQuantity),
      confidence: cropObj.confidence,
      statusTextHindi: cropObj.reasonHindi
    };

    setHoldings([newLot, ...holdings]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] pb-20 transition-colors">
      
      {/* Slim Live Price Ticker Ribbon */}
      <div className="border-b border-[var(--border-color)] bg-[var(--bg-card-subtle)] text-xs py-1.5 px-4 overflow-hidden">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-[#2e7d32] text-[11px] uppercase">
              Agmarknet सजीव भाव:
            </span>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto text-[11px] text-[var(--text-muted)]">
            {tickerItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-semibold text-[var(--text-main)]">{item.crop}:</span>
                <span>{item.mandi}</span>
                <span className="font-bold text-[#2e7d32]">{item.price}</span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-1 rounded font-medium">
                  {item.trend}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/app/compare')}
            className="text-[11px] font-semibold text-[#2e7d32] hover:underline shrink-0"
          >
            मंडी तुलना →
          </button>
        </div>
      </div>

      {/* Top Section Header */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-color)] bg-[var(--bg-header)]">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-main)]">
              गोदाम में {holdings.length} फसलें स्टॉक में
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
              रंग, निर्णय और आपके हाथ में शुद्ध रुपया।
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)] px-3.5 py-2 text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="h-4 w-4 text-[#2e7d32]" />
              <span>फसल जोड़ें</span>
            </button>

            <button
              onClick={onOpenVoiceModal}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2e7d32] hover:bg-[#256629] text-white px-3.5 py-2 text-xs font-bold shadow-sm transition-all"
            >
              <Volume2 className="h-4 w-4" />
              <span>बोलकर पूछें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lot Cards */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-6 space-y-5">
        
        {holdings.map((lot) => {
          const isExpanded = expandedLotId === lot.id;
          const isHoldingCrop = lot.recommendedAction === 'HOLD';
          const isSpeaking = isSpeakingLotId === lot.id;
          const cropObj = CROPS.find(c => c.id === lot.cropId) || CROPS[0];

          return (
            <div
              key={lot.id}
              className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm overflow-hidden transition-all hover:border-[#2e7d32]"
            >
              {/* Card Header Bar */}
              <div className="flex flex-wrap items-center justify-between p-4 sm:p-5 border-b border-[var(--border-color)] gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cropObj.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg sm:text-xl font-bold text-[var(--text-main)]">
                        {lot.cropName}
                      </h2>
                      <span className="text-xs bg-[var(--bg-card-subtle)] text-[var(--text-muted)] font-semibold px-2 py-0.5 rounded border border-[var(--border-color)]">
                        {lot.quantityQuintal} क्विंटल
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      स्थान: {lot.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Clean Decision Tag */}
                  <span className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold border ${
                    isHoldingCrop
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  }`}>
                    {isHoldingCrop ? `${lot.recommendedDays} दिन रुकें` : 'मंडी बदलें'}
                  </span>

                  {/* Audio Button */}
                  <button
                    onClick={() => handleSpeakAdvice(lot)}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                      isSpeaking
                        ? 'bg-amber-500 text-white border-amber-500 animate-pulse'
                        : 'border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[#2e7d32] hover:text-white hover:border-[#2e7d32]'
                    }`}
                    title={isSpeaking ? 'आवाज़ रोकें' : 'सलाह सुनें'}
                  >
                    {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Status Sentence */}
              <div className="px-4 sm:px-5 py-3 bg-[var(--bg-card-subtle)] border-b border-[var(--border-color)]">
                <p className="text-xs sm:text-sm text-[var(--text-main)] font-medium leading-relaxed">
                  {lot.statusTextHindi}
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[var(--brand-green-subtle)] border border-emerald-200 dark:border-emerald-800/50">
                  <span className="text-[10px] font-bold text-[#2e7d32] uppercase block">
                    प्रति क्विंटल शुद्ध लाभ
                  </span>
                  <div className="text-lg sm:text-xl font-black text-[#2e7d32] mt-0.5">
                    +₹{lot.gainPerQuintal}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--accent-amber-subtle)] border border-amber-200 dark:border-amber-800/50">
                  <span className="text-[10px] font-bold text-[#d97706] uppercase block">
                    कुल फसल पर अतिरिक्त कमाई
                  </span>
                  <div className="text-lg sm:text-xl font-black text-[#d97706] mt-0.5">
                    +₹{lot.totalGain?.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">
                    सर्वोत्तम मंडी
                  </span>
                  <div className="text-sm font-bold text-[var(--text-main)] mt-0.5 truncate">
                    {lot.targetMandiName}
                  </div>
                  <span className="text-[11px] text-[var(--text-muted)]">{lot.peakDateStr}</span>
                </div>

                <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                  <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">
                    AI विश्वास
                  </span>
                  <div className="text-lg sm:text-xl font-black text-[var(--text-main)] mt-0.5">
                    {lot.confidence}%
                  </div>
                </div>
              </div>

              {/* Expandable Breakdown Drawer */}
              {isExpanded && (
                <div className="border-t border-[var(--border-color)] bg-[var(--bg-card-subtle)] p-4 sm:p-5 space-y-3 animate-fadeIn text-xs">
                  <h3 className="font-bold text-[var(--text-main)] flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#2e7d32]" />
                    <span>यह गणना कैसे हुई? (कटौती विवरण)</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)]">
                      <span className="text-[var(--text-muted)] block">घोषित भाव:</span>
                      <span className="font-bold text-[var(--text-main)]">₹{lot.targetPrice} /क्विंटल</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-red-600">
                      <span className="block">(-) गाड़ी भाड़ा:</span>
                      <span className="font-bold">-₹110 /क्विंटल</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-red-600">
                      <span className="block">(-) दलाली (2%):</span>
                      <span className="font-bold">-₹55 /क्विंटल</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-[var(--brand-green-subtle)] border border-emerald-200 dark:border-emerald-800 text-[#2e7d32]">
                      <span className="block font-semibold">(=) शुद्ध हाथ में भाव:</span>
                      <span className="font-black text-sm">₹{lot.targetPrice - 165} /क्विंटल</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={() => navigate('/app/compare')}
                      className="px-3 py-1.5 rounded-lg bg-[#2e7d32] text-white font-semibold text-xs hover:bg-[#256629]"
                    >
                      मंडी तुलना खोलें →
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Footer Bar */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 bg-[var(--bg-card-subtle)] border-t border-[var(--border-color)] text-xs">
                <button
                  onClick={() => toggleExpand(lot.id)}
                  className="flex items-center gap-1 font-bold text-[#2e7d32] hover:underline"
                >
                  <span>{isExpanded ? 'विवरण छुपाएं' : 'कटौती विवरण देखें'}</span>
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                <button
                  onClick={() => navigate(`/app/crop/${lot.cropId}`)}
                  className="font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1"
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
          <div className="w-full max-w-sm rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5 shadow-2xl space-y-4 text-[var(--text-main)]">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2.5">
              <h3 className="text-base font-bold">नई फसल जोड़ें</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-main)]">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewLot} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold mb-1">फसल चुनें:</label>
                <select
                  value={newCropId}
                  onChange={(e) => setNewCropId(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2 focus:border-[#2e7d32] focus:outline-none"
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
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2 focus:border-[#2e7d32] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">स्थान / गांव:</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2 focus:border-[#2e7d32] focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-card-subtle)] font-medium"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2e7d32] hover:bg-[#256629] text-white font-bold"
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

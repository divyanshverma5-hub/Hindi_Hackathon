import React, { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  Truck, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
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

  // New lot form state
  const [newCropId, setNewCropId] = useState('onion');
  const [newQuantity, setNewQuantity] = useState(30);
  const [newLocation, setNewLocation] = useState('ग्वालियर');

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
      peakDateStr: cropObj.forecastDays > 0 ? `+${cropObj.forecastDays} दिन` : 'आज ही (Today)',
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
    <div className="min-h-screen bg-[#F8F9F5] text-[#1E2922] pb-24">
      
      {/* Top Banner & Quick Controls */}
      <div className="bg-[#14231b] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-[#2d6a4f]/30">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-2 w-2 rounded-full bg-[#e09f3e] animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#e09f3e]">
                आज का सजीव निर्णय (Today's Advisory)
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              गोदाम में {holdings.length} फसलें स्टॉक में
            </h1>
            <p className="text-sm text-gray-300 mt-1">
              सिर्फ आंकड़े नहीं — रंग, निर्णय और आपके हाथ में शुद्ध रुपया।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#2e7d32] hover:bg-[#388e3c] text-white px-4 py-2.5 text-sm font-bold shadow-md transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>नई फसल दर्ज करें</span>
            </button>

            <button
              onClick={onOpenVoiceModal}
              className="inline-flex items-center gap-2 rounded-xl bg-[#e09f3e] hover:bg-[#d97706] text-[#14231b] px-4 py-2.5 text-sm font-bold shadow-md transition-all"
            >
              <Volume2 className="h-4 w-4" />
              <span>आवाज़ में सुनें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Lot Cards Container */}
      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-5 space-y-6">
        
        {holdings.map((lot) => {
          const isExpanded = expandedLotId === lot.id;
          const isHoldingCrop = lot.recommendedAction === 'HOLD';
          const isSpeaking = isSpeakingLotId === lot.id;
          const cropObj = CROPS.find(c => c.id === lot.cropId) || CROPS[0];

          return (
            <div
              key={lot.id}
              className="rounded-2xl bg-white border border-gray-200 shadow-lg overflow-hidden transition-all hover:border-[#2e7d32]/60"
            >
              
              {/* Card Header Bar */}
              <div className="flex flex-wrap items-center justify-between p-4 sm:p-6 border-b border-gray-100 gap-4">
                
                {/* Crop Identity */}
                <div className="flex items-center gap-3.5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-3xl shadow-inner">
                    {cropObj.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-[#14231b]">
                        {lot.cropName}
                      </h2>
                      <span className="text-xs bg-gray-100 text-gray-700 font-bold px-2 py-0.5 rounded-full border">
                        {lot.quantityQuintal} क्विंटल
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">
                      स्थान: {lot.location} · भंडारित दिनांक: {lot.storageDate}
                    </p>
                  </div>
                </div>

                {/* Big Visual Decision Badge */}
                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-xl text-center font-extrabold text-sm sm:text-base border shadow-sm ${
                    isHoldingCrop
                      ? 'bg-amber-100/80 text-amber-900 border-amber-300'
                      : 'bg-emerald-100/80 text-emerald-900 border-emerald-300'
                  }`}>
                    <span className="block text-[10px] uppercase font-bold tracking-wider opacity-75">
                      {isHoldingCrop ? 'प्रतीक्षा सलाह' : 'त्वरित कार्रवाई'}
                    </span>
                    <span>
                      {isHoldingCrop ? `${lot.recommendedDays} दिन रुकें (Hold)` : 'मंडी बदलें (Move Mandi)'}
                    </span>
                  </div>

                  {/* Audio Advice Button */}
                  <button
                    onClick={() => handleSpeakAdvice(lot)}
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-all ${
                      isSpeaking
                        ? 'bg-[#e09f3e] text-[#14231b] border-[#e09f3e] animate-pulse ring-4 ring-amber-300'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-[#2e7d32] hover:text-white hover:border-[#2e7d32]'
                    }`}
                    title={isSpeaking ? 'आवाज़ रोकें' : 'हिंदी में सलाह सुनें (BHASHINI)'}
                  >
                    {isSpeaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                  </button>
                </div>

              </div>

              {/* Actionable Prompt Banner */}
              <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-[#f4f7f2] border-b border-gray-100">
                <p className="text-sm sm:text-base text-gray-800 font-medium leading-relaxed">
                  {lot.statusTextHindi}
                </p>
              </div>

              {/* Rupee Gain & Mandi Target Grid */}
              <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white">
                
                {/* Metric 1: Net Gain per Quintal */}
                <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <span className="text-[11px] font-bold text-emerald-800 uppercase block">
                    प्रति क्विंटल शुद्ध लाभ
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[#2e7d32] mt-0.5">
                    +₹{lot.gainPerQuintal}
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">भाड़ा व दलाली काटकर</span>
                </div>

                {/* Metric 2: Total Harvest Gain */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-100">
                  <span className="text-[11px] font-bold text-amber-800 uppercase block">
                    कुल फसल पर अतिरिक्त कमाई
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[#b45309] mt-0.5">
                    +₹{lot.totalGain?.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">{lot.quantityQuintal} क्विंटल लॉट पर</span>
                </div>

                {/* Metric 3: Target Mandi & Peak Date */}
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100">
                  <span className="text-[11px] font-bold text-blue-800 uppercase block">
                    सर्वश्रेष्ठ मंडी व शिखर
                  </span>
                  <div className="text-base font-extrabold text-blue-950 mt-0.5 truncate">
                    {lot.targetMandiName}
                  </div>
                  <span className="text-[11px] font-semibold text-blue-700">{lot.peakDateStr}</span>
                </div>

                {/* Metric 4: AI Model Confidence */}
                <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100">
                  <span className="text-[11px] font-bold text-purple-800 uppercase block">
                    AI मॉडल विश्वास
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-purple-900 mt-0.5">
                    {lot.confidence}%
                  </div>
                  <span className="text-[10px] text-gray-500 font-medium">LSTM + Agmarknet ट्रेंड</span>
                </div>

              </div>

              {/* What This Assumes / Expandable Deduction Math */}
              {isExpanded && (
                <div className="border-t border-gray-200 bg-[#fbfcf9] p-5 sm:p-6 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-[#14231b] flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#2e7d32]" />
                      <span>यह गणना कैसे की गई? (गणितीय सूत्र व कटौती विवरण)</span>
                    </h3>
                    <span className="text-xs text-gray-500 font-mono">
                      Net = Price - (Freight + Broker + Spoilage)
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-white border border-gray-200">
                      <span className="text-gray-500 block">घोषित थोक भाव (Mandi Price):</span>
                      <span className="font-bold text-gray-900 text-sm">₹{lot.targetPrice} /क्विंटल</span>
                    </div>
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <span className="text-red-700 block">(-) परिवहन खर्च (भाड़ा):</span>
                      <span className="font-bold text-red-900 text-sm">-₹110 /क्विंटल</span>
                      <span className="text-[10px] text-red-600 block">महिन्द्रा पिकअप (45 किमी)</span>
                    </div>
                    <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                      <span className="text-red-700 block">(-) दलाली / आढ़त (2%):</span>
                      <span className="font-bold text-red-900 text-sm">-₹55 /क्विंटल</span>
                      <span className="text-[10px] text-red-600 block">सरकारी नियमित एपीएमसी</span>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                      <span className="text-emerald-800 block">(=) शुद्ध हाथ में भाव (Net):</span>
                      <span className="font-black text-[#2e7d32] text-sm">₹{lot.targetPrice - 165} /क्विंटल</span>
                      <span className="text-[10px] text-emerald-700 block">असली रोकड़ा जो मिलेगा</span>
                    </div>
                  </div>

                  {/* Actions inside drawer */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200">
                    <span className="text-xs text-gray-500">
                      क्या आप अन्य 3 मंडियों के साथ विस्तृत तुलना देखना चाहते हैं?
                    </span>
                    <div className="flex items-center gap-2">
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        <span>मंडी पर्ची बनाएं</span>
                      </button>

                      <button
                        onClick={() => navigate('/app/compare')}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#2e7d32] hover:bg-[#388e3c] text-white text-xs font-bold transition-colors shadow-sm"
                      >
                        <span>मंडी तुलना कैलकुलेटर खोलें</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Card Footer Bar */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-600">
                <button
                  onClick={() => toggleExpand(lot.id)}
                  className="flex items-center gap-1 font-bold text-[#2e7d32] hover:underline"
                >
                  <span>{isExpanded ? 'गणित छुपाएं' : 'यह क्या मानता है? (कटौती विवरण देखें)'}</span>
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                <button
                  onClick={() => navigate(`/app/crop/${lot.cropId}`)}
                  className="font-semibold text-gray-600 hover:text-gray-900 flex items-center gap-1"
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
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-[#14231b]">नई फसल स्टॉक जोड़ें</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewLot} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">फसल का प्रकार चुनें:</label>
                <select
                  value={newCropId}
                  onChange={(e) => setNewCropId(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-[#2e7d32] focus:outline-none"
                >
                  {CROPS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - वर्तमान भाव ₹{c.currentAvgModalPrice}/qtl
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">कुल मात्रा (क्विंटल):</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-[#2e7d32] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">खेत / गांव का स्थान:</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="उदा. डबरा, ग्वालियर"
                  className="w-full rounded-xl border border-gray-300 p-2.5 focus:border-[#2e7d32] focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-medium"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2e7d32] hover:bg-[#388e3c] text-white font-bold shadow-md"
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

import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Truck, 
  ShieldAlert, 
  CheckCircle2, 
  HelpCircle, 
  Volume2, 
  Sliders, 
  Info, 
  Sparkles,
  ArrowRight,
  Printer,
  ChevronDown,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  CROPS, 
  REGIONAL_MANDI_CLUSTERS, 
  TRANSPORT_MODES 
} from '../data/mandiData';
import { compareRegionalMandis } from '../services/arbitrageEngine';
import { bhasiniService } from '../services/bhasiniService';

export default function MandiCompare({ navigate, onGeneratePass }) {
  // State for selections
  const [selectedClusterKey, setSelectedClusterKey] = useState('gwalior_chambal');
  const [selectedCropId, setSelectedCropId] = useState('onion');
  const [quantityQtl, setQuantityQtl] = useState(40);
  const [selectedVehicleId, setSelectedVehicleId] = useState('pickup');
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(true);

  // Custom overrides for individual mandis (distance, broker %)
  const [mandiOverrides, setMandiOverrides] = useState({});

  const cluster = REGIONAL_MANDI_CLUSTERS[selectedClusterKey] || REGIONAL_MANDI_CLUSTERS.gwalior_chambal;
  const currentCrop = CROPS.find(c => c.id === selectedCropId) || CROPS[0];
  const currentVehicle = TRANSPORT_MODES.find(v => v.id === selectedVehicleId) || TRANSPORT_MODES[0];

  // Perform Net Profit Arbitrage Calculation across 4 Mandis
  const comparisonResults = useMemo(() => {
    return compareRegionalMandis({
      clusterMandis: cluster.mandis,
      cropId: selectedCropId,
      quantityQtl: Number(quantityQtl),
      vehicleId: selectedVehicleId,
      customOverrides: mandiOverrides
    });
  }, [cluster, selectedCropId, quantityQtl, selectedVehicleId, mandiOverrides]);

  const {
    rankedMandis,
    bestMandi,
    localMandi,
    hasPriceIllusionTrap,
    trapDetails,
    localComparisonGainPerQtl,
    localComparisonTotalGain
  } = comparisonResults;

  const handleUpdateOverride = (mandiId, field, value) => {
    setMandiOverrides(prev => ({
      ...prev,
      [mandiId]: {
        ...prev[mandiId],
        [field]: Number(value)
      }
    }));
  };

  const handleResetOverrides = () => {
    setMandiOverrides({});
  };

  const handleSpeakComparison = () => {
    let text = `किसान भाई, 4 मंडियों के विश्लेषण के अनुसार, आपके लिए सबसे अधिक शुद्ध मुनाफ़ा ${bestMandi.mandiName} में मिलेगा। यहां भाड़ा, दलाली और तुलाई काटकर आपके हाथ में प्रति क्विंटल ₹${bestMandi.netRatePerQtl} का असली शुद्ध पैसा आएगा।`;
    if (hasPriceIllusionTrap && trapDetails) {
      text += ` सावधान रहें! ${trapDetails.trapMandiName} में घोषित भाव अधिक दिख रहा है, लेकिन भारी भाड़े और दलाली के कारण आपको उल्टे प्रति क्विंटल ₹${trapDetails.netLossPerQtl} का नुकसान होगा!`;
    }
    bhasiniService.speak(text);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-[#1E2922] pb-24">
      
      {/* Top Header */}
      <div className="bg-[#14231b] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-[#2d6a4f]/30">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#e09f3e] bg-[#1b3528] px-2.5 py-0.5 rounded-full border border-[#e09f3e]/40">
                असली शुद्ध मुनाफ़ा इंजन (Net Profit Arbitrage)
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              3-4 मंडी लाइव तुलना — असली रोकड़ा किसमें?
            </h1>
            <p className="text-sm text-gray-300 mt-1 max-w-3xl">
              घोषित थोक भाव के धोखे से बचें। परिवहन दूरी, आढ़त/दलाली कमीशन और रास्ते की बर्बादी काटकर जानें कि कौन सी मंडी सबसे फायदेमंद है।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSpeakComparison}
              className="inline-flex items-center gap-2 rounded-xl bg-[#e09f3e] hover:bg-[#d97706] text-[#14231b] px-4 py-2.5 text-sm font-bold shadow-md transition-all"
            >
              <Volume2 className="h-4 w-4" />
              <span>पूरी तुलना बोलकर सुनें</span>
            </button>
            <button
              onClick={handleResetOverrides}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1b3528] hover:bg-[#2d6a4f] text-gray-300 px-3 py-2.5 text-xs font-medium border border-[#2d6a4f]"
              title="डिफ़ॉल्ट सरकारी मान रीसेट करें"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>रीसेट</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-5 space-y-6">

        {/* Global Control Bar: Region, Crop, Quantity, Transport */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* 1. Region Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              1. क्षेत्र / मंडी क्लस्टर:
            </label>
            <select
              value={selectedClusterKey}
              onChange={(e) => {
                setSelectedClusterKey(e.target.value);
                setMandiOverrides({});
              }}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm font-bold text-gray-900 focus:border-[#2e7d32] focus:bg-white focus:outline-none"
            >
              <option value="gwalior_chambal">ग्वालियर - चंबल संभाग (4 मंडियां)</option>
              <option value="nashik_cluster">नासिक - महाराष्ट्र क्लस्टर (4 मंडियां)</option>
            </select>
            <span className="text-[11px] text-gray-500 mt-1 block">
              आधार केंद्र: {cluster.baseFarmerLocation}
            </span>
          </div>

          {/* 2. Crop Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              2. फसल का चुनाव करें:
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm font-bold text-gray-900 focus:border-[#2e7d32] focus:bg-white focus:outline-none"
            >
              {CROPS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-gray-500 mt-1 block">
              श्रेणी: {currentCrop.category}
            </span>
          </div>

          {/* 3. Harvest Quantity Slider */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                3. कुल उपज (क्विंटल):
              </label>
              <span className="text-sm font-black text-[#2e7d32] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {quantityQtl} क्विंटल
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              step="5"
              value={quantityQtl}
              onChange={(e) => setQuantityQtl(Number(e.target.value))}
              className="w-full accent-[#2e7d32] cursor-pointer mt-1"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
              <span>5 qtl</span>
              <span>50 qtl</span>
              <span>100 qtl</span>
              <span>200 qtl</span>
            </div>
          </div>

          {/* 4. Transport Mode */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              4. ढुलाई वाहन (Transport):
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm font-bold text-gray-900 focus:border-[#2e7d32] focus:bg-white focus:outline-none"
            >
              {TRANSPORT_MODES.map(v => (
                <option key={v.id} value={v.id}>
                  {v.icon} {v.name}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-gray-500 mt-1 block">
              दर: ₹{currentVehicle.ratePerKmPerQuintal}/किमी/qtl + आधार ₹{currentVehicle.baseRentRupees}
            </span>
          </div>

        </div>

        {/* The Star Feature Alert: Price Illusion Trap Warning (If detected) */}
        {hasPriceIllusionTrap && trapDetails && (
          <div className="rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-5 sm:p-6 shadow-xl border border-red-300 animate-fadeIn">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-2xl shrink-0">
                <AlertTriangle className="h-8 w-8 text-yellow-300" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider bg-yellow-300 text-red-950 px-2.5 py-0.5 rounded-full">
                    ⚠️ भ्रामक भाव जाल चेतावनी (Price Illusion Alert)
                  </span>
                  <span className="text-xs text-white/80 font-medium hidden sm:inline">
                    किसान को धोखे से बचाने वाली तकनीक
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {trapDetails.trapMandiName} में जाने से बचें! दिखने वाले अधिक भाव के पीछे भारी घाटा छिपा है।
                </h3>
                <p className="text-sm text-red-100 font-medium leading-relaxed">
                  {trapDetails.warningHindi}
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <div className="bg-white/10 px-3 py-1.5 rounded-lg text-xs font-bold">
                    घोषित भाव का अंतर: +₹{trapDetails.rawQuotedDifference}/क्विंटल (दिखने में ज्यादा)
                  </div>
                  <div className="bg-yellow-300 text-red-950 px-3 py-1.5 rounded-lg text-xs font-black">
                    वास्तविक शुद्ध घाटा: -₹{trapDetails.netLossPerQtl}/क्विंटल (कुल -₹{trapDetails.totalLostRupees.toLocaleString('en-IN')})
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* The Winner Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#14231b] via-[#1b3528] to-[#2e7d32] text-white p-5 sm:p-6 shadow-xl border border-[#e09f3e]/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e09f3e] text-[#14231b] text-2xl font-black shadow-lg shrink-0">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#e09f3e]">
                  सर्वश्रेष्ठ अनुशंसित मंडी (Best Net Winner)
                </span>
                <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full">
                  रैंक #1
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                {bestMandi.mandiName}
              </h2>
              <p className="text-xs sm:text-sm text-gray-200 mt-1">
                सभी खर्चे (भाड़ा, {bestMandi.brokerPercent}% दलाली, तुलाई) घटाने के बाद शुद्ध हाथ में आएंगे: 
                <strong className="text-[#e09f3e] ml-1 text-base">₹{bestMandi.netRatePerQtl} /क्विंटल</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <span className="text-xs text-gray-300 block">कुल {quantityQtl} क्विंटल पर शुद्ध कमाई:</span>
              <span className="text-2xl sm:text-3xl font-black text-[#e09f3e]">
                ₹{bestMandi.netInHandTotal.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => {
                triggerConfetti();
                onGeneratePass({
                  cropName: currentCrop.name,
                  quantityQtl: quantityQtl,
                  mandiName: bestMandi.mandiName,
                  district: bestMandi.district,
                  vehicleName: currentVehicle.name,
                  rawQuotedPrice: bestMandi.rawQuotedPrice,
                  transportPerQtl: bestMandi.transportPerQtl,
                  brokerPerQtl: bestMandi.brokerPerQtl,
                  brokerPercent: bestMandi.brokerPercent,
                  handlingPerQtl: bestMandi.handlingPerQtl,
                  decayLossPerQtl: bestMandi.decayLossPerQtl,
                  netRatePerQtl: bestMandi.netRatePerQtl,
                  netInHandTotal: bestMandi.netInHandTotal,
                  distanceKm: bestMandi.distanceKm
                });
              }}
              className="flex items-center gap-2 rounded-xl bg-[#e09f3e] hover:bg-[#d97706] text-[#14231b] font-black px-4 py-3 text-sm shadow-md transition-transform hover:scale-105"
            >
              <Printer className="h-4 w-4" />
              <span>गेट पास बनाएं</span>
            </button>
          </div>
        </div>

        {/* 4 MANDIS SIDE-BY-SIDE RESPONSIVE COMPARISON GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {rankedMandis.map((mandi, index) => {
            const isWinner = mandi.mandiId === bestMandi.mandiId;
            const isTrap = hasPriceIllusionTrap && mandi.mandiId === trapDetails?.trapMandiName;
            const diffWithWinner = bestMandi.netRatePerQtl - mandi.netRatePerQtl;
            const totalLostComparedToWinner = diffWithWinner * quantityQtl;

            return (
              <div
                key={mandi.mandiId}
                className={`relative rounded-2xl bg-white border flex flex-col justify-between transition-all overflow-hidden ${
                  isWinner 
                    ? 'border-2 border-[#2e7d32] shadow-2xl ring-4 ring-emerald-500/20' 
                    : isTrap
                    ? 'border-2 border-red-500 shadow-xl'
                    : 'border-gray-200 shadow-md hover:shadow-lg'
                }`}
              >
                
                {/* Mandi Card Top Ribbon */}
                <div className={`p-4 border-b ${
                  isWinner 
                    ? 'bg-[#2e7d32] text-white' 
                    : isTrap
                    ? 'bg-red-700 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider">
                      रैंक #{index + 1} {isWinner ? '🏆 सर्वोत्तम' : isTrap ? '⚠️ भ्रामक भाव' : ''}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isWinner ? 'bg-[#e09f3e] text-[#14231b]' : 'bg-white/20 text-current'
                    }`}>
                      {mandi.isLocal ? 'स्थानीय यार्ड' : `${mandi.distanceKm} किमी दूर`}
                    </span>
                  </div>
                  <h3 className="font-black text-lg mt-1 line-clamp-1">
                    {mandi.mandiName}
                  </h3>
                  <div className="text-xs opacity-90 mt-0.5">
                    {mandi.district}, {mandi.state}
                  </div>
                </div>

                {/* Mandi Numbers Body */}
                <div className="p-4 sm:p-5 space-y-4 flex-1">
                  
                  {/* Highlight: Net In-Hand Rate */}
                  <div className={`p-4 rounded-xl text-center border ${
                    isWinner 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : isTrap
                      ? 'bg-red-50 border-red-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}>
                    <span className="text-[11px] font-bold text-gray-500 uppercase block">
                      शुद्ध हाथ में आने वाला भाव (Net Rate)
                    </span>
                    <div className={`text-2xl sm:text-3xl font-black mt-1 ${
                      isWinner ? 'text-[#2e7d32]' : isTrap ? 'text-red-700' : 'text-gray-900'
                    }`}>
                      ₹{mandi.netRatePerQtl}
                      <span className="text-xs font-medium text-gray-500"> /क्विंटल</span>
                    </div>

                    <div className="text-xs font-bold text-gray-700 mt-1">
                      कुल उपज पर: ₹{mandi.netInHandTotal.toLocaleString('en-IN')}
                    </div>

                    {!isWinner && (
                      <span className="inline-block mt-2 text-[11px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded">
                        -₹{diffWithWinner}/qtl (कुल -₹{totalLostComparedToWinner.toLocaleString('en-IN')} घाटा)
                      </span>
                    )}
                  </div>

                  {/* Quoted Price vs Net Price Visual Bar */}
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>मंडी में घोषित भाव:</span>
                      <span className="font-bold text-gray-900">₹{mandi.rawQuotedPrice} /qtl</span>
                    </div>
                    <div className="flex justify-between text-red-600 font-semibold">
                      <span>कुल कटौतियां (खर्च):</span>
                      <span>-₹{mandi.totalDeductions / mandi.quantityQtl | 0} /qtl ({mandi.deductionPercentage}%)</span>
                    </div>

                    {/* Visual Bar Percentage Breakdown */}
                    <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex mt-1">
                      <div 
                        style={{ width: `${100 - mandi.deductionPercentage}%` }} 
                        className={`h-full ${isWinner ? 'bg-[#2e7d32]' : 'bg-gray-600'}`} 
                        title={`शुद्ध पैसा: ${100 - mandi.deductionPercentage}%`}
                      />
                      <div 
                        style={{ width: `${mandi.deductionPercentage}%` }} 
                        className="h-full bg-red-400" 
                        title={`कटौतियां: ${mandi.deductionPercentage}%`}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400">
                      <span>शुद्ध पैसा ({100 - mandi.deductionPercentage}%)</span>
                      <span className="text-red-500">कटौती ({mandi.deductionPercentage}%)</span>
                    </div>
                  </div>

                  {/* Interactive Sliders for Custom Adjustments */}
                  <div className="pt-2 border-t border-gray-100 space-y-3 text-xs">
                    <div className="font-bold text-gray-700 flex items-center justify-between">
                      <span>पैरामीटर बदलें (Adjust):</span>
                      <Sliders className="h-3.5 w-3.5 text-gray-400" />
                    </div>

                    {/* Distance Slider */}
                    <div>
                      <div className="flex justify-between text-gray-600 mb-1">
                        <span>दूरी:</span>
                        <span className="font-bold text-gray-900">{mandi.distanceKm} किमी</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="250"
                        step="5"
                        value={mandi.distanceKm}
                        onChange={(e) => handleUpdateOverride(mandi.mandiId, 'distanceKm', e.target.value)}
                        className="w-full accent-[#2e7d32] h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                      />
                    </div>

                    {/* Broker Commission Slider */}
                    <div>
                      <div className="flex justify-between text-gray-600 mb-1">
                        <span>दलाली / आढ़त:</span>
                        <span className={`font-bold ${mandi.brokerPercent > 3 ? 'text-red-600' : 'text-emerald-700'}`}>
                          {mandi.brokerPercent}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="0.5"
                        value={mandi.brokerPercent}
                        onChange={(e) => handleUpdateOverride(mandi.mandiId, 'brokerPercent', e.target.value)}
                        className="w-full accent-[#e09f3e] h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Detailed Itemized Costs */}
                  {showDetailedBreakdown && (
                    <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-600 bg-gray-50/50 p-2.5 rounded-lg">
                      <div className="flex justify-between">
                        <span>गाड़ी भाड़ा:</span>
                        <span className="font-semibold text-gray-800">-₹{mandi.transportPerQtl} /qtl</span>
                      </div>
                      <div className="flex justify-between">
                        <span>दलाली कमीशन ({mandi.brokerPercent}%):</span>
                        <span className="font-semibold text-gray-800">-₹{mandi.brokerPerQtl} /qtl</span>
                      </div>
                      <div className="flex justify-between">
                        <span>तुलाई व पल्लेदारी:</span>
                        <span className="font-semibold text-gray-800">-₹{mandi.handlingPerQtl} /qtl</span>
                      </div>
                      {mandi.decayLossPerQtl > 0 && (
                        <div className="flex justify-between text-amber-800">
                          <span>रास्ते की सड़न/क्षति ({mandi.decayPercent}%):</span>
                          <span className="font-semibold">-₹{mandi.decayLossPerQtl} /qtl</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-1 border-t text-[11px] text-gray-500">
                        <span>भुगतान:</span>
                        <span className="font-medium text-gray-700">{mandi.paymentMode}</span>
                      </div>
                    </div>
                  )}

                </div>

                {/* Mandi Card Bottom Action */}
                <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <button
                    onClick={() => {
                      onGeneratePass({
                        cropName: currentCrop.name,
                        quantityQtl: quantityQtl,
                        mandiName: mandi.mandiName,
                        district: mandi.district,
                        vehicleName: currentVehicle.name,
                        rawQuotedPrice: mandi.rawQuotedPrice,
                        transportPerQtl: mandi.transportPerQtl,
                        brokerPerQtl: mandi.brokerPerQtl,
                        brokerPercent: mandi.brokerPercent,
                        handlingPerQtl: mandi.handlingPerQtl,
                        decayLossPerQtl: mandi.decayLossPerQtl,
                        netRatePerQtl: mandi.netRatePerQtl,
                        netInHandTotal: mandi.netInHandTotal,
                        distanceKm: mandi.distanceKm
                      });
                    }}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      isWinner 
                        ? 'bg-[#2e7d32] hover:bg-[#388e3c] text-white shadow'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>ई-मंडी पर्ची बनाएं</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Informative Explanation of the Formula (Directly from Hackathon Slide) */}
        <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-[#2e7d32]">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-base text-[#14231b]">
                कृषिवाणी शुद्ध मुनाफ़ा सूत्र (Arbitrage Logic Specification)
              </h4>
              <p className="text-xs text-gray-500">
                Net Profit = Forecasted Mandi Price - (Transport Cost + Broker Commission + Crop Decay Loss + Handling)
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-xs text-gray-700 bg-gray-50 p-4 rounded-xl border">
            <div>
              <strong className="block text-gray-900 mb-1">1. परिवहन लागत (Transport):</strong>
              वाहन का आधार किराया + (किमी दूरी × दर प्रति किमी प्रति क्विंटल) + हमाली/लोडिंग खर्च।
            </div>
            <div>
              <strong className="block text-gray-900 mb-1">2. दलाली / आढ़त (Broker Commission):</strong>
              सरकारी नियमित मंडियों में केवल 1.5% से 2% आढ़त मान्य है, जबकि निजी बाजारों में बिचौलिए 5% से 7% तक काट लेते हैं।
            </div>
            <div>
              <strong className="block text-gray-900 mb-1">3. फसल बर्बादी (Transit & Decay):</strong>
              टमाटर, फल जैसी शीघ्र नष्ट होने वाली फसलों में 100 किमी सफर व मंडी जाम में 2-4% फसल वजन व चमक खो देती है।
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

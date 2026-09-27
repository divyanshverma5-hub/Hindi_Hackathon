import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Volume2, 
  Sliders, 
  Printer, 
  ChevronDown, 
  ChevronUp, 
  RotateCcw,
  ShieldAlert,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  CROPS, 
  REGIONAL_MANDI_CLUSTERS, 
  TRANSPORT_MODES 
} from '../data/mandiData';
import { compareRegionalMandis } from '../services/arbitrageEngine';
import { bhasiniService } from '../services/bhasiniService';

export default function MandiCompare({ onGeneratePass }) {
  const [selectedClusterKey, setSelectedClusterKey] = useState('gwalior_chambal');
  const [selectedCropId, setSelectedCropId] = useState('onion');
  const [quantityQtl, setQuantityQtl] = useState(40);
  const [selectedVehicleId, setSelectedVehicleId] = useState('pickup');
  const [showFormulaDrawer, setShowFormulaDrawer] = useState(false);

  // Custom overrides for individual mandis (distance, broker %)
  const [mandiOverrides, setMandiOverrides] = useState({});

  const cluster = REGIONAL_MANDI_CLUSTERS[selectedClusterKey] || REGIONAL_MANDI_CLUSTERS.gwalior_chambal;
  const currentCrop = CROPS.find(c => c.id === selectedCropId) || CROPS[0];
  const currentVehicle = TRANSPORT_MODES.find(v => v.id === selectedVehicleId) || TRANSPORT_MODES[0];

  // Compare 4 Mandis
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
    hasPriceIllusionTrap,
    trapDetails
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
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] pb-24 transition-colors">
      
      {/* Top Header */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-color)] bg-[var(--bg-header)]">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-main)]">
              मंडी तुलना — असली शुद्ध रोकड़ा
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
              दूरी, गाड़ी भाड़ा और दलाली काटकर जानें कि कौन सी मंडी सबसे फायदेमंद है।
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSpeakComparison}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#2e7d32] hover:bg-[#256629] text-white px-3.5 py-2 text-xs font-bold shadow-sm transition-all"
            >
              <Volume2 className="h-4 w-4" />
              <span>तुलना सुनें</span>
            </button>
            <button
              onClick={handleResetOverrides}
              className="inline-flex items-center gap-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] px-3 py-2 text-xs font-medium"
              title="रीसेट करें"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>रीसेट</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        {/* Global Control Bar: Region, Crop, Quantity, Transport */}
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. Region */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
              क्षेत्र:
            </label>
            <select
              value={selectedClusterKey}
              onChange={(e) => {
                setSelectedClusterKey(e.target.value);
                setMandiOverrides({});
              }}
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-xs sm:text-sm font-semibold text-[var(--text-main)] focus:border-[#2e7d32] focus:outline-none"
            >
              <option value="gwalior_chambal">ग्वालियर - चंबल संभाग (4 मंडियां)</option>
              <option value="nashik_cluster">नासिक - महाराष्ट्र क्लस्टर (4 मंडियां)</option>
            </select>
          </div>

          {/* 2. Crop */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
              फसल:
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-xs sm:text-sm font-semibold text-[var(--text-main)] focus:border-[#2e7d32] focus:outline-none"
            >
              {CROPS.map(c => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Quantity */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                उपज (क्विंटल):
              </label>
              <span className="text-xs font-bold text-[#2e7d32]">
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
          </div>

          {/* 4. Transport Mode */}
          <div>
            <label className="block text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider mb-1">
              वाहन:
            </label>
            <select
              value={selectedVehicleId}
              onChange={(e) => setSelectedVehicleId(e.target.value)}
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-3 py-2 text-xs sm:text-sm font-semibold text-[var(--text-main)] focus:border-[#2e7d32] focus:outline-none"
            >
              {TRANSPORT_MODES.map(v => (
                <option key={v.id} value={v.id}>
                  {v.icon} {v.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* 4 MANDI CARDS (No separate big banners) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rankedMandis.map((mandi) => {
            const isWinner = mandi.mandiId === bestMandi.mandiId;
            const isTrap = hasPriceIllusionTrap && mandi.mandiId === trapDetails?.trapMandiName;
            const diffWithWinner = bestMandi.netRatePerQtl - mandi.netRatePerQtl;

            return (
              <div
                key={mandi.mandiId}
                className={`relative rounded-2xl bg-[var(--bg-card)] border flex flex-col justify-between transition-all overflow-hidden ${
                  isWinner 
                    ? 'border-2 border-[#2e7d32] shadow-md ring-2 ring-emerald-500/20' 
                    : 'border-[var(--border-color)] shadow-sm hover:shadow'
                }`}
              >
                
                {/* Card Header */}
                <div className="p-4 border-b border-[var(--border-color)] bg-[var(--bg-card-subtle)] space-y-1">
                  <div className="flex items-center justify-between">
                    {/* Small Badge / Tag */}
                    {isWinner ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2e7d32] text-white">
                        ✓ सर्वश्रेष्ठ
                      </span>
                    ) : isTrap ? (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                        ⚠️ भ्रामक भाव (घाटा संभव)
                      </span>
                    ) : (
                      <span className="text-[10px] text-[var(--text-muted)] font-medium">
                        {mandi.isLocal ? 'स्थानीय मंडी' : `${mandi.distanceKm} किमी दूर`}
                      </span>
                    )}

                    <span className="text-[11px] text-[var(--text-muted)]">
                      {mandi.distanceKm} किमी
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-[var(--text-main)] line-clamp-1">
                    {mandi.mandiName}
                  </h3>
                  <div className="text-[11px] text-[var(--text-muted)]">
                    {mandi.district}, {mandi.state}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3 flex-1">
                  
                  {/* Big Net Rate Highlight */}
                  <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] text-center border border-[var(--border-color)]">
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase block">
                      शुद्ध हाथ में आने वाला भाव
                    </span>
                    <div className="text-2xl font-black text-[var(--text-main)] mt-0.5">
                      ₹{mandi.netRatePerQtl}
                      <span className="text-xs font-normal text-[var(--text-muted)]"> /क्विंटल</span>
                    </div>

                    <div className="text-xs font-bold text-[#d97706] mt-0.5">
                      कुल कमाई: ₹{mandi.netInHandTotal.toLocaleString('en-IN')}
                    </div>

                    {!isWinner && (
                      <span className="inline-block mt-1.5 text-[10px] font-semibold text-red-600 bg-red-50 dark:bg-red-950/40 px-1.5 py-0.2 rounded">
                        -₹{diffWithWinner}/qtl कम
                      </span>
                    )}
                  </div>

                  {/* Quoted Rate & Itemized Deductions */}
                  <div className="space-y-1.5 text-xs text-[var(--text-muted)]">
                    <div className="flex justify-between text-[var(--text-main)]">
                      <span>घोषित थोक भाव:</span>
                      <span className="font-bold">₹{mandi.rawQuotedPrice} /qtl</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>(-) गाड़ी भाड़ा:</span>
                      <span>-₹{mandi.transportPerQtl} /qtl</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>(-) दलाली ({mandi.brokerPercent}%):</span>
                      <span>-₹{mandi.brokerPerQtl} /qtl</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>(-) तुलाई व पल्लेदारी:</span>
                      <span>-₹{mandi.handlingPerQtl} /qtl</span>
                    </div>
                    {mandi.decayLossPerQtl > 0 && (
                      <div className="flex justify-between text-amber-700">
                        <span>(-) सड़न दर ({mandi.decayPercent}%):</span>
                        <span>-₹{mandi.decayLossPerQtl} /qtl</span>
                      </div>
                    )}
                  </div>

                  {/* Sliders for Distance & Broker */}
                  <div className="pt-2 border-t border-[var(--border-color)] space-y-2 text-xs">
                    <div>
                      <div className="flex justify-between text-[var(--text-muted)] mb-0.5">
                        <span>दूरी:</span>
                        <span className="font-bold text-[var(--text-main)]">{mandi.distanceKm} किमी</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="250"
                        step="5"
                        value={mandi.distanceKm}
                        onChange={(e) => handleUpdateOverride(mandi.mandiId, 'distanceKm', e.target.value)}
                        className="w-full accent-[#2e7d32] h-1 bg-gray-200 dark:bg-gray-700 rounded cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[var(--text-muted)] mb-0.5">
                        <span>दलाली:</span>
                        <span className="font-bold text-[var(--text-main)]">{mandi.brokerPercent}%</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="8"
                        step="0.5"
                        value={mandi.brokerPercent}
                        onChange={(e) => handleUpdateOverride(mandi.mandiId, 'brokerPercent', e.target.value)}
                        className="w-full accent-amber-500 h-1 bg-gray-200 dark:bg-gray-700 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                </div>

                {/* Bottom Button */}
                <div className="p-3 bg-[var(--bg-card-subtle)] border-t border-[var(--border-color)]">
                  <button
                    onClick={() => {
                      if (isWinner) triggerConfetti();
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
                        ? 'bg-[#2e7d32] hover:bg-[#256629] text-white shadow-sm' 
                        : 'border border-[var(--border-color)] bg-[var(--bg-card)] hover:bg-[var(--bg-card-subtle)] text-[var(--text-main)]'
                    }`}
                  >
                    <Printer className="h-3.5 w-3.5" />
                    <span>ई-मंडी पर्ची</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Expandable Explanation Drawer */}
        <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-4 sm:p-5 shadow-sm space-y-3">
          <button
            onClick={() => setShowFormulaDrawer(!showFormulaDrawer)}
            className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-[var(--text-main)] focus:outline-none"
          >
            <span className="flex items-center gap-2">
              <Info className="h-4 w-4 text-[#2e7d32]" />
              <span>विस्तृत गणना सूत्र व भ्रामक भाव विश्लेषण देखें</span>
            </span>
            {showFormulaDrawer ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          {showFormulaDrawer && (
            <div className="pt-3 border-t border-[var(--border-color)] space-y-3 text-xs text-[var(--text-muted)] animate-fadeIn">
              <div className="p-3 rounded-xl bg-[var(--bg-card-subtle)] text-[var(--text-main)] font-mono text-center font-bold">
                शुद्ध मुनाफ़ा = मंडी भाव - (परिवहन भाड़ा + दलाल कमीशन + फसल सड़न दर + तुलाई/उपकर)
              </div>

              {hasPriceIllusionTrap && trapDetails && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <ShieldAlert className="h-4 w-4 text-[#d97706]" />
                    <span>भ्रामक भाव की चेतावनी:</span>
                  </div>
                  <p>{trapDetails.warningHindi}</p>
                </div>
              )}

              <div className="grid sm:grid-cols-3 gap-3 text-[11px] text-[var(--text-muted)]">
                <div>
                  <strong className="text-[var(--text-main)] block mb-0.5">1. परिवहन भाड़ा:</strong>
                  वाहन का आधार किराया + (किमी दूरी × दर प्रति किमी प्रति क्विंटल) + हमाली।
                </div>
                <div>
                  <strong className="text-[var(--text-main)] block mb-0.5">2. दलाली कमीशन:</strong>
                  नियमित मंडियों में 1.5% से 2% वैध आढ़त, जबकि दूर के निजी बाजारों में 5% से 6% कटता है।
                </div>
                <div>
                  <strong className="text-[var(--text-main)] block mb-0.5">3. फसल सड़न दर:</strong>
                  टमाटर या प्याज जैसी फसलों में लंबी दूरी व जाम में 2-4% वजन व गुणवत्ता घटती है।
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}

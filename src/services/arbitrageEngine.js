// कृषिवाणी (KrishiVaani) - Net Profit Arbitrage & Mandi Deduction Engine
// Based on SIH & Hindi Hackathon Technical Approach:
// Net Profit = Forecasted Mandi Price - (Transport Cost + Broker Commission + Crop Decay Loss + Handling/Cess)

import { TRANSPORT_MODES, CROPS } from '../data/mandiData';

/**
 * Calculate detailed cost breakdown and net profit for a single Mandi
 * @param {Object} mandi - Mandi details
 * @param {string} cropId - Crop identifier
 * @param {number} quantityQtl - Quantity in quintals
 * @param {string} vehicleId - Selected transport vehicle
 * @param {number} customBrokerPercent - Optional override for broker %
 * @param {number} customDistanceKm - Optional override for distance
 */
export function calculateMandiNetProfit({
  mandi,
  cropId,
  quantityQtl = 40,
  vehicleId = 'pickup',
  customBrokerPercent = null,
  customDistanceKm = null
}) {
  const crop = CROPS.find(c => c.id === cropId) || CROPS[0];
  const vehicle = TRANSPORT_MODES.find(v => v.id === vehicleId) || TRANSPORT_MODES[0];

  const distance = customDistanceKm !== null ? Number(customDistanceKm) : mandi.distanceKm;
  const rawPricePerQtl = mandi.prices[cropId] || crop.currentAvgModalPrice;
  const brokerPercent = customBrokerPercent !== null ? Number(customBrokerPercent) : mandi.brokerCommissionPercent;
  const handlingPerQtl = mandi.handlingFeePerQtl || 20;

  // 1. Spoilage & Transit Decay Calculation
  // Highly perishable crops (Tomato) lose more value during longer transit & queue wait
  let decayRate = 0;
  if (crop.transportSensitivity === 'high') {
    decayRate = (distance * 0.02) + (mandi.congestionWaitHours * 0.4); // e.g. 100km + 5h wait = ~4% decay
  } else if (crop.transportSensitivity === 'medium') {
    decayRate = (distance * 0.006) + (mandi.congestionWaitHours * 0.15); // e.g. 100km = ~0.6%
  } else {
    decayRate = 0.02; // Grains / Mustard negligible
  }
  decayRate = Math.min(decayRate, 12); // cap at 12% max

  const effectiveSellableQuantity = quantityQtl * (1 - decayRate / 100);
  const decayLossRupeesTotal = (quantityQtl - effectiveSellableQuantity) * rawPricePerQtl;
  const decayLossPerQtl = decayLossRupeesTotal / quantityQtl;

  // 2. Transport Freight Calculation
  // Vehicle base rent + (rate per km per qtl * km * qtl) + loading/unloading
  const transportMileageCost = vehicle.ratePerKmPerQuintal * distance * quantityQtl;
  const loadingUnloadingTotal = vehicle.loadingUnloadingPerQtl * quantityQtl;
  const totalTransportCost = vehicle.baseRentRupees + transportMileageCost + loadingUnloadingTotal;
  const transportPerQtl = totalTransportCost / quantityQtl;

  // 3. Gross Realized Value
  const grossTotal = effectiveSellableQuantity * rawPricePerQtl;
  const grossPerQtlQuoted = rawPricePerQtl;

  // 4. Middleman / Broker Commission (दलाली / आढ़त)
  const totalBrokerCommission = (grossTotal * brokerPercent) / 100;
  const brokerPerQtl = totalBrokerCommission / quantityQtl;

  // 5. APMC Handling / Mandi Cess / Weighment (तुलाई व पल्लेदारी)
  const totalHandlingFee = handlingPerQtl * quantityQtl;

  // 6. Net In-Hand Profit
  const totalDeductions = totalTransportCost + totalBrokerCommission + decayLossRupeesTotal + totalHandlingFee;
  const netInHandTotal = grossTotal - totalTransportCost - totalBrokerCommission - totalHandlingFee;
  const netRatePerQtl = netInHandTotal / quantityQtl;

  return {
    mandiId: mandi.id,
    mandiName: mandi.name,
    district: mandi.district,
    state: mandi.state,
    distanceKm: distance,
    isLocal: mandi.isLocal,
    apmcRegulated: mandi.apmcRegulated,
    congestionWaitHours: mandi.congestionWaitHours,
    paymentMode: mandi.paymentMode,
    
    // Per Quintal Figures (₹/क्विंटल)
    rawQuotedPrice: Math.round(rawPricePerQtl),
    transportPerQtl: Math.round(transportPerQtl),
    brokerPerQtl: Math.round(brokerPerQtl),
    brokerPercent: Number(brokerPercent.toFixed(1)),
    decayLossPerQtl: Math.round(decayLossPerQtl),
    decayPercent: Number(decayRate.toFixed(1)),
    handlingPerQtl: Math.round(handlingPerQtl),
    netRatePerQtl: Math.round(netRatePerQtl),

    // Total Harvest Figures (₹ कुल राशि)
    quantityQtl,
    grossHarvestValue: Math.round(quantityQtl * rawPricePerQtl),
    totalTransportCost: Math.round(totalTransportCost),
    totalBrokerCommission: Math.round(totalBrokerCommission),
    decayLossRupeesTotal: Math.round(decayLossRupeesTotal),
    totalHandlingFee: Math.round(totalHandlingFee),
    totalDeductions: Math.round(totalDeductions),
    netInHandTotal: Math.round(netInHandTotal),

    // Deduction Percentage of Gross
    deductionPercentage: Math.round((totalDeductions / (quantityQtl * rawPricePerQtl)) * 100)
  };
}

/**
 * Compare 3-4 Mandis simultaneously, rank them, and detect Price Illusion Traps
 */
export function compareRegionalMandis({
  clusterMandis,
  cropId,
  quantityQtl = 40,
  vehicleId = 'pickup',
  customOverrides = {}
}) {
  const crop = CROPS.find(c => c.id === cropId) || CROPS[0];

  const results = clusterMandis.map(mandi => {
    const override = customOverrides[mandi.id] || {};
    return calculateMandiNetProfit({
      mandi,
      cropId,
      quantityQtl,
      vehicleId,
      customBrokerPercent: override.brokerPercent ?? null,
      customDistanceKm: override.distanceKm ?? null
    });
  });

  // Sort by highest Net In-Hand Rate
  results.sort((a, b) => b.netRatePerQtl - a.netRatePerQtl);

  const bestMandi = results[0];
  const localMandi = results.find(m => m.isLocal) || results[results.length - 1];

  // Identify "भ्रामक भाव (Price Illusion Trap)":
  // When a mandi quotes highest raw price, but results in lower net profit due to distance or broker cut!
  let highestQuotedMandi = results[0];
  results.forEach(m => {
    if (m.rawQuotedPrice > highestQuotedMandi.rawQuotedPrice) {
      highestQuotedMandi = m;
    }
  });

  const hasPriceIllusionTrap = highestQuotedMandi.mandiId !== bestMandi.mandiId;
  let trapDetails = null;

  if (hasPriceIllusionTrap) {
    const rawGain = highestQuotedMandi.rawQuotedPrice - bestMandi.rawQuotedPrice;
    const netLossPerQtl = bestMandi.netRatePerQtl - highestQuotedMandi.netRatePerQtl;
    const totalLostRupees = netLossPerQtl * quantityQtl;

    trapDetails = {
      trapMandiName: highestQuotedMandi.mandiName,
      winnerMandiName: bestMandi.mandiName,
      rawQuotedDifference: rawGain,
      netLossPerQtl: netLossPerQtl,
      totalLostRupees: totalLostRupees,
      warningHindi: `⚠️ भ्रामक भाव से बचें! ${highestQuotedMandi.mandiName} में घोषित भाव ₹${rawGain} अधिक दिख रहा है, लेकिन अधिक दूरी (${highestQuotedMandi.distanceKm} किमी) और ${highestQuotedMandi.brokerPercent}% दलाली के कारण आपको प्रति क्विंटल ₹${netLossPerQtl} (कुल ₹${totalLostRupees.toLocaleString('en-IN')}) का भारी घाटा होगा!`
    };
  }

  // Calculate advantage compared to nearest/local mandi
  const localComparisonGainPerQtl = bestMandi.netRatePerQtl - localMandi.netRatePerQtl;
  const localComparisonTotalGain = localComparisonGainPerQtl * quantityQtl;

  return {
    crop,
    quantityQtl,
    vehicleId,
    rankedMandis: results,
    bestMandi,
    localMandi,
    hasPriceIllusionTrap,
    trapDetails,
    localComparisonGainPerQtl,
    localComparisonTotalGain
  };
}

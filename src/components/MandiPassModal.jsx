import React from 'react';
import { Printer, X, Download, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';

export default function MandiPassModal({ isOpen, onClose, passData }) {
  if (!isOpen || !passData) return null;

  const handlePrint = () => {
    window.print();
  };

  const passNumber = `KV-${Math.floor(100000 + Math.random() * 900000)}`;
  const todayDateStr = new Date().toLocaleDateString('hi-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white text-gray-900 shadow-2xl overflow-hidden my-8">
        
        {/* Actions Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#14231b] text-white no-print">
          <span className="text-sm font-semibold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#e09f3e]" />
            कृषिवाणी ई-मंडी गेट पास व लाभ रसीद
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2e7d32] hover:bg-[#388e3c] text-white text-xs font-bold transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>प्रिंट / PDF सेव करें</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Pass Body */}
        <div className="p-6 sm:p-8 space-y-6 border-4 border-double border-[#2e7d32]/30 m-3 rounded-xl bg-[#fffefc]">
          
          {/* Slip Header */}
          <div className="text-center border-b pb-4 border-dashed border-gray-300">
            <div className="inline-block px-3 py-1 bg-[#2e7d32] text-white text-xs font-bold rounded-full mb-1">
              Agmarknet व eNAM डिजिटल मंडी सहायक
            </div>
            <h2 className="text-2xl font-black text-[#14231b] tracking-tight">कृषिवाणी — फसल विक्रय व शुद्ध मुनाफ़ा पर्ची</h2>
            <p className="text-xs text-gray-500 font-medium">राष्ट्रीय कृषि ई-बाजार एवं भाषिणी AI सत्यापित प्राक्कलन</p>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border">
              <span>पर्ची क्रमांक: <strong>{passNumber}</strong></span>
              <span>जारी दिनांक: <strong>{todayDateStr}</strong></span>
            </div>
          </div>

          {/* Farmer & Lot Meta Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div>
              <span className="text-gray-500 block">किसान का नाम:</span>
              <span className="font-bold text-gray-900 text-sm">{passData.farmerName || 'रामसेवक शर्मा (किसान)'}</span>
            </div>
            <div>
              <span className="text-gray-500 block">स्थान / जिला:</span>
              <span className="font-bold text-gray-900 text-sm">{passData.district || 'ग्वालियर / मुरार (मध्य प्रदेश)'}</span>
            </div>
            <div>
              <span className="text-gray-500 block">फसल व किस्म:</span>
              <span className="font-bold text-[#2e7d32] text-sm">{passData.cropName || 'प्याज (लाल नासिक)'}</span>
            </div>
            <div>
              <span className="text-gray-500 block">कुल मात्रा (बोरी/क्विंटल):</span>
              <span className="font-bold text-gray-900 text-sm">{passData.quantityQtl || 40} क्विंटल</span>
            </div>
            <div>
              <span className="text-gray-500 block">चयनित गंतव्य मंडी:</span>
              <span className="font-bold text-[#14231b] text-sm">{passData.mandiName}</span>
            </div>
            <div>
              <span className="text-gray-500 block">परिवहन वाहन:</span>
              <span className="font-bold text-gray-900 text-sm">{passData.vehicleName || 'महिन्द्रा पिकअप (छोटा हाथी)'}</span>
            </div>
          </div>

          {/* Transparent Profit Math Table */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="bg-[#2e7d32]/10 px-4 py-2 border-b border-gray-200 font-bold text-xs text-[#14231b] flex justify-between">
              <span>मद / विवरण (Cost Deductions)</span>
              <span>प्रति क्विंटल / कुल राशि</span>
            </div>
            <div className="divide-y divide-gray-100 text-xs text-gray-700">
              <div className="flex justify-between px-4 py-2">
                <span>मंडी का घोषित औसत भाव:</span>
                <span className="font-semibold text-gray-900">₹{passData.rawQuotedPrice} /क्विंटल</span>
              </div>
              <div className="flex justify-between px-4 py-2 bg-red-50/50 text-red-700">
                <span>(-) अनुमानित परिवहन भाड़ा ({passData.distanceKm} किमी):</span>
                <span>-₹{passData.transportPerQtl} /क्विंटल (कुल -₹{passData.totalTransportCost?.toLocaleString('en-IN')})</span>
              </div>
              <div className="flex justify-between px-4 py-2 bg-red-50/50 text-red-700">
                <span>(-) आढ़त / दलाली कमीशन ({passData.brokerPercent}%):</span>
                <span>-₹{passData.brokerPerQtl} /क्विंटल (कुल -₹{passData.totalBrokerCommission?.toLocaleString('en-IN')})</span>
              </div>
              <div className="flex justify-between px-4 py-2 bg-red-50/50 text-red-700">
                <span>(-) तुलाई, पल्लेदारी व मंडी शुल्क:</span>
                <span>-₹{passData.handlingPerQtl} /क्विंटल</span>
              </div>
              {passData.decayLossPerQtl > 0 && (
                <div className="flex justify-between px-4 py-2 bg-amber-50/50 text-amber-800">
                  <span>(-) रास्ते की फसल बर्बादी व नमी कमी ({passData.decayPercent}%):</span>
                  <span>-₹{passData.decayLossPerQtl} /क्विंटल</span>
                </div>
              )}
              <div className="flex justify-between px-4 py-3 bg-[#2e7d32] text-white font-extrabold text-sm sm:text-base">
                <span>किसान के हाथ में शुद्ध लाभ (Net Realized):</span>
                <span>₹{passData.netRatePerQtl} /क्विंटल</span>
              </div>
            </div>
          </div>

          {/* Grand Total Net Earnings Highlight */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#e09f3e]/20 to-[#2e7d32]/20 border border-[#2e7d32]/30">
            <div>
              <span className="text-xs text-gray-600 font-semibold block">कुल फसल पर अपेक्षित शुद्ध भुगतान:</span>
              <span className="text-2xl font-black text-[#14231b]">
                ₹{passData.netInHandTotal?.toLocaleString('en-IN')}
              </span>
            </div>
            
            {/* Mock QR Verification */}
            <div className="flex items-center gap-2 border-l pl-4 border-gray-300 text-center">
              <div className="h-14 w-14 bg-white border border-gray-300 rounded flex items-center justify-center p-1">
                <QrCode className="h-12 w-12 text-gray-800" />
              </div>
              <span className="text-[10px] text-gray-500 font-mono leading-tight block text-left">
                eNAM Gate<br />Verified QR
              </span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-[11px] text-gray-500 text-center border-t pt-3">
            यह पर्ची कृषिवाणी AI निर्णय मॉडल द्वारा Agmarknet डेटा पर आधारित है। मंडी में प्रवेश पर इसे दिखाएं।
          </div>

        </div>

      </div>
    </div>
  );
}

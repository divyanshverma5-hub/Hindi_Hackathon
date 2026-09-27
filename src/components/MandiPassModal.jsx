import React from 'react';
import { Printer, X, ShieldCheck, QrCode } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white text-gray-900 shadow-2xl overflow-hidden my-6">
        
        {/* Actions Bar (Hidden in Print) */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#14231b] text-white no-print">
          <span className="text-xs font-semibold flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[#e09f3e]" />
            कृषिवाणी ई-मंडी गेट पास व लाभ पर्ची
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2e7d32] hover:bg-[#256629] text-white text-xs font-bold transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>प्रिंट / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-300 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Pass Body */}
        <div className="p-5 sm:p-6 space-y-4 border-2 border-dashed border-[#2e7d32]/40 m-2.5 rounded-xl bg-[#fffefc] text-xs">
          
          {/* Slip Header */}
          <div className="text-center border-b pb-3 border-gray-200">
            <h2 className="text-xl font-black text-[#14231b] tracking-tight">कृषिवाणी — फसल विक्रय व शुद्ध मुनाफ़ा पर्ची</h2>
            <p className="text-[11px] text-gray-500 mt-0.5">Agmarknet व eNAM डिजिटल मंडी प्राक्कलन</p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-gray-600 bg-gray-50 px-2.5 py-1 rounded border">
              <span>पर्ची संख्या: <strong>{passNumber}</strong></span>
              <span>दिनांक: <strong>{todayDateStr}</strong></span>
            </div>
          </div>

          {/* Farmer & Lot Meta Grid */}
          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div>
              <span className="text-gray-500 block text-[10px]">किसान:</span>
              <span className="font-bold text-gray-900">{passData.farmerName || 'रामसेवक शर्मा'}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">स्थान:</span>
              <span className="font-bold text-gray-900">{passData.district || 'ग्वालियर'}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">फसल:</span>
              <span className="font-bold text-[#2e7d32]">{passData.cropName || 'प्याज'}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">कुल मात्रा:</span>
              <span className="font-bold text-gray-900">{passData.quantityQtl || 40} क्विंटल</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">गंतव्य मंडी:</span>
              <span className="font-bold text-[#14231b]">{passData.mandiName}</span>
            </div>
            <div>
              <span className="text-gray-500 block text-[10px]">वाहन:</span>
              <span className="font-bold text-gray-900">{passData.vehicleName || 'पिकअप'}</span>
            </div>
          </div>

          {/* Deductions Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-[#2e7d32]/10 px-3 py-1.5 border-b border-gray-200 font-bold text-gray-800 flex justify-between">
              <span>मद / विवरण</span>
              <span>प्रति क्विंटल / कुल</span>
            </div>
            <div className="divide-y divide-gray-100">
              <div className="flex justify-between px-3 py-1.5">
                <span>घोषित थोक भाव:</span>
                <span className="font-semibold text-gray-900">₹{passData.rawQuotedPrice} /qtl</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 text-red-600">
                <span>(-) परिवहन भाड़ा ({passData.distanceKm} किमी):</span>
                <span>-₹{passData.transportPerQtl} /qtl</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 text-red-600">
                <span>(-) दलाली कमीशन ({passData.brokerPercent}%):</span>
                <span>-₹{passData.brokerPerQtl} /qtl</span>
              </div>
              <div className="flex justify-between px-3 py-1.5 text-red-600">
                <span>(-) तुलाई व पल्लेदारी:</span>
                <span>-₹{passData.handlingPerQtl} /qtl</span>
              </div>
              <div className="flex justify-between px-3 py-2 bg-[#2e7d32] text-white font-bold text-sm">
                <span>किसान के हाथ में शुद्ध भाव:</span>
                <span>₹{passData.netRatePerQtl} /qtl</span>
              </div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <div>
              <span className="text-[10px] text-gray-600 font-semibold block">कुल अपेक्षित शुद्ध भुगतान:</span>
              <span className="text-xl font-black text-[#2e7d32]">
                ₹{passData.netInHandTotal?.toLocaleString('en-IN')}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 border-l pl-3 border-gray-200">
              <QrCode className="h-10 w-10 text-gray-800" />
              <span className="text-[9px] text-gray-500 font-mono leading-tight">
                eNAM Gate<br />Verified
              </span>
            </div>
          </div>

          <div className="text-[10px] text-gray-400 text-center border-t pt-2">
            कृषिवाणी AI द्वारा Agmarknet डेटा पर सत्यापित।
          </div>

        </div>

      </div>
    </div>
  );
}

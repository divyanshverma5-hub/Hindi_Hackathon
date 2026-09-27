import React, { useState } from 'react';
import { Layers, Plus, Calendar, MapPin, AlertCircle, ArrowRight, Trash2, Printer, Volume2 } from 'lucide-react';
import { INITIAL_HOLDINGS, CROPS } from '../data/mandiData';
import { bhasiniService } from '../services/bhasiniService';

export default function HoldingsPage({ navigate, onGeneratePass }) {
  const [lots, setLots] = useState(INITIAL_HOLDINGS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formCropId, setFormCropId] = useState('onion');
  const [formQty, setFormQty] = useState(40);
  const [formLocation, setFormLocation] = useState('ग्वालियर, मध्य प्रदेश');
  const [formStorage, setFormStorage] = useState('हवादार कमरा (Well Ventilated)');

  const handleDeleteLot = (id) => {
    setLots(lots.filter(l => l.id !== id));
  };

  const handleAddLot = (e) => {
    e.preventDefault();
    const crop = CROPS.find(c => c.id === formCropId) || CROPS[0];
    const newLot = {
      id: `lot-custom-${Date.now()}`,
      cropId: crop.id,
      cropName: crop.name,
      quantityQuintal: Number(formQty),
      storageDate: new Date().toISOString().split('T')[0],
      storageCondition: formStorage,
      location: formLocation,
      recommendedAction: crop.forecastDays > 0 ? 'HOLD' : 'MOVE',
      recommendedDays: crop.forecastDays,
      targetMandiId: crop.forecastBestMandi,
      targetMandiName: crop.forecastBestMandi,
      peakDateStr: crop.forecastDays > 0 ? `+${crop.forecastDays} दिन` : 'आज ही',
      currentLocalPrice: crop.currentAvgModalPrice,
      targetPrice: crop.forecastPeakPrice,
      gainPerQuintal: crop.gainPerQuintal,
      totalGain: crop.gainPerQuintal * Number(formQty),
      confidence: crop.confidence,
      statusTextHindi: crop.reasonHindi
    };

    setLots([...lots, newLot]);
    setIsModalOpen(false);
  };

  const totalQuintals = lots.reduce((acc, curr) => acc + curr.quantityQuintal, 0);
  const totalEstimatedValue = lots.reduce((acc, curr) => acc + (curr.targetPrice * curr.quantityQuintal), 0);
  const totalPotentialExtraGain = lots.reduce((acc, curr) => acc + curr.totalGain, 0);

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-[#1E2922] pb-24">
      
      {/* Header */}
      <div className="bg-[#14231b] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-[#2d6a4f]/30">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#e09f3e]">
                भंडारण व फसल स्टॉक (Farmer Inventory)
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              किसान की फसल होल्डिंग्स ({lots.length} लॉट)
            </h1>
            <p className="text-sm text-gray-300 mt-1">
              स्टॉक की उम्र, सड़न दर व आगामी सर्वोत्तम बिक्री समय का विश्लेषण।
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2e7d32] hover:bg-[#388e3c] text-white px-4 py-2.5 text-sm font-bold shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>नया लॉट जोड़ें</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 -mt-5 space-y-6">

        {/* Aggregate Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-md">
            <span className="text-xs font-bold text-gray-500 uppercase block">कुल भंडारित उपज</span>
            <div className="text-2xl font-black text-[#14231b] mt-1">{totalQuintals} क्विंटल</div>
            <span className="text-xs text-gray-500">विभिन्न गोदामों में सुरक्षित</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-md">
            <span className="text-xs font-bold text-gray-500 uppercase block">अपेक्षित सकल मूल्य</span>
            <div className="text-2xl font-black text-[#2e7d32] mt-1">₹{totalEstimatedValue.toLocaleString('en-IN')}</div>
            <span className="text-xs text-emerald-700 font-semibold">सर्वोत्तम मंडी भाव के अनुसार</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-md">
            <span className="text-xs font-bold text-gray-500 uppercase block">AI सलाह से अतिरिक्त लाभ</span>
            <div className="text-2xl font-black text-[#e09f3e] mt-1">+₹{totalPotentialExtraGain.toLocaleString('en-IN')}</div>
            <span className="text-xs text-amber-800 font-semibold">सही समय पर सही मंडी चुनकर</span>
          </div>
        </div>

        {/* Lots List */}
        <div className="space-y-4">
          {lots.map((lot) => {
            const crop = CROPS.find(c => c.id === lot.cropId) || CROPS[0];
            return (
              <div
                key={lot.id}
                className="rounded-2xl bg-white border border-gray-200 p-5 sm:p-6 shadow-md hover:shadow-lg transition-all space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                  <div className="flex items-center gap-3.5">
                    <span className="text-3xl">{crop.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-[#14231b]">{lot.cropName}</h3>
                        <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full border">
                          {lot.quantityQuintal} क्विंटल
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          भंडारित: {lot.storageDate}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {lot.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        bhasiniService.speak(lot.statusTextHindi);
                      }}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-[#2e7d32] hover:text-white transition-colors"
                      title="सलाह सुनें"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLot(lot.id)}
                      className="p-2 rounded-xl bg-gray-100 hover:bg-red-500 hover:text-white text-gray-500 transition-colors"
                      title="लॉट हटाएं"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-gray-50 border">
                    <span className="text-gray-500 block">भंडारण स्थिति:</span>
                    <span className="font-bold text-gray-800">{lot.storageCondition}</span>
                    <span className="text-[10px] text-gray-500 block mt-0.5">सड़न दर: {crop.decayRatePerDayPercent}% प्रति दिन</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-emerald-800 block font-semibold">AI अनुशंसित कार्रवाई:</span>
                    <span className="font-black text-[#2e7d32] text-sm">
                      {lot.recommendedAction === 'HOLD' ? `${lot.recommendedDays} दिन रोकें` : 'आज ही बेचें'}
                    </span>
                    <span className="text-[10px] text-emerald-700 block mt-0.5">गंतव्य: {lot.targetMandiName}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <span className="text-amber-800 block font-semibold">अपेक्षित शुद्ध लाभ:</span>
                    <span className="font-black text-[#b45309] text-sm">+₹{lot.gainPerQuintal} /क्विंटल</span>
                    <span className="text-[10px] text-amber-700 block mt-0.5">कुल लाभ: +₹{lot.totalGain?.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t">
                  <p className="text-xs text-gray-600 font-medium">
                    {lot.statusTextHindi}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate('/app/compare')}
                      className="text-xs font-bold text-[#2e7d32] hover:underline flex items-center gap-1"
                    >
                      <span>3-4 मंडी तुलना देखें</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-[#14231b] border-b pb-2">नया फसल लॉट दर्ज करें</h3>
            
            <form onSubmit={handleAddLot} className="space-y-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">फसल:</label>
                <select
                  value={formCropId}
                  onChange={(e) => setFormCropId(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5"
                >
                  {CROPS.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">मात्रा (क्विंटल):</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={formQty}
                  onChange={(e) => setFormQty(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">गोदाम / खेत का स्थान:</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">भंडारण प्रकार:</label>
                <select
                  value={formStorage}
                  onChange={(e) => setFormStorage(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5"
                >
                  <option value="हवादार कमरा (Well Ventilated)">हवादार जालीदार कमरा</option>
                  <option value="कोल्ड स्टोरेज (Cold Storage)">कोल्ड स्टोरेज</option>
                  <option value="पक्का सूखा गोदाम (Dry Godown)">पक्का सूखा गोदाम</option>
                  <option value="खेत पर तिरपाल (Field Crates)">खेत पर तिरपाल में</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2e7d32] text-white font-bold"
                >
                  दर्ज करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

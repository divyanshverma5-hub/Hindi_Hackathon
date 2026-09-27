import React, { useState } from 'react';
import { Layers, Plus, Calendar, MapPin, ArrowRight, Trash2, Volume2 } from 'lucide-react';
import { INITIAL_HOLDINGS, CROPS } from '../data/mandiData';
import { bhasiniService } from '../services/bhasiniService';
import { formatHindiDate, formatIsoDate } from '../utils/dateUtils';

export default function HoldingsPage({ navigate }) {
  const [lots, setLots] = useState(INITIAL_HOLDINGS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formCropId, setFormCropId] = useState('onion');
  const [formQty, setFormQty] = useState(40);
  const [formLocation, setFormLocation] = useState('ग्वालियर, मध्य प्रदेश');
  const [formStorage, setFormStorage] = useState('हवादार कमरा');

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
      storageDate: formatIsoDate(new Date()),
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
  const totalPotentialExtraGain = lots.reduce((acc, curr) => acc + curr.totalGain, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] pb-20 transition-colors">
      
      {/* Header */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-color)] bg-[var(--bg-header)]">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black tracking-tight text-[var(--text-main)]">
              फसल स्टॉक ({lots.length} लॉट)
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
              गोदाम की फसल, सड़न दर व बिक्री समय का प्रबंधन।
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2e7d32] hover:bg-[#256629] text-white px-3.5 py-2 text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>नया लॉट जोड़ें</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="farmer-card p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
            <span className="text-[11px] font-bold text-[var(--text-muted)] uppercase block">कुल भंडारित उपज</span>
            <div className="text-xl sm:text-2xl font-heading font-black text-[var(--text-main)] mt-0.5">{totalQuintals} क्विंटल</div>
          </div>

          <div className="farmer-card p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] shadow-sm">
            <span className="text-[11px] font-bold text-[#d97706] uppercase block">AI सलाह से अतिरिक्त लाभ</span>
            <div className="text-xl sm:text-2xl font-heading font-black text-[#d97706] mt-0.5">+₹{totalPotentialExtraGain.toLocaleString('en-IN')}</div>
          </div>
        </div>

        {/* Lots List */}
        <div className="space-y-4">
          {lots.map((lot) => {
            const crop = CROPS.find(c => c.id === lot.cropId) || CROPS[0];
            return (
              <div
                key={lot.id}
                className="farmer-card rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-4 sm:p-5 shadow-sm space-y-3 relative overflow-hidden"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-color)] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{crop.icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-heading font-black text-[var(--text-main)]">{lot.cropName}</h3>
                        <span className="text-xs bg-[var(--bg-card-subtle)] text-[var(--text-muted)] font-semibold px-2 py-0.5 rounded border border-[var(--border-color)]">
                          {lot.quantityQuintal} क्विंटल
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-0.5">
                        <span>भंडारित: {formatHindiDate(lot.storageDate)}</span>
                        <span>·</span>
                        <span>{lot.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => bhasiniService.speak(lot.statusTextHindi)}
                      className="p-2 rounded-lg border border-[var(--border-color)] hover:bg-[#2e7d32] hover:text-white transition-colors"
                      title="सलाह सुनें"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteLot(lot.id)}
                      className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-red-600 hover:border-red-300 transition-colors"
                      title="हटाएं"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-[var(--bg-card-subtle)]">
                    <span className="text-[var(--text-muted)] block">भंडारण स्थिति:</span>
                    <span className="font-semibold text-[var(--text-main)]">{lot.storageCondition}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[var(--brand-green-subtle)] text-[#2e7d32]">
                    <span className="block font-semibold">सलाह:</span>
                    <span className="font-black text-sm">
                      {lot.recommendedAction === 'HOLD' ? `${lot.recommendedDays} दिन रोकें` : 'आज ही बेचें'}
                    </span>
                    <span className="text-[10px] block mt-0.5">गंतव्य: {lot.targetMandiName}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[var(--accent-amber-subtle)] text-[#d97706]">
                    <span className="block font-semibold">अपेक्षित शुद्ध लाभ:</span>
                    <span className="font-black text-sm">+₹{lot.gainPerQuintal} /क्विंटल</span>
                    <span className="text-[10px] block mt-0.5">कुल: +₹{lot.totalGain?.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[var(--border-color)]">
                  <p className="text-xs text-[var(--text-muted)]">
                    {lot.statusTextHindi}
                  </p>
                  <button
                    onClick={() => navigate('/app/compare')}
                    className="text-xs font-bold text-[#2e7d32] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>मंडी तुलना</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-sm rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5 shadow-2xl space-y-3.5 text-[var(--text-main)]">
            <h3 className="text-base font-bold border-b border-[var(--border-color)] pb-2">नया फसल लॉट दर्ज करें</h3>
            
            <form onSubmit={handleAddLot} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold mb-1">फसल:</label>
                <select
                  value={formCropId}
                  onChange={(e) => setFormCropId(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2"
                >
                  {CROPS.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">मात्रा (क्विंटल):</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={formQty}
                  onChange={(e) => setFormQty(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">स्थान:</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">भंडारण प्रकार:</label>
                <select
                  value={formStorage}
                  onChange={(e) => setFormStorage(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2"
                >
                  <option value="हवादार कमरा">हवादार जालीदार कमरा</option>
                  <option value="कोल्ड स्टोरेज">कोल्ड स्टोरेज</option>
                  <option value="पक्का सूखा गोदाम">पक्का सूखा गोदाम</option>
                  <option value="खेत पर तिरपाल">खेत पर तिरपाल में</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[var(--border-color)]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-[var(--text-muted)] hover:bg-[var(--bg-card-subtle)]"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#2e7d32] hover:bg-[#256629] text-white font-bold"
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

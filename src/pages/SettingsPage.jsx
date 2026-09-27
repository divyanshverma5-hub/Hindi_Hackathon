import React, { useState } from 'react';
import { 
  Sliders, 
  Globe, 
  MapPin, 
  WifiOff, 
  CheckCircle2, 
  Save
} from 'lucide-react';
import { TRANSPORT_MODES } from '../data/mandiData';

export default function SettingsPage({ 
  language, 
  setLanguage, 
  theme, 
  toggleTheme 
}) {
  const [farmerDistrict, setFarmerDistrict] = useState('ग्वालियर, मध्य प्रदेश');
  const [defaultVehicle, setDefaultVehicle] = useState('pickup');
  const [phoneNumber, setPhoneNumber] = useState('9876543210');
  const [smsAlertsEnabled, setSmsAlertsEnabled] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-page)] text-[var(--text-main)] pb-20 transition-colors">
      
      {/* Header */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 border-b border-[var(--border-color)] bg-[var(--bg-header)]">
        <div className="mx-auto max-w-3xl space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-main)]">
            सेटिंग्स व ऑफ़लाइन प्रबंधन
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)]">
            मातृभाषा, गृह जिला, डिफ़ॉल्ट ढुलाई वाहन और कमज़ोर नेटवर्क हेतु SMS सुविधा।
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

        <form onSubmit={handleSave} className="space-y-5">
          
          {/* Section 1: Language & Theme */}
          <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2.5">
              <Globe className="h-4 w-4 text-[#2e7d32]" />
              <h3 className="font-bold text-sm text-[var(--text-main)]">भाषा व स्क्रीन थीम</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold mb-1 text-[var(--text-main)]">
                  प्राथमिक भाषा:
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2 font-medium text-[var(--text-main)] focus:border-[#2e7d32] focus:outline-none"
                >
                  <option value="hi">हिन्दी (डिफ़ॉल्ट)</option>
                  <option value="en">English</option>
                  <option value="mr">मराठी</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text-main)]">
                  स्क्रीन रंग थीम:
                </label>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2 font-medium flex items-center justify-between hover:bg-[var(--bg-card-subtle)] text-left"
                >
                  <span>{theme === 'noon' ? '☀️ दोपहर मोड (Light)' : '🌙 सांझ मोड (Dark)'}</span>
                  <span className="text-xs text-[#2e7d32] font-bold">बदलें</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Farm Location & Vehicle */}
          <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2.5">
              <MapPin className="h-4 w-4 text-[#2e7d32]" />
              <h3 className="font-bold text-sm text-[var(--text-main)]">किसान का गृह स्थान व वाहन</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold mb-1 text-[var(--text-main)]">
                  गृह जिला व ब्लॉक:
                </label>
                <input
                  type="text"
                  value={farmerDistrict}
                  onChange={(e) => setFarmerDistrict(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2 font-medium text-[var(--text-main)] focus:border-[#2e7d32] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[var(--text-main)]">
                  पसंदीदा ढुलाई वाहन:
                </label>
                <select
                  value={defaultVehicle}
                  onChange={(e) => setDefaultVehicle(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2 font-medium text-[var(--text-main)] focus:border-[#2e7d32] focus:outline-none"
                >
                  {TRANSPORT_MODES.map(v => (
                    <option key={v.id} value={v.id}>{v.icon} {v.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Low Connectivity */}
          <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)] p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-[var(--border-color)] pb-2.5">
              <WifiOff className="h-4 w-4 text-[#2e7d32]" />
              <h3 className="font-bold text-sm text-[var(--text-main)]">कमज़ोर नेटवर्क (2G/3G) व SMS अलर्ट्स</h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)]">
                <div>
                  <span className="font-bold text-[var(--text-main)] block">ऑफ़लाइन डेटा स्टोरेज</span>
                  <span className="text-[11px] text-[var(--text-muted)]">
                    इंटरनेट न होने पर भी पिछला भाव सुरक्षित रहता है।
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  सक्रिय
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-[var(--text-main)]">
                    किसान का मोबाइल नंबर:
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-2 font-mono text-[var(--text-main)] focus:border-[#2e7d32] focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={smsAlertsEnabled}
                      onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                      className="h-4 w-4 accent-[#2e7d32] rounded"
                    />
                    <span className="font-medium text-[var(--text-main)]">
                      भाव शिखर होने पर निःशुल्क SMS अलर्ट भेजें
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-1">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 px-3 py-1.5 rounded-lg flex items-center gap-1 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4" />
                सेटिंग्स सुरक्षित हो गईं!
              </span>
            ) : <span></span>}

            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2e7d32] hover:bg-[#256629] text-white font-bold text-xs sm:text-sm shadow-sm transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>सेटिंग्स सुरक्षित करें</span>
            </button>
          </div>

        </form>

        <div className="p-4 rounded-xl bg-[var(--bg-card-subtle)] border border-[var(--border-color)] text-xs text-[var(--text-muted)] space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[var(--text-main)]">डेटा स्रोत व API स्थिति:</span>
            <span className="text-[10px] font-semibold text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border-color)] px-2 py-0.5 rounded">
              Agmarknet (डेमो डेटा)
            </span>
          </div>
          <p className="text-[11px] leading-relaxed">
            वर्तमान में 180-दिवसीय Agmarknet ऐतिहासिक मॉडल का उपयोग हो रहा है। वास्तविक सरकारी API हेतु <code className="text-[var(--brand-green)] font-mono">.env</code> में <code className="text-[var(--brand-green)] font-mono">VITE_DATA_GOV_API_KEY</code> जोड़ें।
          </p>
          <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between text-[11px]">
            <span>कृषिवाणी · हिंदी हैकाथॉन 2026</span>
            <span>IIITM ग्वालियर</span>
          </div>
        </div>

      </div>

    </div>
  );
}

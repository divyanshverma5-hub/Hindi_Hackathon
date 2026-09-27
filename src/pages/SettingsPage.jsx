import React, { useState } from 'react';
import { 
  Sliders, 
  Globe, 
  MapPin, 
  Truck, 
  PhoneCall, 
  WifiOff, 
  CheckCircle2, 
  Save, 
  ShieldCheck,
  RefreshCw
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
    <div className="min-h-screen bg-[#F8F9F5] text-[#1E2922] pb-24">
      
      {/* Header */}
      <div className="bg-[#14231b] text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-[#2d6a4f]/30">
        <div className="mx-auto max-w-4xl space-y-2">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#e09f3e]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#e09f3e]">
              किसान प्रोफ़ाइल व सिस्टम सेटिंग्स
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            सेटिंग्स व ऑफ़लाइन प्रबंधन
          </h1>
          <p className="text-xs sm:text-sm text-gray-300">
            मातृभाषा, गृह जिला, डिफ़ॉल्ट ढुलाई वाहन और कम नेटवर्क वाले क्षेत्रों हेतु SMS सुविधा।
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-5 space-y-6">

        <form onSubmit={handleSave} className="space-y-6">
          
          {/* Section 1: Language & Theme */}
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <Globe className="h-5 w-5 text-[#2e7d32]" />
              <h3 className="font-extrabold text-base text-[#14231b]">मातृभाषा व स्क्रीन थीम</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  प्राथमिक भाषा (Default Language):
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 font-bold focus:border-[#2e7d32] focus:outline-none"
                >
                  <option value="hi">हिन्दी (Hindi - डिफ़ॉल्ट)</option>
                  <option value="en">English (अंग्रेज़ी)</option>
                  <option value="mr">मराठी (Marathi)</option>
                </select>
                <span className="text-xs text-gray-500 mt-1 block">
                  भाषिणी AI इसी भाषा में आवाज़ में बोलेगा
                </span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  स्क्रीन रंग थीम (Theme):
                </label>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="w-full rounded-xl border border-gray-300 p-2.5 font-bold flex items-center justify-between hover:bg-gray-50 text-left"
                >
                  <span>{theme === 'noon' ? '☀️ दोपहर मोड (Noon Light)' : '🌙 सांझ मोड (Mandi Slate Dark)'}</span>
                  <span className="text-xs text-[#2e7d32]">बदलें</span>
                </button>
                <span className="text-xs text-gray-500 mt-1 block">
                  खेत में धूप के लिए दोपहर मोड उपयुक्त है
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Farm Location & Vehicle */}
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <MapPin className="h-5 w-5 text-[#2e7d32]" />
              <h3 className="font-extrabold text-base text-[#14231b]">किसान का गृह स्थान व परिवहन वरीयता</h3>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  किसान का गृह जिला व ब्लॉक:
                </label>
                <input
                  type="text"
                  value={farmerDistrict}
                  onChange={(e) => setFarmerDistrict(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 font-medium focus:border-[#2e7d32] focus:outline-none"
                />
                <span className="text-xs text-gray-500 mt-1 block">
                  दूरी की गणना इसी स्थान से होगी
                </span>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  पसंदीदा ढुलाई वाहन:
                </label>
                <select
                  value={defaultVehicle}
                  onChange={(e) => setDefaultVehicle(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 font-bold focus:border-[#2e7d32] focus:outline-none"
                >
                  {TRANSPORT_MODES.map(v => (
                    <option key={v.id} value={v.id}>{v.icon} {v.name}</option>
                  ))}
                </select>
                <span className="text-xs text-gray-500 mt-1 block">
                  मंडी तुलना में यह डिफ़ॉल्ट रूप से चुना जाएगा
                </span>
              </div>
            </div>
          </div>

          {/* Section 3: Low Connectivity & SMS IVR Alerts */}
          <div className="rounded-2xl bg-white border border-gray-200 p-6 shadow-md space-y-4">
            <div className="flex items-center gap-2 border-b pb-3">
              <WifiOff className="h-5 w-5 text-[#e09f3e]" />
              <h3 className="font-extrabold text-base text-[#14231b]">कमज़ोर नेटवर्क (2G/3G) व SMS अलर्ट्स</h3>
            </div>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border">
                <div>
                  <span className="font-bold text-gray-900 block">ऑफ़लाइन डेटा स्टोरेज (Offline SQLite/Cache)</span>
                  <span className="text-xs text-gray-500">
                    इंटरनेट न होने पर भी पिछला मंडी भाव और गणना सुरक्षित रहती है।
                  </span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  सक्रिय (Active)
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1.5">
                    किसान का मोबाइल नंबर (SMS/WhatsApp हेतु):
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 p-2.5 font-mono focus:border-[#2e7d32] focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smsAlertsEnabled}
                      onChange={(e) => setSmsAlertsEnabled(e.target.checked)}
                      className="h-4 w-4 accent-[#2e7d32] rounded"
                    />
                    <span className="font-semibold text-gray-800">
                      भाव शिखर होने पर निःशुल्क SMS अलर्ट भेजें
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="h-4 w-4" />
                सेटिंग्स सफलतापूर्वक सुरक्षित हो गईं!
              </span>
            ) : <span></span>}

            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2e7d32] hover:bg-[#388e3c] text-white font-bold text-sm shadow-md transition-colors"
            >
              <Save className="h-4 w-4" />
              <span>सेटिंग्स सुरक्षित करें</span>
            </button>
          </div>

        </form>

        {/* Hackathon Credits */}
        <div className="p-6 rounded-2xl bg-[#14231b] text-white space-y-2 border border-[#2d6a4f]/40 text-xs">
          <div className="font-extrabold text-[#e09f3e] text-sm">
            कृषिवाणी (KrishiVaani / KrishiPrice) · हिंदी हैकाथॉन 2026
          </div>
          <p className="text-gray-300 leading-relaxed">
            परियोजना टीम: HD Falcons (दिव्यांश वर्मा · हर्षित गुप्ता) <br />
            संस्थान: अटल बिहारी वाजपेयी - भारतीय सूचना प्रौद्योगिकी एवं प्रबंधन संस्थान (IIITM), ग्वालियर <br />
            डेटा स्रोत: Agmarknet (कृषि मंत्रालय) व e-NAM · भाषा AI: राष्ट्रीय भाषा अनुवाद मिशन भाषिणी (MeitY)
          </p>
        </div>

      </div>

    </div>
  );
}

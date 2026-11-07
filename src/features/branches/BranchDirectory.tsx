import React, { useState } from 'react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { CHURCH_BRANCHES } from '../../data/churchData';
import { MapPin, Phone, MessageCircle, Navigation, Clock, User, Building, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { TRANSLATIONS } from '../../data/translations';

export const BranchDirectory: React.FC = () => {
  const [selectedLocality, setSelectedLocality] = useState<string>('all');
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const localities = ['all', ...CHURCH_BRANCHES.map(b => b.locality)];

  const filteredBranches = CHURCH_BRANCHES.filter((b) => {
    return selectedLocality === 'all' || b.locality === selectedLocality;
  });

  return (
    <section id="branches" className="py-16 md:py-24 bg-stone-100 dark:bg-sacred-espresso border-b border-stone-300 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow={t.branches.eyebrow}
          title={t.branches.title}
          description={t.branches.desc}
        />

        {/* Global Timings Notice Banner */}
        <div className="mb-8 p-4 bg-sacred-obsidian text-stone-200 border-2 border-sacred-gold shadow-sharp grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sacred-rust text-white shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sacred-gold uppercase tracking-wider block">
                {language === 'en' ? 'Sunday Service (All Branches)' : 'ఆదివారం ఆరాధన (అన్ని శాఖలలో)'}
              </span>
              <span className="text-white font-mono font-bold">10:00 AM – 01:00 PM (Telugu)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-sacred-gold text-stone-950 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sacred-gold uppercase tracking-wider block">
                {language === 'en' ? 'Tuesday Bible Study' : 'మంగళవారం బైబిల్ స్టడీ'}
              </span>
              <span className="text-white font-mono font-bold">06:00 PM – 07:00 PM (Kalyan Nagar)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-stone-800 text-sacred-rust shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sacred-gold uppercase tracking-wider block">
                {language === 'en' ? 'Monthly All-Night Prayer' : 'నెల చివరి శనివారం రాత్రి ప్రార్థన'}
              </span>
              <span className="text-white font-mono font-bold">10:00 PM – 05:00 AM (All Branches)</span>
            </div>
          </div>
        </div>

        {/* Locality Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-10 pb-4 border-b border-stone-300 dark:border-stone-800">
          {localities.map((loc) => {
            const branch = CHURCH_BRANCHES.find(b => b.locality === loc);
            const label = loc === 'all'
              ? t.branches.allBranchesFilter
              : (language === 'en' ? loc : (branch?.localityTe || loc));

            return (
              <button
                key={loc}
                onClick={() => setSelectedLocality(loc)}
                className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors ${
                  selectedLocality === loc
                    ? 'bg-sacred-rust text-white border-sacred-rust shadow-sharp-sm'
                    : 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-sacred-rust'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Branches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {filteredBranches.map((branch) => {
            const branchName = language === 'en' ? branch.name : (branch.nameTe || branch.name);
            const branchLocality = language === 'en' ? branch.locality : (branch.localityTe || branch.locality);
            const branchAddress = language === 'en' ? branch.address : (branch.addressTe || branch.address);
            const branchLandmark = language === 'en' ? branch.landmark : (branch.landmarkTe || branch.landmark);
            const branchPastor = language === 'en' ? branch.pastorInCharge : (branch.pastorInChargeTe || branch.pastorInCharge);

            return (
              <div
                key={branch.id}
                className={`bg-white dark:bg-stone-900 border-2 transition-all flex flex-col justify-between h-full min-h-[500px] ${
                  branch.isMainBranch
                    ? 'border-sacred-rust shadow-sharp-warm'
                    : 'border-stone-300 dark:border-stone-800 hover:border-sacred-gold shadow-sharp-sm'
                }`}
              >
                {/* Card Header (Standardized uniform height across all cards) */}
                <div className="p-6 border-b border-stone-200 dark:border-stone-800 min-h-[195px] flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-sacred-rust/10 border border-sacred-rust/40 text-sacred-rust font-bold uppercase text-[10px] tracking-wider">
                          {branchLocality}, Hyderabad
                        </span>
                        {branch.isMainBranch && (
                          <span className="px-2 py-0.5 bg-sacred-gold text-stone-950 font-black uppercase text-[10px] tracking-wider">
                            {t.branches.mainBranchBadge}
                          </span>
                        )}
                      </div>
                      <Building className="w-5 h-5 text-stone-400 shrink-0" />
                    </div>

                    <h3 className="font-display text-xl font-bold uppercase text-stone-900 dark:text-white tracking-wide">
                      {branchName}
                    </h3>

                    <p className="mt-2 text-xs text-stone-600 dark:text-stone-300 flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-sacred-rust shrink-0 mt-0.5" />
                      <span>
                        {branchAddress}
                        {branchLandmark && <span className="block text-stone-500 italic mt-0.5">({branchLandmark})</span>}
                      </span>
                    </p>
                  </div>

                  {/* Pastor in Charge */}
                  <div className="mt-4 pt-3 border-t border-dashed border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
                    <span className="text-stone-500 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-sacred-gold" />
                      <span>{t.branches.pastorLabel}</span>
                    </span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">{branchPastor}</span>
                  </div>
                </div>

                {/* Service Timetable for this branch (Standardized to 3 slots) */}
                <div className="p-6 bg-stone-50 dark:bg-stone-950/60 flex-1 flex flex-col justify-start gap-2.5 min-h-[225px]">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-sacred-rust dark:text-sacred-gold flex items-center gap-1.5 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    {t.branches.servicesHeading}
                  </span>

                  {branch.services.map((svc, idx) => {
                    const svcName = language === 'en' ? svc.name : (svc.nameTe || svc.name);
                    const svcDay = language === 'en' ? svc.day : (svc.dayTe || svc.day);

                    return (
                      <div
                        key={idx}
                        className={`p-2.5 border text-xs flex items-center justify-between ${
                          svc.isSpecial
                            ? 'bg-sacred-gold/10 border-sacred-gold/40 text-stone-900 dark:text-stone-100'
                            : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-stone-900 dark:text-white block">{svcName}</span>
                          <span className="text-[10px] text-stone-500">{svcDay}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-sacred-rust dark:text-sacred-gold block">{svc.time}</span>
                          <span className="px-1.5 py-0.2 bg-stone-200 dark:bg-stone-800 text-[9px] uppercase font-bold text-stone-700 dark:text-stone-300">
                            {svc.language}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* 3rd Slot for Branches without local in-person Bible Study */}
                  {branch.services.length < 3 && (
                    <div className="p-2.5 border text-xs flex items-center justify-between border-dashed border-stone-300 dark:border-stone-800 bg-white/60 dark:bg-stone-900/40 text-stone-600 dark:text-stone-400">
                      <div>
                        <span className="font-semibold text-stone-800 dark:text-stone-200 block">
                          {language === 'en' ? 'Tuesday Bible Study' : 'మంగళవారం బైబిల్ స్టడీ'}
                        </span>
                        <span className="text-[10px] text-stone-500">
                          {language === 'en' ? 'Live Streamed from Kalyan Nagar' : 'కళ్యాణ్ నగర్ నుండి లైవ్ ప్రసారం'}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-stone-600 dark:text-stone-400 block font-semibold">06:00 – 07:00 PM</span>
                        <span className="px-1.5 py-0.2 bg-stone-200 dark:bg-stone-800 text-[9px] uppercase font-bold text-sacred-gold">
                          Online Live
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2 h-16">
                  <a
                    href={`tel:${branch.pastorContact}`}
                    className="flex-1 py-2 px-2 text-center text-xs font-bold uppercase tracking-wider bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-300 dark:border-stone-700 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-sacred-rust" />
                    <span>{t.branches.callPastor}</span>
                  </a>

                  <a
                    href={`https://wa.me/${branch.whatsappNumber}?text=Greetings%20Pastor,%20I%20would%20like%20to%20know%20more%20about%20Salem%20Fellowship%20Church%20services%20at%20${encodeURIComponent(branch.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 text-xs font-bold uppercase bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-600 flex items-center justify-center transition-colors"
                    title={t.branches.whatsapp}
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  <a
                    href={branch.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 text-xs font-bold uppercase bg-sacred-rust hover:bg-[#A3360A] text-white border border-sacred-rust flex items-center justify-center gap-1 shadow-sharp-sm transition-colors"
                    title={t.branches.mapDirections}
                  >
                    <Navigation className="w-4 h-4" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

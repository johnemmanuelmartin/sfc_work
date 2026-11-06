import React, { useState } from 'react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { CHURCH_HISTORY_MILESTONES, STATEMENT_OF_FAITH } from '../../data/churchData';
import { BookOpen, History } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const HistoryFaithSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'history' | 'faith'>('history');

  return (
    <section id="about" className="py-16 md:py-24 bg-stone-100 dark:bg-sacred-espresso border-b border-stone-300 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow={t.about.eyebrow}
          title={t.about.title}
          description={t.about.desc}
        />

        {/* Tab Selector */}
        <div className="flex border-b border-stone-300 dark:border-stone-800 mb-10 max-w-md">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-xs md:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-sacred-rust text-sacred-rust dark:border-sacred-gold dark:text-sacred-gold bg-stone-200/50 dark:bg-stone-900/60'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>{t.about.tabJourney}</span>
          </button>

          <button
            onClick={() => setActiveTab('faith')}
            className={`flex-1 py-3 text-xs md:text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'faith'
                ? 'border-sacred-rust text-sacred-rust dark:border-sacred-gold dark:text-sacred-gold bg-stone-200/50 dark:bg-stone-900/60'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{t.about.tabFaith}</span>
          </button>
        </div>

        {/* TAB 1: HISTORY TIMELINE */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {CHURCH_HISTORY_MILESTONES.map((item, idx) => {
                const title = language === 'te' && item.titleTe ? item.titleTe : item.title;
                const desc = language === 'te' && item.descriptionTe ? item.descriptionTe : item.description;

                return (
                  <div
                    key={idx}
                    className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 hover:border-sacred-rust p-5 flex flex-col justify-between shadow-sharp-sm transition-all"
                  >
                    <div>
                      <span className="font-mono text-2xl font-black text-sacred-rust dark:text-sacred-gold block mb-2">
                        {item.year}
                      </span>
                      <h4 className="font-display font-bold text-sm uppercase text-stone-900 dark:text-white mb-2 leading-tight">
                        {title}
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-dashed border-stone-200 dark:border-stone-800 text-[10px] uppercase font-bold text-stone-400">
                      {t.about.phaseLabel} 0{idx + 1}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-sacred-obsidian text-stone-200 border-2 border-sacred-gold shadow-sharp mt-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-xs font-bold uppercase text-sacred-gold tracking-widest block">
                  {t.about.legacyBadge}
                </span>
                <p className="font-display text-lg font-bold uppercase text-white">
                  {t.about.legacyTitle}
                </p>
                <p className="text-xs text-stone-400 max-w-2xl leading-relaxed">
                  {t.about.legacyDesc}
                </p>
              </div>

              <div className="shrink-0">
                <span className="px-4 py-2 bg-sacred-rust text-white text-xs font-bold uppercase tracking-wider border border-sacred-gold shadow-sharp-sm inline-block">
                  {t.about.motto}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STATEMENT OF FAITH */}
        {activeTab === 'faith' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {STATEMENT_OF_FAITH.map((item, idx) => {
              const doctrine = language === 'te' && item.doctrineTe ? item.doctrineTe : item.doctrine;
              const summary = language === 'te' && item.summaryTe ? item.summaryTe : item.summary;

              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 hover:border-sacred-gold p-6 flex flex-col justify-between shadow-sharp-sm transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-6 h-6 bg-sacred-rust/10 border border-sacred-rust/40 text-sacred-rust flex items-center justify-center font-mono text-xs font-bold">
                        {idx + 1}
                      </span>
                      <h4 className="font-display font-bold text-base uppercase text-stone-900 dark:text-white">
                        {doctrine}
                      </h4>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200 dark:border-stone-800 text-[10px] uppercase font-bold text-sacred-rust dark:text-sacred-gold tracking-widest">
                    {t.about.doctrineBadge}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

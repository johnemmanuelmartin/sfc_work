import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, MapPin, Heart, ArrowRight, Clock, Users, BookOpen } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { CHURCH_INFO } from '../../data/churchData';
import { useLanguage } from '../../context/LanguageContext';
import { TRANSLATIONS } from '../../data/translations';

export const HeroSection: React.FC = () => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  return (
    <section className="relative bg-sacred-obsidian text-stone-100 overflow-hidden border-b-2 border-sacred-rust">
      {/* Background Subtle Warm Geometric Grid Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D97706_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      {/* Decorative Warm Ambient Light Gradient */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-sacred-rust/20 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sacred-gold/15 blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Hero Column (Left) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Top Pill / Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-900 border border-sacred-rust/50 text-xs uppercase font-bold tracking-widest text-sacred-gold shadow-sharp-sm">
              <span className="w-2 h-2 bg-sacred-rust animate-pulse inline-block"></span>
              <span>{CHURCH_INFO.name} • {t.hero.badge}</span>
            </div>

            {/* Main Title with Sharp Typography */}
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold uppercase tracking-tight text-white leading-[1.05]">
              {t.hero.titleLine1} <span className="text-white underline decoration-sacred-gold/70 decoration-2 underline-offset-8">{t.hero.titleHighlight1}</span><br />
              {t.hero.titleLine2} <span className="text-sacred-gold">{t.hero.titleHighlight2}</span>
            </h1>

            {/* Subtitle / Vision */}
            <p className="text-base sm:text-lg md:text-xl text-stone-300 font-normal leading-relaxed max-w-2xl">
              {t.hero.subtitle}
            </p>

            {/* Service Timings Card */}
            <div className="p-4 bg-sacred-espresso/90 border-l-4 border-l-sacred-gold border border-stone-800 max-w-2xl space-y-2">
              <div className="flex items-center text-xs text-stone-400">
                <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-sacred-gold">
                  <Clock className="w-3.5 h-3.5" />
                  {t.hero.servicesCardTitle}
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <div className="p-2 bg-stone-900 border border-stone-800">
                  <span className="font-bold text-white block">{t.hero.sundayService}</span>
                  <span className="text-sacred-gold font-mono text-[11px] font-bold">{t.hero.sundayServiceTime}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">{t.hero.sundayServiceDesc}</span>
                </div>

                <div className="p-2 bg-stone-900 border border-stone-800">
                  <span className="font-bold text-white block">{t.hero.tuesdayStudy}</span>
                  <span className="text-sacred-gold font-mono text-[11px] font-bold">{t.hero.tuesdayStudyTime}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">{t.hero.tuesdayStudyDesc}</span>
                </div>

                <div className="p-2 bg-stone-900 border border-stone-800">
                  <span className="font-bold text-white block">{t.hero.lastSatPrayer}</span>
                  <span className="text-sacred-gold font-mono text-[11px] font-bold">{t.hero.lastSatPrayerTime}</span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">{t.hero.lastSatPrayerDesc}</span>
                </div>
              </div>
            </div>

            {/* Call to Actions (Sharp Edge Buttons Linking to Pages) */}
            <div className="pt-2 flex flex-wrap gap-3">
              <Link to="/branches">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-white" />
                  <span>{t.hero.btnBranches}</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link to="/live">
                <Button
                  variant="secondary"
                  size="lg"
                  className="flex items-center gap-2 border-stone-600 bg-stone-900/90 text-white hover:text-sacred-gold hover:border-sacred-gold"
                >
                  <Radio className="w-4 h-4 text-sacred-gold" />
                  <span>{t.hero.btnLive}</span>
                </Button>
              </Link>

              <Link to="/give">
                <Button
                  variant="gold"
                  size="lg"
                  className="flex items-center gap-2"
                >
                  <Heart className="w-4 h-4 fill-stone-950" />
                  <span>{t.hero.btnGiving}</span>
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Card / Scripture & Quick Metric Plaque */}
          <div className="lg:col-span-4 space-y-4">
            {/* Scripture Plaque */}
            <div className="bg-sacred-espresso border-2 border-stone-800 p-6 relative shadow-sharp">
              <div className="absolute top-0 right-0 bg-stone-900 border-l border-b border-stone-700 text-sacred-gold text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                {t.hero.versePlaqueTitle}
              </div>
              <p className="font-serif text-stone-100 text-sm md:text-base leading-relaxed pt-3 font-semibold">
                {language === 'en' ? CHURCH_INFO.scriptureVerse : CHURCH_INFO.scriptureVerseTe}
              </p>
              <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-xs">
                <span className="font-bold text-sacred-gold uppercase tracking-wider">{t.hero.verseRef}</span>
                <span className="text-stone-500 font-mono">Holy Bible</span>
              </div>
            </div>

            {/* Quick Metrics Grid (Fixed Symmetrical Heights) */}
            <div className="grid grid-cols-2 gap-3">
              <Link to="/branches" className="block group h-full">
                <div className="bg-stone-900 border border-stone-800 group-hover:border-stone-600 p-4 transition-colors h-full min-h-[112px] flex flex-col justify-between shadow-sharp-sm">
                  <div>
                    <div className="flex items-center gap-2 text-sacred-gold mb-1">
                      <MapPin className="w-4 h-4 text-sacred-gold" />
                      <span className="font-mono text-xl font-bold text-white">6</span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300 block">
                      {t.hero.metric1Label}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 group-hover:text-sacred-gold font-medium mt-2 flex items-center gap-1">
                    <span>{t.hero.metric1Sub}</span>
                    <span>→</span>
                  </span>
                </div>
              </Link>

              <Link to="/live" className="block group h-full">
                <div className="bg-stone-900 border border-stone-800 group-hover:border-stone-600 p-4 transition-colors h-full min-h-[112px] flex flex-col justify-between shadow-sharp-sm">
                  <div>
                    <div className="flex items-center gap-2 text-sacred-gold mb-1">
                      <Radio className="w-4 h-4 text-sacred-gold" />
                      <span className="font-mono text-xl font-bold text-white">10 - 1</span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300 block">
                      {t.hero.metric2Label}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 group-hover:text-sacred-gold font-medium mt-2 flex items-center gap-1">
                    <span>{t.hero.metric2Sub}</span>
                    <span>→</span>
                  </span>
                </div>
              </Link>

              <Link to="/events" className="block group h-full">
                <div className="bg-stone-900 border border-stone-800 group-hover:border-stone-600 p-4 transition-colors h-full min-h-[112px] flex flex-col justify-between shadow-sharp-sm">
                  <div>
                    <div className="flex items-center gap-2 text-sacred-gold mb-1">
                      <BookOpen className="w-4 h-4 text-sacred-gold" />
                      <span className="font-mono text-xl font-bold text-white">Tue 6 PM</span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300 block">
                      {t.hero.metric3Label}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 group-hover:text-sacred-gold font-medium mt-2 flex items-center gap-1">
                    <span>{t.hero.metric3Sub}</span>
                    <span>→</span>
                  </span>
                </div>
              </Link>

              <Link to="/prayer" className="block group h-full">
                <div className="bg-stone-900 border border-stone-800 group-hover:border-stone-600 p-4 transition-colors h-full min-h-[112px] flex flex-col justify-between shadow-sharp-sm">
                  <div>
                    <div className="flex items-center gap-2 text-sacred-gold mb-1">
                      <Users className="w-4 h-4 text-sacred-gold" />
                      <span className="font-mono text-xl font-bold text-white">24/7</span>
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300 block">
                      {t.hero.metric4Label}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400 group-hover:text-sacred-gold font-medium mt-2 flex items-center gap-1">
                    <span>{t.hero.metric4Sub}</span>
                    <span>→</span>
                  </span>
                </div>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

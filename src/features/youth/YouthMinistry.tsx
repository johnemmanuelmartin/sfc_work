import React from 'react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Sparkles, Music, Compass, Flame, Users, ArrowRight } from 'lucide-react';
import { CHURCH_INFO } from '../../data/churchData';
import { useLanguage } from '../../context/LanguageContext';

export const YouthMinistry: React.FC = () => {
  const { t, language } = useLanguage();

  const pillars = [
    {
      icon: Flame,
      title: t.youth.pillars.spiritual.title,
      desc: t.youth.pillars.spiritual.desc,
    },
    {
      icon: Music,
      title: t.youth.pillars.arts.title,
      desc: t.youth.pillars.arts.desc,
    },
    {
      icon: Compass,
      title: t.youth.pillars.mentorship.title,
      desc: t.youth.pillars.mentorship.desc,
    },
    {
      icon: Users,
      title: t.youth.pillars.cells.title,
      desc: t.youth.pillars.cells.desc,
    },
  ];

  const whatsappMessage = encodeURIComponent(
    language === 'te'
      ? 'నమస్కారం, నేను SFC యూత్ క్యాంప్ 2026 వివరాలు తెలుసుకోవాలనుకుంటున్నాను.'
      : 'Hi, I would like to inquire and register for the SFC Youth Camp 2026.'
  );

  return (
    <section id="youth" className="py-16 md:py-24 bg-stone-900 text-stone-100 border-b border-stone-800 relative overflow-hidden">
      {/* Background graphic elements */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sacred-rust/15 blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        <SectionHeader
          eyebrow={t.youth.eyebrow}
          title={t.youth.title}
          description={t.youth.desc}
        />

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-sacred-espresso border-2 border-stone-800 hover:border-sacred-rust p-6 transition-all duration-150 flex flex-col justify-between shadow-sharp-sm"
              >
                <div>
                  <div className="w-12 h-12 bg-stone-900 border border-sacred-rust/50 text-sacred-gold flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="font-display font-bold text-lg uppercase text-white mb-2">
                    {pillar.title}
                  </h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-stone-800 text-[10px] uppercase font-bold text-sacred-rust tracking-widest flex items-center gap-1">
                  <span>{t.youth.exploreTrack}</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Callout Banner: Flagship Youth Gathering */}
        <div className="bg-stone-900 border-2 border-stone-700 p-8 md:p-10 shadow-sharp mb-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <span className="px-2.5 py-1 bg-stone-950 text-sacred-gold border border-sacred-gold text-[10px] font-black uppercase tracking-widest inline-block">
              {t.youth.flagshipBadge}
            </span>
            <h3 className="font-display text-2xl md:text-4xl font-black uppercase text-white tracking-wide">
              {t.youth.campTitle}
            </h3>
            <p className="text-xs md:text-sm text-stone-200 max-w-2xl leading-relaxed">
              {t.youth.campDesc}
            </p>
            <p className="text-xs font-mono font-bold text-white pt-1">
              {t.youth.campDetails}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${CHURCH_INFO.whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-stone-950 hover:bg-stone-900 text-white font-bold text-xs uppercase tracking-wider border-2 border-sacred-gold shadow-sharp transition-colors flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-sacred-gold" />
              <span>{t.youth.registerWhatsapp}</span>
            </a>
          </div>
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {t.youth.testimonials.map((item: { quote: string; name: string; role: string }, idx: number) => (
            <div key={idx} className="p-6 bg-stone-950 border border-stone-800 flex flex-col justify-between">
              <p className="font-serif italic text-stone-300 text-sm leading-relaxed mb-4">
                “{item.quote}”
              </p>
              <div className="pt-3 border-t border-stone-800">
                <span className="font-bold text-xs uppercase text-white block">{item.name}</span>
                <span className="text-[11px] text-sacred-gold">{item.role}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

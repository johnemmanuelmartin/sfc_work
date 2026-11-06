import React, { useState } from 'react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { UPCOMING_EVENTS } from '../../data/churchData';
import { Calendar, Clock, MapPin, Download, CheckCircle } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { TRANSLATIONS } from '../../data/translations';

export const EventsSection: React.FC = () => {
  const [downloadedEvent, setDownloadedEvent] = useState<string | null>(null);
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const handleDownloadIcs = (eventTitle: string, eventDate: string) => {
    const icsData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Salem Fellowship Church//Hyderabad//EN
BEGIN:VEVENT
SUMMARY:${eventTitle}
DESCRIPTION:Salem Fellowship Church Hyderabad - ${eventDate}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${eventTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadedEvent(eventTitle);
    setTimeout(() => setDownloadedEvent(null), 3000);
  };

  return (
    <section id="events" className="py-16 md:py-24 bg-sacred-cream dark:bg-sacred-obsidian border-b border-stone-300 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow={t.events.eyebrow}
          title={t.events.title}
          description={t.events.desc}
        />

        {/* 3 Core Weekly/Monthly Pillar Ordinances */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Pillar 1: Sunday Service */}
          <div className="bg-sacred-espresso border-2 border-sacred-rust p-6 md:p-8 shadow-sharp text-stone-100 flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-1 bg-sacred-rust text-white font-bold text-[10px] uppercase tracking-wider inline-block mb-3">
                {t.events.corePillar1Day}
              </span>
              <h3 className="font-display text-xl md:text-2xl font-bold uppercase text-white mb-2">
                {t.events.corePillar1Title}
              </h3>
              <p className="text-xs text-stone-400 font-mono mb-4">
                Sunday Telugu Divine Service
              </p>
              <div className="space-y-2 border-t border-b border-stone-800 py-4 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sacred-gold shrink-0" />
                  <span className="text-white font-mono font-bold text-sm">{t.events.corePillar1Time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sacred-rust shrink-0" />
                  <span>{t.events.corePillar1Venue}</span>
                </div>
              </div>
              <p className="text-xs text-stone-300 mt-4 leading-relaxed">
                {t.events.corePillar1Desc}
              </p>
            </div>
          </div>

          {/* Pillar 2: Tuesday Bible Study */}
          <div className="bg-sacred-espresso border-2 border-sacred-gold p-6 md:p-8 shadow-sharp text-stone-100 flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-1 bg-sacred-gold text-stone-950 font-black text-[10px] uppercase tracking-wider inline-block mb-3">
                {t.events.corePillar2Day}
              </span>
              <h3 className="font-display text-xl md:text-2xl font-bold uppercase text-white mb-2">
                {t.events.corePillar2Title}
              </h3>
              <p className="text-xs text-stone-400 font-mono mb-4">
                Weekly In-Depth Bible Study
              </p>
              <div className="space-y-2 border-t border-b border-stone-800 py-4 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sacred-gold shrink-0" />
                  <span className="text-white font-mono font-bold text-sm">{t.events.corePillar2Time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sacred-rust shrink-0" />
                  <span className="font-bold text-sacred-gold">{t.events.corePillar2Venue}</span>
                </div>
              </div>
              <p className="text-xs text-stone-300 mt-4 leading-relaxed">
                {t.events.corePillar2Desc}
              </p>
            </div>
          </div>

          {/* Pillar 3: Last Saturday All-Night Prayer */}
          <div className="bg-sacred-espresso border-2 border-sacred-rust p-6 md:p-8 shadow-sharp text-stone-100 flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-1 bg-red-950 text-red-400 border border-red-800 font-bold text-[10px] uppercase tracking-wider inline-block mb-3">
                {t.events.corePillar3Day}
              </span>
              <h3 className="font-display text-xl md:text-2xl font-bold uppercase text-white mb-2">
                {t.events.corePillar3Title}
              </h3>
              <p className="text-xs text-stone-400 font-mono mb-4">
                Monthly All-Night Prayer
              </p>
              <div className="space-y-2 border-t border-b border-stone-800 py-4 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sacred-gold shrink-0" />
                  <span className="text-white font-mono font-bold text-sm">{t.events.corePillar3Time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sacred-rust shrink-0" />
                  <span>{t.events.corePillar3Venue}</span>
                </div>
              </div>
              <p className="text-xs text-stone-300 mt-4 leading-relaxed">
                {t.events.corePillar3Desc}
              </p>
            </div>
          </div>
        </div>

        {/* Major Events & Convocations List */}
        <h3 className="font-display text-xl md:text-2xl font-bold uppercase text-stone-900 dark:text-white mb-6">
          {t.events.specialConvocations}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {UPCOMING_EVENTS.map((event) => {
            const evTitle = language === 'en' ? event.title : (event.titleTe || event.title);
            const evSubtitle = language === 'en' ? event.subtitle : (event.subtitleTe || event.subtitle);
            const evDate = language === 'en' ? event.date : (event.dateTe || event.date);
            const evTime = language === 'en' ? event.time : (event.timeTe || event.time);
            const evVenue = language === 'en' ? event.venue : (event.venueTe || event.venue);
            const evDesc = language === 'en' ? event.description : (event.descriptionTe || event.description);
            const evBadge = language === 'en' ? event.badge : (event.badgeTe || event.badge);

            return (
              <div
                key={event.id}
                className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 hover:border-sacred-rust shadow-sharp-sm p-6 md:p-8 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-sacred-rust/10 border border-sacred-rust/40 text-sacred-rust text-xs font-bold uppercase tracking-wider">
                      {event.category}
                    </span>
                    {evBadge && (
                      <span className="px-2 py-0.5 bg-sacred-gold text-stone-950 font-black uppercase text-[10px] tracking-wider">
                        {evBadge}
                      </span>
                    )}
                  </div>

                  <h4 className="font-display text-xl md:text-2xl font-bold uppercase text-stone-900 dark:text-white mb-1">
                    {evTitle}
                  </h4>
                  <p className="text-xs font-serif italic text-sacred-rust dark:text-sacred-gold mb-4">
                    {evSubtitle}
                  </p>

                  <p className="text-xs md:text-sm text-stone-600 dark:text-stone-300 leading-relaxed mb-6">
                    {evDesc}
                  </p>

                  <div className="space-y-2 border-t border-b border-stone-200 dark:border-stone-800 py-4 text-xs text-stone-700 dark:text-stone-300 font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sacred-rust shrink-0" />
                      <span><strong>{language === 'en' ? 'Date:' : 'తేదీ:'}</strong> {evDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-sacred-gold shrink-0" />
                      <span><strong>{language === 'en' ? 'Timing:' : 'సమయం:'}</strong> {evTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-sacred-rust shrink-0" />
                      <span><strong>{language === 'en' ? 'Venue:' : 'స్థలము:'}</strong> {evVenue}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownloadIcs(evTitle, evDate)}
                    className="flex items-center gap-1.5"
                  >
                    {downloadedEvent === evTitle ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{t.events.calendarAdded}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>{t.events.downloadIcs}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

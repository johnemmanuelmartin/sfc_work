import React, { useState } from 'react';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { Button } from '../../components/ui/Button';
import { NEWSLETTERS } from '../../data/churchData';
import { FileText, Download, CheckCircle, Mail } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const NewsletterSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const [emailSub, setEmailSub] = useState('');
  const [subSuccess, setSubSuccess] = useState(false);

  const handleDownloadPdf = (title: string, id: string) => {
    // Generate sample bulletin download text
    const content = `SALEM FELLOWSHIP CHURCH (SFC) - HYDERABAD\nMONTHLY LITURGICAL BULLETIN\n=========================================\n${title}\n\nKey Highlights:\n- Sunday Divine Telugu Worship: 10:00 AM – 01:00 PM (All 6 Hyderabad Branches)\n- In-Depth Bible Study: Every Tuesday 06:00 PM – 07:00 PM (Kalyan Nagar Main Branch)\n- Monthly All-Night Prayer: Every Last Saturday 10:00 PM – 05:00 AM\n\nPastoral Message by Pastor P. David Paul\n\nOfficial Website: https://salemfellowship.in\nConfidential Prayer Line: +91 98480 12345`;
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${id}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadedId(id);
    setTimeout(() => setDownloadedId(null), 3000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub) {
      setSubSuccess(true);
      setEmailSub('');
      setTimeout(() => setSubSuccess(false), 5000);
    }
  };

  return (
    <section id="newsletters" className="py-16 md:py-24 bg-stone-100 dark:bg-sacred-espresso border-b border-stone-300 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow={t.newsletters.eyebrow}
          title={t.newsletters.title}
          description={t.newsletters.desc}
        />

        {/* Newsletter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {NEWSLETTERS.map((item) => {
            const edition = language === 'te' && item.editionTe ? item.editionTe : item.edition;
            const monthYear = language === 'te' && item.monthYearTe ? item.monthYearTe : item.monthYear;
            const title = language === 'te' && item.titleTe ? item.titleTe : item.title;
            const themeVerse = language === 'te' && item.themeVerseTe ? item.themeVerseTe : item.themeVerse;
            const summary = language === 'te' && item.summaryTe ? item.summaryTe : item.summary;
            const topics = language === 'te' && item.topicsTe ? item.topicsTe : item.topics;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 hover:border-sacred-rust shadow-sharp-sm p-6 flex flex-col justify-between transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-3 pb-2 border-b border-stone-200 dark:border-stone-800">
                    <span className="font-bold uppercase text-sacred-rust dark:text-sacred-gold">{edition}</span>
                    <span className="font-mono">{monthYear}</span>
                  </div>

                  <div className="w-10 h-10 bg-sacred-rust/10 border border-sacred-rust/40 text-sacred-rust flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5" />
                  </div>

                  <h3 className="font-display font-bold text-lg uppercase text-stone-900 dark:text-white mb-2">
                    {title}
                  </h3>

                  <p className="font-serif italic text-xs text-stone-500 mb-4 border-l-2 border-sacred-gold pl-2">
                    {themeVerse}
                  </p>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                    {summary}
                  </p>

                  {/* Topics covered */}
                  <div className="space-y-1 mb-4">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                      {t.newsletters.inThisIssue}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {topics.map((itemTopic, i) => (
                        <span key={i} className="px-2 py-0.5 bg-stone-100 dark:bg-stone-800 text-[10px] text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                          {itemTopic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => handleDownloadPdf(title, item.id)}
                    className="flex items-center justify-center gap-2"
                  >
                    {downloadedId === item.id ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-emerald-300" />
                        <span>{t.newsletters.downloadedBtn}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>{t.newsletters.downloadBtn}</span>
                      </>
                    )}
                  </Button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Subscribe Banner */}
        <div className="bg-sacred-obsidian text-stone-200 border-2 border-sacred-rust p-8 shadow-sharp flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="font-display text-xl font-bold uppercase text-white">
              {t.newsletters.subscribeTitle}
            </h4>
            <p className="text-xs text-stone-400 max-w-xl">
              {t.newsletters.subscribeDesc}
            </p>
          </div>

          <div className="w-full md:w-auto">
            {subSuccess ? (
              <div className="p-3 bg-emerald-950 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t.newsletters.subSuccess}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  placeholder={t.newsletters.emailPlaceholder}
                  className="px-4 py-2.5 text-xs bg-stone-900 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-sacred-gold w-full sm:w-64"
                />
                <Button type="submit" variant="primary" size="sm" className="whitespace-nowrap flex items-center justify-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{t.newsletters.subscribeBtn}</span>
                </Button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

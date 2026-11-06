import React, { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Button } from '../components/ui/Button';
import { CHURCH_INFO, CHURCH_BRANCHES } from '../data/churchData';
import { Phone, MessageCircle, ShieldCheck, CheckCircle2, Send, Clock } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { TRANSLATIONS } from '../data/translations';

export const PrayerPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    branch: 'Kalyan Nagar Branch (Main Branch)',
    category: language === 'en' ? 'Healing & Health' : 'స్వస్థత మరియు ఆరోగ్యం',
    isConfidential: true,
    request: '',
  });

  const categories = language === 'en' ? [
    'Healing & Physical Health',
    'Family Peace & Restoration',
    'Financial Breakthrough & Jobs',
    'Spiritual Renewal & Growth',
    'Protection & Deliverance',
    'Children & Youth Guidance',
    'Thanksgiving & Praise Report',
  ] : [
    'స్వస్థత మరియు శారీరక ఆరోగ్యం',
    'కుటుంబ సమాధానం & ఆశీర్వాదం',
    'ఉద్యోగం & ఆర్థిక విడుదల',
    'ఆత్మీయ ఎదుగుదల & రక్షణ',
    'దైవిక రక్షణ & విడుదల',
    'పిల్లల భవిష్యత్తు కొరకు',
    'కృతజ్ఞతా స్తుతులు & సాక్ష్యములు',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      phone: '',
      email: '',
      branch: 'Kalyan Nagar Branch (Main Branch)',
      category: categories[0],
      isConfidential: true,
      request: '',
    });
  };

  return (
    <div className="py-12 md:py-20 bg-sacred-cream dark:bg-sacred-obsidian min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeader
          eyebrow={t.prayer.eyebrow}
          title={t.prayer.title}
          description={t.prayer.desc}
        />

        {/* 24/7 Hotline Alert Banner */}
        <div className="mb-8 p-6 bg-sacred-espresso text-stone-200 border-2 border-sacred-rust shadow-sharp flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs uppercase font-bold text-sacred-gold tracking-widest flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sacred-gold" />
              {t.prayer.hotlineTitle}
            </span>
            <p className="font-display text-lg font-bold text-white uppercase">
              {language === 'en' ? 'Immediate Pastoral Prayer Assistance' : 'తక్షణ ప్రార్థన సహాయం'}
            </p>
            <p className="text-xs text-stone-400">
              {t.prayer.hotlineDesc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <a
              href={`tel:${CHURCH_INFO.emergencyPrayerPhone}`}
              className="px-4 py-2.5 bg-sacred-rust hover:bg-[#A3360A] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-sacred-rust shadow-sharp-sm transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t.prayer.callBtn}: {CHURCH_INFO.emergencyPrayerPhone}</span>
            </a>
            <a
              href={`https://wa.me/${CHURCH_INFO.whatsappNumber}?text=Pastor,%20I%20urgently%20need%20prayer`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-emerald-600 shadow-sharp-sm transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{t.prayer.whatsappBtn}</span>
            </a>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-800 p-6 md:p-10 shadow-sharp">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-16 h-16 mx-auto bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-display text-2xl font-bold uppercase text-stone-900 dark:text-white">
                {language === 'en' ? 'Your Petition Has Been Received' : 'మీ ప్రార్థన విన్నపం స్వీకరించబడింది'}
              </h3>
              <p className="text-xs md:text-sm text-stone-600 dark:text-stone-300 max-w-lg mx-auto leading-relaxed">
                {language === 'en'
                  ? `Grace and peace to you, ${formData.name || 'Beloved'}. Our pastors and intercessors are upholding your petition before the throne of God. Stand firm in faith.`
                  : `మీకు కృప మరియు సమాధానము కలుగును గాక, ${formData.name || 'ప్రియమైనవారలారా'}. మా పాస్టర్లు మీ ప్రార్థన విన్నపమును దేవుని సన్నిధిలో విజ్ఞాపన చేస్తున్నారు.`}
              </p>

              <div className="p-4 bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 max-w-md mx-auto text-left space-y-1">
                <p><strong>{language === 'en' ? 'Petition Category:' : 'అంశం:'}</strong> {formData.category}</p>
                <p><strong>{language === 'en' ? 'Preferred Branch:' : 'శాఖ:'}</strong> {formData.branch}</p>
                <p><strong>{language === 'en' ? 'Confidentiality:' : 'రహస్య స్థితి:'}</strong> {formData.isConfidential ? (language === 'en' ? 'Strict Pastoral Seal (Pastors Only)' : 'రహస్య పాస్టరల్ ప్రార్థన') : (language === 'en' ? 'Congregational Prayer' : 'సాధారణ ప్రార్థన')}</p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="primary" onClick={handleReset}>
                  {language === 'en' ? 'Submit Another Prayer Request' : 'మరొక ప్రార్థన విన్నపం పంపండి'}
                </Button>
                <a
                  href={`https://wa.me/${CHURCH_INFO.whatsappNumber}?text=Pastor,%20I%20just%20submitted%20a%20prayer%20request%20for%20${encodeURIComponent(formData.category)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold uppercase tracking-wider border border-emerald-600 shadow-sharp flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{language === 'en' ? 'Notify Pastor on WhatsApp' : 'పాస్టర్ గారికి వాట్సాప్‌లో చెప్పండి'}</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="p-3 bg-amber-500/10 border border-amber-600/30 flex items-center gap-2 text-xs text-stone-700 dark:text-amber-200">
                <ShieldCheck className="w-5 h-5 text-sacred-gold shrink-0" />
                <span>
                  {language === 'en'
                    ? 'All prayer requests are held with strict pastoral confidentiality by our ordained ministers.'
                    : 'మీ ప్రార్థన విషయాలు అత్యంత గోప్యంగా ఉంచబడి, పాస్టర్ల చేత నిరంతరం ప్రార్థించబడును.'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    {t.prayer.fullName}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. John Emmanuel"
                    className="w-full px-3 py-2 text-xs md:text-sm bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-sacred-rust"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    {t.prayer.phone}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-xs md:text-sm bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-sacred-rust"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    {t.prayer.category}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs md:text-sm bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-sacred-rust"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                    {t.prayer.branch}
                  </label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                    className="w-full px-3 py-2 text-xs md:text-sm bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-sacred-rust"
                  >
                    {CHURCH_BRANCHES.map((b) => (
                      <option key={b.id} value={b.name}>
                        {language === 'en' ? b.name : (b.nameTe || b.name)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                  {t.prayer.petition}
                </label>
                <textarea
                  required
                  rows={5}
                  value={formData.request}
                  onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                  placeholder={
                    language === 'en'
                      ? 'Share your prayer need, health condition, family matter, or spiritual struggle...'
                      : 'మీ ప్రార్థన అవసరాన్ని, అనారోగ్య సమస్యలను లేదా కుటుంబ విషయాలను వివరంగా తెలియజేయండి...'
                  }
                  className="w-full px-3 py-2 text-xs md:text-sm bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-sacred-rust"
                ></textarea>
              </div>

              <div className="flex items-center gap-2 p-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
                <input
                  type="checkbox"
                  id="confidentialityToggle"
                  checked={formData.isConfidential}
                  onChange={(e) => setFormData({ ...formData, isConfidential: e.target.checked })}
                  className="accent-sacred-rust w-4 h-4 shrink-0"
                />
                <label htmlFor="confidentialityToggle" className="text-xs text-stone-700 dark:text-stone-300 cursor-pointer">
                  <strong>{t.prayer.confidentiality}</strong>
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <Button type="submit" variant="primary" size="lg" className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  <span>{t.prayer.submitBtn}</span>
                </Button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

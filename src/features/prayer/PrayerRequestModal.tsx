import React, { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { CHURCH_INFO, CHURCH_BRANCHES } from '../../data/churchData';
import { CheckCircle2, ShieldCheck, MessageCircle, Send } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { TRANSLATIONS } from '../../data/translations';

interface PrayerRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrayerRequestModal: React.FC<PrayerRequestModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [submitted, setSubmitted] = useState(false);
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const categories = language === 'en' ? [
    'Healing & Physical Health',
    'Family Peace & Restoration',
    'Financial Breakthrough & Jobs',
    'Spiritual Renewal & Growth',
    'Protection & Deliverance',
    'Thanksgiving & Praise Report',
  ] : [
    'స్వస్థత మరియు ఆరోగ్యం',
    'కుటుంబ సమాధానం',
    'ఉద్యోగం & ఆర్థిక విడుదల',
    'ఆత్మీయ ఎదుగుదల',
    'దైవిక రక్షణ & విడుదల',
    'కృతజ్ఞతా స్తుతులు',
  ];

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    branch: 'Kalyan Nagar Branch (Main Branch)',
    category: categories[0],
    isConfidential: true,
    request: '',
  });

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
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.prayer.title}
      subtitle={t.prayer.desc}
      maxWidth="xl"
    >
      {submitted ? (
        <div className="text-center py-8 px-4 space-y-4">
          <div className="w-16 h-16 mx-auto bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="font-display text-2xl font-bold uppercase text-stone-900 dark:text-white">
            {language === 'en' ? 'Your Petition Has Been Received' : 'మీ ప్రార్థన విన్నపం స్వీకరించబడింది'}
          </h4>
          <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto leading-relaxed">
            {language === 'en'
              ? `Grace and peace to you, ${formData.name || 'Beloved'}. Our pastors are upholding your petition before the throne of God.`
              : `మీకు కృప మరియు సమాధానము కలుగును గాక, ${formData.name || 'ప్రియమైనవారలారా'}. మా పాస్టర్లు మీ ప్రార్థన విన్నపమును దేవుని సన్నిధిలో విజ్ఞాపన చేస్తున్నారు.`}
          </p>

          <div className="p-4 bg-stone-100 dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-400 max-w-sm mx-auto text-left">
            <p><strong>{language === 'en' ? 'Category:' : 'అంశం:'}</strong> {formData.category}</p>
            <p><strong>{language === 'en' ? 'Branch:' : 'శాఖ:'}</strong> {formData.branch}</p>
            <p><strong>{language === 'en' ? 'Confidentiality:' : 'రహస్య స్థితి:'}</strong> {formData.isConfidential ? (language === 'en' ? 'Strict Pastoral Seal' : 'రహస్య పాస్టరల్ ప్రార్థన') : (language === 'en' ? 'Congregational' : 'సాధారణ')}</p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="primary" onClick={handleReset}>
              {language === 'en' ? 'Submit Another Request' : 'మరొక విన్నపం పంపండి'}
            </Button>
            <a
              href={`https://wa.me/${CHURCH_INFO.whatsappNumber}?text=Pastor,%20I%20just%20submitted%20a%20prayer%20request%20for%20${encodeURIComponent(formData.category)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-emerald-700 hover:bg-emerald-800 text-white border border-emerald-600 shadow-sharp"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.prayer.whatsappBtn}</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-3 bg-amber-500/10 border border-amber-600/30 flex items-center gap-2 text-xs text-stone-700 dark:text-amber-200">
            <ShieldCheck className="w-4 h-4 text-sacred-gold shrink-0" />
            <span>{t.prayer.confidentiality}</span>
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
                className="w-full px-3 py-2 text-xs md:text-sm bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-sacred-rust"
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
                className="w-full px-3 py-2 text-xs md:text-sm bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-sacred-rust"
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
                className="w-full px-3 py-2 text-xs md:text-sm bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-sacred-rust"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
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
                className="w-full px-3 py-2 text-xs md:text-sm bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-sacred-rust"
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
              rows={4}
              value={formData.request}
              onChange={(e) => setFormData({ ...formData, request: e.target.value })}
              placeholder={language === 'en' ? "Describe your prayer need freely..." : "మీ ప్రార్థన అవసరాన్ని వివరించండి..."}
              className="w-full px-3 py-2 text-xs md:text-sm bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white focus:outline-none focus:border-sacred-rust"
            ></textarea>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="confidentialCheck"
              checked={formData.isConfidential}
              onChange={(e) => setFormData({ ...formData, isConfidential: e.target.checked })}
              className="accent-sacred-rust w-4 h-4"
            />
            <label htmlFor="confidentialCheck" className="text-xs text-stone-600 dark:text-stone-300 cursor-pointer">
              {t.prayer.confidentiality}
            </label>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200 dark:border-stone-800">
            <a
              href={`tel:${CHURCH_INFO.emergencyPrayerPhone}`}
              className="text-xs text-sacred-rust dark:text-sacred-gold font-bold hover:underline"
            >
              {language === 'en' ? 'Need urgent prayer? Call' : 'అత్యవసర ప్రార్థన కొరకు కాల్ చేయండి:'} {CHURCH_INFO.emergencyPrayerPhone}
            </a>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                {language === 'en' ? 'Cancel' : 'రద్దు'}
              </Button>
              <Button type="submit" variant="primary" size="sm" className="flex items-center gap-1.5 flex-1 sm:flex-none">
                <Send className="w-3.5 h-3.5" />
                <span>{t.prayer.submitBtn}</span>
              </Button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Youtube, Instagram, Facebook, Phone, Mail, MapPin, CheckCircle, ArrowRight } from 'lucide-react';
import { CHURCH_INFO, CHURCH_BRANCHES } from '../../data/churchData';
import { useLanguage } from '../../context/LanguageContext';
import { TRANSLATIONS } from '../../data/translations';

export const Footer: React.FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput) {
      setSubscribed(true);
      setEmailInput('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: '/live', label: t.nav.live },
    { to: '/branches', label: t.nav.branches },
    { to: '/events', label: t.nav.events },
    { to: '/youth', label: t.nav.youth },
    { to: '/leadership', label: t.nav.leadership },
    { to: '/about', label: t.nav.about },
    { to: '/gallery', label: t.nav.gallery },
    { to: '/newsletters', label: t.nav.newsletters },
    { to: '/give', label: t.nav.offerings },
    { to: '/prayer', label: t.nav.needPrayer },
  ];

  return (
    <footer className="bg-sacred-obsidian text-stone-300 border-t-2 border-sacred-rust pt-16 pb-24 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Col 1 & 2: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              {!logoError ? (
                <img
                  src="/logo.png"
                  alt={CHURCH_INFO.name}
                  className="w-10 h-10 object-contain shrink-0"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-10 h-10 bg-sacred-espresso border-2 border-sacred-gold flex items-center justify-center text-sacred-gold font-serif font-black text-xl shrink-0">
                  ✝
                </div>
              )}
              <div>
                <span className="font-display font-black text-xl text-white uppercase tracking-wider block">
                  {CHURCH_INFO.name}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-sacred-gold">
                  {language === 'en' ? 'Registered Indian Christian Trust • Est. 1996' : 'రిజిస్టర్డ్ క్రైస్తవ ట్రస్ట్ • స్థాపన 1996'}
                </span>
              </div>
            </Link>

            <p className="text-stone-400 text-sm leading-relaxed max-w-md">
              {language === 'en'
                ? 'Salem Fellowship Church is a local community of believers with 6 branches across Hyderabad committed to biblical sound doctrine, continuous intercession, and family restoration.'
                : 'సేలెం ఫెలోషిప్ చర్చి హైదరాబాద్ నగరంలోని 6 శాఖల ద్వారా దేవుని వాక్య పరిచర్య, విజ్ఞాపన ప్రార్థనలు మరియు సమాజ సేవలను అందిస్తున్న సహవాసము.'}
            </p>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-xs uppercase tracking-widest text-stone-400 block mb-3 font-bold">
                {language === 'en' ? 'Connect With Us Online' : 'సామాజిక మాధ్యమాలు'}
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={CHURCH_INFO.socials.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-stone-700 hover:border-red-600 hover:bg-red-600/20 text-stone-300 hover:text-red-400 flex items-center justify-center transition-colors"
                  aria-label="YouTube Channel"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href={CHURCH_INFO.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-stone-700 hover:border-pink-600 hover:bg-pink-600/20 text-stone-300 hover:text-pink-400 flex items-center justify-center transition-colors"
                  aria-label="Instagram Profile"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={CHURCH_INFO.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 border border-stone-700 hover:border-blue-600 hover:bg-blue-600/20 text-stone-300 hover:text-blue-400 flex items-center justify-center transition-colors"
                  aria-label="Facebook Page"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${CHURCH_INFO.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 h-9 border border-stone-700 hover:border-emerald-600 hover:bg-emerald-600/20 text-stone-300 hover:text-emerald-400 flex items-center gap-1.5 text-xs font-bold uppercase transition-colors"
                  aria-label="WhatsApp Community"
                >
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation (Router Links) */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-4 border-b border-stone-800 pb-2">
              {language === 'en' ? 'Explore Pages' : 'పేజీలు'}
            </h4>
            <ul className="space-y-2 text-xs font-semibold uppercase tracking-wider">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-stone-400 hover:text-sacred-gold hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Church Branches */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-4 border-b border-stone-800 pb-2">
              {language === 'en' ? 'Church Branches' : 'చర్చి శాఖలు'}
            </h4>
            <ul className="space-y-2.5 text-xs">
              {CHURCH_BRANCHES.map((branch) => {
                const bLocality = language === 'en' ? branch.locality : (branch.localityTe || branch.locality);
                return (
                  <li key={branch.id}>
                    <Link
                      to="/branches"
                      className="text-left group flex items-start gap-1.5 text-stone-400 hover:text-white transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-sacred-rust shrink-0 mt-0.5 group-hover:text-sacred-gold" />
                      <div>
                        <span className="font-bold text-stone-200 group-hover:text-sacred-gold block">
                          {bLocality} {branch.isMainBranch && <span className="text-[10px] text-sacred-gold">({language === 'en' ? 'Main' : 'ప్రధాన'})</span>}
                        </span>
                        <span className="text-[10px] text-stone-500">
                          {language === 'en' ? 'Sunday 10 AM – 1 PM' : 'ఆదివారం 10 AM – 1 PM'}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 5: Bulletin & Pastoral Line */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-white mb-4 border-b border-stone-800 pb-2">
              {language === 'en' ? 'Monthly Bulletin' : 'వర్తమాన పత్రిక'}
            </h4>
            <p className="text-xs text-stone-400 mb-3 leading-relaxed">
              {language === 'en'
                ? 'Receive the monthly pastoral letter, Bible study notes, and all-night prayer notices.'
                : 'నెలవారీ పాస్టర్ గారి లేఖ, బైబిల్ స్టడీ నోట్స్ మరియు రాత్రి ప్రార్థన వివరాలను ఈమెయిల్‌లో అందుకోండి.'}
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{t.common.subscribed}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder={language === 'en' ? "Enter your email" : "మీ ఈమెయిల్ నమోదు చేయండి"}
                  required
                  className="w-full px-3 py-2 text-xs bg-stone-900 border border-stone-700 text-white placeholder-stone-500 focus:outline-none focus:border-sacred-rust"
                />
                <button
                  type="submit"
                  className="w-full py-2 px-3 text-xs uppercase font-bold tracking-wider bg-sacred-rust hover:bg-[#A3360A] text-white border border-sacred-rust transition-colors flex items-center justify-center gap-1 shadow-sharp-sm"
                >
                  <span>{t.common.subscribe}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-stone-800">
              <span className="text-[10px] uppercase tracking-widest text-stone-500 block mb-1 font-bold">
                {language === 'en' ? 'Pastoral Counseling & Prayer' : 'పాస్టరల్ కౌన్సిలింగ్ & ప్రార్థన'}
              </span>
              <a
                href={`tel:${CHURCH_INFO.emergencyPrayerPhone}`}
                className="text-xs text-sacred-gold font-bold hover:underline flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{CHURCH_INFO.emergencyPrayerPhone}</span>
              </a>
              <div className="text-[10px] text-stone-500 flex items-center gap-1.5 mt-1">
                <Mail className="w-3 h-3" />
                <span>{CHURCH_INFO.email}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Quick Actions */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {CHURCH_INFO.name} Trust. {t.common.allRights}</p>
          <div className="flex items-center gap-4">
            <Link to="/prayer" className="hover:text-stone-300 underline">
              {t.nav.needPrayer}
            </Link>
            <span>•</span>
            <Link to="/give" className="hover:text-stone-300 underline">
              {t.nav.offerings}
            </Link>
            <span>•</span>
            <Link to="/admin" className="hover:text-stone-300 text-stone-600 dark:text-stone-500">
              Media Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Heart, Menu, X, PhoneCall, Sun, Moon, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { CHURCH_INFO } from '../../data/churchData';
import { useLanguage } from '../../context/LanguageContext';
import { TRANSLATIONS } from '../../data/translations';

interface NavbarProps {
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isDarkMode,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { language, setLanguage } = useLanguage();
  const t = TRANSLATIONS[language];

  // Close dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMoreDropdownOpen(false);
  }, [location.pathname]);

  // Click outside to close desktop "More" dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Primary visible links in desktop navigation
  const primaryLinks = [
    { to: '/', label: t.nav.home },
    { to: '/live', label: t.nav.live },
    { to: '/branches', label: t.nav.branches },
    { to: '/events', label: t.nav.events },
    { to: '/youth', label: t.nav.youth },
  ];

  // Secondary links housed in "More" dropdown
  const secondaryLinks = [
    { to: '/leadership', label: t.nav.leadership },
    { to: '/about', label: t.nav.about },
    { to: '/gallery', label: t.nav.gallery },
    { to: '/newsletters', label: t.nav.newsletters },
    { to: '/prayer', label: t.nav.needPrayer },
  ];

  const allNavLinks = [
    ...primaryLinks,
    ...secondaryLinks,
    { to: '/give', label: t.nav.offerings },
  ];

  const isMoreActive = secondaryLinks.some((link) => location.pathname === link.to);

  return (
    <>
      {/* Top Service Times Announcement Banner */}
      <div className="bg-stone-950 text-stone-300 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2 text-stone-300 font-medium tracking-wide text-center md:text-left text-[11px] sm:text-xs">
            <span>{t.nav.serviceNotice}</span>
            <span className="text-stone-600 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-sacred-gold">{t.nav.tueBibleStudy}</span>
            <span className="text-stone-600 hidden lg:inline">•</span>
            <span className="hidden lg:inline text-stone-400">{t.nav.lastSatPrayer}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] shrink-0">
            <a 
              href={`tel:${CHURCH_INFO.emergencyPrayerPhone}`} 
              className="flex items-center gap-1.5 text-sacred-gold hover:underline font-semibold"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>{t.nav.emergencyPhone}: {CHURCH_INFO.emergencyPrayerPhone}</span>
            </a>
            <span className="hidden md:inline text-stone-700">|</span>
            <Link 
              to="/branches"
              className="hidden md:flex items-center gap-1 hover:text-white transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>{t.nav.branchesCount}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-sacred-cream/95 dark:bg-sacred-obsidian/95 backdrop-blur-md border-b border-stone-300 dark:border-stone-800 transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-15 sm:h-16 md:h-18 gap-2">
            
            {/* Logo & Church Title (Auto-scaling & Never overflowing) */}
            <Link 
              to="/" 
              className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none group min-w-0 shrink"
            >
              {!logoError ? (
                <img
                  src="/logo.png"
                  alt={CHURCH_INFO.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain shrink-0"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-stone-900 border border-stone-700 flex items-center justify-center text-sacred-gold font-serif font-black text-base sm:text-lg shadow-sharp-sm shrink-0">
                  ✝
                </div>
              )}
              <div className="flex flex-col justify-center min-w-0">
                <span className="font-display font-bold text-xs min-[360px]:text-[13px] min-[410px]:text-sm sm:text-[15px] md:text-base tracking-tight min-[380px]:tracking-wider text-stone-900 dark:text-white uppercase leading-none whitespace-nowrap truncate">
                  {CHURCH_INFO.name}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 ${
                      isActive
                        ? 'border-stone-800 text-stone-900 dark:border-sacred-gold dark:text-sacred-gold'
                        : 'border-transparent text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:border-stone-400'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {/* "More" Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setMoreDropdownOpen((prev) => !prev)}
                  className={`px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 flex items-center gap-1 ${
                    isMoreActive
                      ? 'border-stone-800 text-stone-900 dark:border-sacred-gold dark:text-sacred-gold'
                      : 'border-transparent text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:border-stone-400'
                  }`}
                  aria-expanded={moreDropdownOpen}
                >
                  <span>{language === 'en' ? 'More' : 'మరిన్ని'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-48 bg-white dark:bg-stone-900 border-2 border-stone-300 dark:border-stone-700 shadow-sharp py-1 z-50 animate-in fade-in-50 duration-100">
                    {secondaryLinks.map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setMoreDropdownOpen(false)}
                        className={({ isActive }) =>
                          `block px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                            isActive
                              ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-sacred-gold font-black'
                              : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/60 hover:text-stone-950 dark:hover:text-white'
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </nav>

            {/* Right Action Controls (Balanced & Symmetrical) */}
            <div className="hidden sm:flex items-center gap-2.5 shrink-0">
              {/* Language Switcher [ EN | తెలుగు ] */}
              <div className="flex items-center border border-stone-300 dark:border-stone-700 p-0.5 bg-stone-100 dark:bg-stone-900">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 uppercase font-bold tracking-wider text-[11px] transition-colors ${
                    language === 'en'
                      ? 'bg-stone-900 text-white dark:bg-stone-800 dark:text-sacred-gold shadow-sharp-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                  title="Switch to English"
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('te')}
                  className={`px-2 py-1 font-bold text-[11px] transition-colors ${
                    language === 'te'
                      ? 'bg-stone-900 text-sacred-gold font-black dark:bg-stone-800 shadow-sharp-sm'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
                  }`}
                  title="తెలుగులోకి మార్చండి"
                >
                  తెలుగు
                </button>
              </div>

              {/* Theme Toggle Button */}
              <button
                onClick={onToggleTheme}
                aria-label="Toggle theme"
                className="p-1.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-stone-500 transition-colors bg-white dark:bg-stone-900"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-sacred-gold" /> : <Moon className="w-4 h-4 text-stone-700" />}
              </button>

              {/* Giving Action Button */}
              <Link to="/give">
                <Button
                  variant="primary"
                  size="sm"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs"
                >
                  <Heart className="w-3.5 h-3.5 fill-current text-white dark:text-stone-950" />
                  <span>{t.nav.offerings}</span>
                </Button>
              </Link>
            </div>

            {/* Mobile View Controls (Always Visible & Symmetrical) */}
            <div className="flex sm:hidden items-center gap-1.5 shrink-0">
              {/* Compact Language Toggle: EN for English, తె for Telugu */}
              <button
                type="button"
                onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
                className="w-8 h-8 flex items-center justify-center border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-sacred-gold hover:border-stone-500 font-bold text-xs tracking-wider transition-colors"
                aria-label="Toggle language"
                title={language === 'en' ? 'Switch to తెలుగు (తె)' : 'Switch to English (EN)'}
              >
                {language === 'en' ? 'EN' : 'తె'}
              </button>

              <button
                type="button"
                onClick={onToggleTheme}
                aria-label="Toggle theme"
                className="w-8 h-8 flex items-center justify-center border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-900 hover:border-stone-500 transition-colors"
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDarkMode ? <Sun className="w-4 h-4 text-sacred-gold" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="w-8 h-8 flex items-center justify-center border border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white bg-white dark:bg-stone-900 hover:border-stone-500 transition-colors"
                aria-label="Open mobile menu"
                title="Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-sacred-cream dark:bg-stone-900 border-b-2 border-stone-400 dark:border-stone-700 p-4 animate-in slide-in-from-top duration-200">
            {/* Mobile Language Bar */}
            <div className="flex items-center justify-between p-2.5 bg-stone-100 dark:bg-stone-950 border border-stone-300 dark:border-stone-800 mb-3 text-xs">
              <span className="font-bold text-stone-600 dark:text-stone-400 uppercase text-[11px]">
                {language === 'en' ? 'Website Language:' : 'వెబ్‌సైట్ భాష:'}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 text-xs font-bold uppercase ${
                    language === 'en'
                      ? 'bg-stone-900 text-white dark:bg-stone-800 dark:text-sacred-gold'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  English
                </button>
                <span className="text-stone-400">|</span>
                <button
                  onClick={() => setLanguage('te')}
                  className={`px-2.5 py-1 text-xs font-bold ${
                    language === 'te'
                      ? 'bg-stone-900 text-sacred-gold font-black dark:bg-stone-800'
                      : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  తెలుగు
                </button>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {allNavLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `p-2.5 text-xs font-bold uppercase tracking-wider border transition-colors ${
                      isActive
                        ? 'border-stone-900 bg-stone-900 text-white dark:border-sacred-gold dark:bg-stone-800 dark:text-sacred-gold'
                        : 'border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-950 text-stone-700 dark:text-stone-300'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>

            {/* Mobile Contact Quick Action */}
            <div className="pt-3 border-t border-stone-300 dark:border-stone-800 flex items-center justify-between text-xs">
              <a
                href={`tel:${CHURCH_INFO.emergencyPrayerPhone}`}
                className="flex items-center gap-1.5 text-stone-800 dark:text-sacred-gold font-bold"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>{CHURCH_INFO.emergencyPrayerPhone}</span>
              </a>
              <span className="text-[11px] text-stone-500">
                10 AM – 1 PM (All Branches)
              </span>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

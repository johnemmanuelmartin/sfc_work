import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { QuickActionBottomBar } from './components/layout/QuickActionBottomBar';
import { PrayerRequestModal } from './features/prayer/PrayerRequestModal';
import { UpiPaymentModal } from './features/giving/UpiPaymentModal';

// Dedicated Pages
import { HomePage } from './pages/HomePage';
import { LivePage } from './pages/LivePage';
import { BranchesPage } from './pages/BranchesPage';
import { EventsPage } from './pages/EventsPage';
import { YouthPage } from './pages/YouthPage';
import { LeadershipPage } from './pages/LeadershipPage';
import { AboutPage } from './pages/AboutPage';
import { GalleryPage } from './pages/GalleryPage';
import { NewslettersPage } from './pages/NewslettersPage';
import { GivingPage } from './pages/GivingPage';
import { PrayerPage } from './pages/PrayerPage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  const [prayerModalOpen, setPrayerModalOpen] = useState(false);
  const [givingModalOpen, setGivingModalOpen] = useState(false);
  
  // Dark mode initialized from system preference or localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sfc_theme');
      if (saved) return saved === 'dark';
      return true; // Default to sleek warm dark mode
    }
    return true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('sfc_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('sfc_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-sacred-cream dark:bg-sacred-obsidian text-stone-900 dark:text-stone-100 transition-colors">
          
          {/* Top Navbar */}
          <Navbar
            isDarkMode={isDarkMode}
            onToggleTheme={toggleTheme}
          />

          {/* Multi-Page Route Switcher */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/live" element={<LivePage />} />
              <Route path="/branches" element={<BranchesPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/youth" element={<YouthPage />} />
              <Route
                path="/leadership"
                element={<LeadershipPage onOpenPrayerModal={() => setPrayerModalOpen(true)} />}
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/newsletters" element={<NewslettersPage />} />
              <Route path="/give" element={<GivingPage />} />
              <Route path="/prayer" element={<PrayerPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>

          {/* Footer */}
          <Footer />

          {/* Mobile Sticky Quick Action Bottom Bar */}
          <QuickActionBottomBar />

          {/* Global Quick Action Modals (available from anywhere) */}
          <PrayerRequestModal
            isOpen={prayerModalOpen}
            onClose={() => setPrayerModalOpen(false)}
          />

          <UpiPaymentModal
            isOpen={givingModalOpen}
            onClose={() => setGivingModalOpen(false)}
          />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
};

export default App;

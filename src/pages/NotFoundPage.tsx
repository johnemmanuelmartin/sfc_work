import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const NotFoundPage: React.FC = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 px-4 bg-sacred-cream dark:bg-sacred-obsidian text-center">
      <div className="max-w-md p-8 bg-white dark:bg-stone-900 border-2 border-sacred-rust shadow-sharp space-y-4">
        <span className="font-mono text-6xl font-black text-sacred-rust block">404</span>
        <h2 className="font-display text-xl font-bold uppercase text-stone-900 dark:text-white">
          {language === 'en' ? 'Page Not Found' : 'పేజీ కనుగొనబడలేదు'}
        </h2>
        <p className="text-xs text-stone-600 dark:text-stone-300">
          {language === 'en'
            ? 'The page or section you are looking for does not exist or has been relocated.'
            : 'మీరు వెతుకుతున్న పేజీ లేదా విభాగం అందుబాటులో లేదు లేదా మార్చబడింది.'}
        </p>
        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" size="sm" className="flex items-center justify-center gap-1.5 mx-auto">
              <Home className="w-4 h-4" />
              <span>{language === 'en' ? 'Return to Home' : 'హోమ్ పేజీకి తిరిగి వెళ్లండి'}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

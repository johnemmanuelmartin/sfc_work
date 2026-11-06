import React from 'react';
import { Link } from 'react-router-dom';
import { Radio, Heart, MessageSquarePlus, MapPin, Sparkles, FileText, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { TRANSLATIONS } from '../../data/translations';

interface QuickActionGridProps {
  onNavigate?: (sectionId: string) => void;
  onOpenPrayerModal?: () => void;
  onOpenGivingModal?: () => void;
}

export const QuickActionGrid: React.FC<QuickActionGridProps> = () => {
  const { language } = useLanguage();
  const t = TRANSLATIONS[language];

  const actions = [
    {
      title: t.quickActions.liveTitle,
      subtitle: t.quickActions.liveSubtitle,
      icon: Radio,
      color: 'text-sacred-rust',
      to: '/live',
    },
    {
      title: t.quickActions.giveTitle,
      subtitle: t.quickActions.giveSubtitle,
      icon: Heart,
      color: 'text-sacred-gold',
      to: '/give',
    },
    {
      title: t.quickActions.prayerTitle,
      subtitle: t.quickActions.prayerSubtitle,
      icon: MessageSquarePlus,
      color: 'text-sacred-rust',
      to: '/prayer',
    },
    {
      title: t.quickActions.branchesTitle,
      subtitle: t.quickActions.branchesSubtitle,
      icon: MapPin,
      color: 'text-sacred-gold',
      to: '/branches',
    },
    {
      title: t.quickActions.youthTitle,
      subtitle: t.quickActions.youthSubtitle,
      icon: Sparkles,
      color: 'text-sacred-rust',
      to: '/youth',
    },
    {
      title: t.quickActions.bulletinTitle,
      subtitle: t.quickActions.bulletinSubtitle,
      icon: FileText,
      color: 'text-sacred-gold',
      to: '/newsletters',
    },
  ];

  return (
    <section className="bg-white dark:bg-sacred-espresso border-b border-stone-300 dark:border-stone-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {actions.map((act, idx) => {
            const Icon = act.icon;
            return (
              <Link
                key={idx}
                to={act.to}
                className="group p-4 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-sacred-rust dark:hover:border-sacred-gold text-left transition-all duration-150 flex flex-col justify-between shadow-sm hover:shadow-sharp-sm active:translate-x-[1px] active:translate-y-[1px]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 ${act.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-sacred-rust dark:group-hover:text-sacred-gold transition-colors" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-xs uppercase text-stone-900 dark:text-white tracking-wide group-hover:text-sacred-rust dark:group-hover:text-sacred-gold">
                    {act.title}
                  </h4>
                  <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">
                    {act.subtitle}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

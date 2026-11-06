import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Radio, MapPin, Heart, MessageSquarePlus } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const QuickActionBottomBar: React.FC = () => {
  const { language } = useLanguage();

  const labels = {
    en: { home: 'Home', live: 'Live', give: 'Give', branches: 'Branches', prayer: 'Prayer' },
    te: { home: 'హోమ్', live: 'లైవ్', give: 'కానుకలు', branches: 'బ్రాంచీలు', prayer: 'ప్రార్థన' },
  };

  const l = labels[language];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-stone-950 text-stone-300 border-t-2 border-stone-800 shadow-sharp flex items-center justify-around py-2 px-1">
      {/* Home */}
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center justify-center flex-1 py-1 text-[10px] uppercase font-bold tracking-wider ${
            isActive ? 'text-sacred-gold font-black' : 'text-stone-400 hover:text-white'
          }`
        }
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span>{l.home}</span>
      </NavLink>

      {/* Live */}
      <NavLink
        to="/live"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center flex-1 py-1 text-[10px] uppercase font-bold tracking-wider relative ${
            isActive ? 'text-sacred-gold font-black' : 'text-stone-400 hover:text-white'
          }`
        }
      >
        <Radio className="w-5 h-5 mb-0.5" />
        <span>{l.live}</span>
      </NavLink>

      {/* Give (Center Action) */}
      <NavLink
        to="/give"
        className="flex flex-col items-center justify-center -mt-4 bg-stone-900 text-sacred-gold p-2.5 border-2 border-stone-700 shadow-sharp active:scale-95 transition-transform"
      >
        <Heart className="w-5 h-5 fill-current" />
        <span className="text-[9px] uppercase font-bold tracking-widest mt-0.5">{l.give}</span>
      </NavLink>

      {/* Branches */}
      <NavLink
        to="/branches"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center flex-1 py-1 text-[10px] uppercase font-bold tracking-wider ${
            isActive ? 'text-sacred-gold' : 'text-stone-400 hover:text-white'
          }`
        }
      >
        <MapPin className="w-5 h-5 mb-0.5" />
        <span>{l.branches}</span>
      </NavLink>

      {/* Prayer */}
      <NavLink
        to="/prayer"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center flex-1 py-1 text-[10px] uppercase font-bold tracking-wider ${
            isActive ? 'text-sacred-gold' : 'text-stone-400 hover:text-white'
          }`
        }
      >
        <MessageSquarePlus className="w-5 h-5 mb-0.5" />
        <span>{l.prayer}</span>
      </NavLink>
    </div>
  );
};

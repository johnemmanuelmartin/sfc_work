import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'rust' | 'gold' | 'maroon' | 'stone' | 'live' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'stone',
  size = 'sm',
  className = ''
}) => {
  const base = "inline-flex items-center uppercase tracking-widest font-semibold border";
  
  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  const variants = {
    rust: "bg-sacred-rust/10 text-sacred-rust border-sacred-rust/40",
    gold: "bg-sacred-gold/15 text-sacred-gold border-sacred-gold/50",
    maroon: "bg-sacred-maroon/10 text-sacred-maroon border-sacred-maroon/40",
    stone: "bg-stone-200/60 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700",
    live: "bg-red-600 text-white border-red-700 animate-pulse",
    outline: "bg-transparent text-stone-800 dark:text-stone-200 border-stone-400 dark:border-stone-600",
  };

  return (
    <span className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

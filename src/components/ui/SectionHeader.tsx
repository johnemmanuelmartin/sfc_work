import React from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  align = 'left',
  action
}) => {
  return (
    <div className={`mb-10 md:mb-14 ${align === 'center' ? 'text-center max-w-3xl mx-auto' : ''}`}>
      <div className={`flex flex-col md:flex-row md:items-end justify-between gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
        <div>
          {eyebrow && (
            <div className="flex items-center gap-2 mb-2">
              <span className="w-6 h-[2px] bg-sacred-rust inline-block"></span>
              <span className="text-xs uppercase tracking-widest font-bold text-sacred-rust dark:text-sacred-gold">
                {eyebrow}
              </span>
            </div>
          )}
          <h2 className="font-display text-2xl md:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 uppercase">
            {title}
          </h2>
          {description && (
            <p className="mt-2 text-stone-600 dark:text-stone-300 text-sm md:text-base leading-relaxed max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}
      </div>
      <div className="mt-4 border-b border-stone-200 dark:border-stone-800"></div>
    </div>
  );
};

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      
      <div className={`relative w-full ${maxWidthStyles[maxWidth]} bg-sacred-cream dark:bg-sacred-espresso border-2 border-sacred-rust text-stone-900 dark:text-stone-100 shadow-sharp p-6 md:p-8 z-10 max-h-[90vh] overflow-y-auto`}>
        {/* Header */}
        <div className="flex items-start justify-between border-b border-stone-200 dark:border-stone-800 pb-4 mb-5">
          <div>
            <h3 className="font-display text-xl md:text-2xl font-bold text-stone-900 dark:text-white uppercase tracking-wide">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs md:text-sm text-stone-600 dark:text-stone-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 border border-stone-300 dark:border-stone-700 hover:border-sacred-rust dark:hover:border-sacred-rust text-stone-600 dark:text-stone-400 hover:text-sacred-rust dark:hover:text-sacred-rust transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

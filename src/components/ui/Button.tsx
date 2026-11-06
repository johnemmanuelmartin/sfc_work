import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'maroon';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium uppercase tracking-wider transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed select-none border";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs font-semibold",
    md: "px-5 py-2.5 text-xs md:text-sm font-semibold",
    lg: "px-7 py-3.5 text-sm md:text-base font-bold",
  };

  const variantStyles = {
    primary: "bg-stone-900 text-white border-stone-900 hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-950 dark:border-stone-100 dark:hover:bg-stone-200 active:translate-x-[1px] active:translate-y-[1px] shadow-sharp-sm",
    gold: "bg-sacred-gold text-stone-950 border-sacred-gold hover:bg-[#A38657] hover:text-white active:translate-x-[1px] active:translate-y-[1px] shadow-sharp-sm",
    secondary: "bg-stone-800 text-stone-100 border-stone-700 hover:bg-stone-700 shadow-sharp-sm active:translate-x-[1px] active:translate-y-[1px]",
    maroon: "bg-sacred-maroon text-white border-sacred-maroon hover:bg-[#381E1E] shadow-sharp-sm active:translate-x-[1px] active:translate-y-[1px]",
    outline: "bg-transparent text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:border-stone-600 dark:hover:border-stone-400 hover:text-stone-950 dark:hover:text-white shadow-sm",
    ghost: "bg-transparent border-transparent text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800/60",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

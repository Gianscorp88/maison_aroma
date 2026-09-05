'use client';

import React from 'react';

interface BrandLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'teal';
  size?: 'sm' | 'md' | 'lg';
}

export default function BrandLogo({ className = '', variant = 'teal', size = 'md' }: BrandLogoProps) {
  const textColor = variant === 'light' ? 'text-white' : variant === 'dark' ? 'text-brand-teal-deep' : 'text-brand-teal';
  const subtitleColor = variant === 'light' ? 'text-white/80' : variant === 'dark' ? 'text-brand-teal-deep/80' : 'text-brand-teal-deep';

  const textSizeClasses = {
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-4xl sm:text-5xl',
  }[size];

  const subtitleSizeClasses = {
    sm: 'text-[8px] tracking-[0.3em]',
    md: 'text-[9px] sm:text-[10px] tracking-[0.35em]',
    lg: 'text-[12px] tracking-[0.45em]',
  }[size];

  return (
    <div className={`inline-flex flex-col items-center select-none group ${className}`}>
      <span className={`font-serif font-semibold tracking-wide ${textSizeClasses} ${textColor} group-hover:opacity-90 transition-opacity leading-none`}>
        Maison Aroma
      </span>
      <span className={`uppercase font-medium ${subtitleSizeClasses} ${subtitleColor} mt-1`}>
        Profumi di Casa
      </span>
    </div>
  );
}

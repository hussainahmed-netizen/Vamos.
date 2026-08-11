import React from 'react';
import { useBrand } from '../context/BrandContext';

interface LogoContainerProps {
  variant?: 'light' | 'dark' | 'mark';
  size?: 'sm' | 'md' | 'lg' | 'custom';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const LogoContainer: React.FC<LogoContainerProps> = ({
  variant = 'light',
  size = 'md',
  showTagline = false,
  className = '',
  onClick,
}) => {
  const { brandConfig } = useBrand();

  const logoUrl =
    variant === 'dark'
      ? brandConfig.logo.darkUrl
      : variant === 'mark'
      ? brandConfig.logo.markUrl
      : brandConfig.logo.lightUrl;

  // Sizing map for crisp rendering
  const sizeClasses = {
    sm: 'h-7 sm:h-8',
    md: 'h-8 sm:h-9 md:h-10',
    lg: 'h-10 sm:h-12 md:h-14',
    custom: '',
  };

  const currentSizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none transition-opacity ${
        onClick ? 'cursor-pointer hover:opacity-90' : ''
      } ${className}`}
    >
      <div className="relative flex items-center justify-center shrink-0">
        <img
          src={logoUrl}
          alt={brandConfig.logo.altText || `${brandConfig.brandName} Logo`}
          referrerPolicy="no-referrer"
          className={`${currentSizeClass} w-auto object-contain transition-all duration-200`}
          onError={(e) => {
            // Fallback to text/SVG mark if image fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>

      {showTagline && (
        <div className="flex flex-col justify-center border-l border-slate-200/40 pl-2.5">
          <span className="text-xs font-bold tracking-tight text-slate-800 leading-none">
            {brandConfig.brandName}
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-0.5">
            {brandConfig.brandTagline}
          </span>
        </div>
      )}
    </div>
  );
};

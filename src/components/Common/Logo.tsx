import React from 'react';

interface LogoProps {
  size?: number | string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 24, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Dynamic Background Glow Layer */}
    <path 
      d="M 6 8 L 6 26 L 16 26 A 4 4 0 0 0 20 22 C 20 18 14 18 14 14 A 4 4 0 0 1 18 10 L 26 10" 
      stroke="currentColor" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="opacity-20 blur-[2px]"
    />
    
    {/* Core Geometric L + S Ribbon */}
    <path 
      d="M 6 8 L 6 26 L 16 26 A 4 4 0 0 0 20 22 C 20 18 14 18 14 14 A 4 4 0 0 1 18 10 L 26 10" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
    
    {/* Intelligent Core (AI Spark) nestled in the 'L' crook */}
    <path 
      d="M 11 11 Q 11 15 15 15 Q 11 15 11 19 Q 11 15 7 15 Q 11 15 11 11 Z" 
      fill="currentColor" 
    />

    {/* Angular Data Diamond Accent at the tail end of the 'S' */}
    <path 
      d="M 26 15 L 29 18 L 26 21 L 23 18 Z" 
      fill="currentColor" 
      className="opacity-90"
    />
  </svg>
);

export default Logo;

import React from 'react';
import { colorInterface } from './interface';

/**
 *  This component renders an SVG icon.
 * @param theme - The theme of the application, either 'light' or 'dark'. 
 * @returns 
 */
export const LightThemeSVG: React.FC<colorInterface> = ({ theme }) => {
  const color = theme === 'light' ? '#000000' : '#ffffff';
  return (
    <svg
      className="w-6 h-6"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5" />
      <path
        d="M12 2V3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 21V22"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M22 12L21 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M3 12L2 12"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M19.0708 4.92969L18.678 5.32252"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5.32178 18.6777L4.92894 19.0706"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M19.0708 19.0703L18.678 18.6775"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M5.32178 5.32227L4.92894 4.92943"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

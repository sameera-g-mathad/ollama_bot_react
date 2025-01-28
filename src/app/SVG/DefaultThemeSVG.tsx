import React from 'react';
import { colorInterface } from './interface';

export const DefaultThemeSVG: React.FC<colorInterface> = ({ theme }) => {
  const color = theme === 'light' ? '#000000' : '#ffffff';
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs></defs>
      <rect
        fill="none"
        stroke={color}
        strokeMiterlimit="10"
        strokeWidth="1.91px"
        x="1.5"
        y="1.5"
        width="21"
        height="16.23"
        rx="1.91"
      />
      {/* <polygon
        fill="none"
        stroke="#020202"
        strokeMiterlimit="10"
        strokeWidth="1.91px"
        points="15.82 22.5 8.18 22.5 9.14 17.73 14.86 17.73 15.82 22.5"
      /> */}
      <line
        fill="none"
        stroke={color}
        strokeMiterlimit="10"
        strokeWidth="1.91px"
        x1="5.32"
        y1="22.5"
        x2="18.68"
        y2="22.5"
      />
      <circle fill={color} cx="12" cy="14.86" r="0.95" />
    </svg>
  );
};

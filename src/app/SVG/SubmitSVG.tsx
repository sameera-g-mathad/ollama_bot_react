import React from 'react';

interface submitInterface {
  theme: string;
}

/**
 *  This component renders an SVG icon.
 * @param theme - The theme of the application, either 'light' or 'dark'. 
 * @returns 
 */
export const Submit: React.FC<submitInterface> = ({ theme }) => {
  return (
    <svg
      className="w-8 h-8"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        style={{ stroke: theme === 'light' ? 'black' : 'white' }}
        fill="none"
        // stroke="#000000"
        strokeWidth="2"
        d="M6,12.4 L18,12.4 M12.6,7 L18,12.4 L12.6,17.8"
      />
    </svg>
  );
};

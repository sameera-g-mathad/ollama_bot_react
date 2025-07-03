import React from 'react';
import { colorInterface } from './interface';

/**
 *  This component renders an SVG icon.
 * @param theme - The theme of the application, either 'light' or 'dark'. 
 * @returns 
 */
export const TrashSVG: React.FC<colorInterface> = ({ theme }) => {
  return (
    <svg viewBox="0 0 24 24" className='w-6 h-6' fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path fillRule="evenodd" clipRule="evenodd" d="M9 4.5V6H6V7.5H18V6H15V4.5H9ZM6.75 8.25H8.25V17.6893L8.56066 18H15.4393L15.75 17.6893V8.25H17.25V18.3107L16.0607 19.5H7.93934L6.75 18.3107V8.25Z" fill={theme === 'light' ? '#000000' : '#ffffff'}>
        </path>
      </g>
    </svg >
  );
};

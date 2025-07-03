import React from 'react';
import { colorInterface } from './interface';

/**
 *  This component renders an SVG icon.
 * @param theme - The theme of the application, either 'light' or 'dark'. 
 * @returns 
 */
export const SideBarSVG: React.FC<colorInterface> = ({ theme }) => {
    return (
        <svg viewBox="0 0 24 24" className="w-6 h-6"
            fill='none' xmlns="http://www.w3.org/2000/svg" transform="rotate(180)">

            <g id="SVGRepo_bgCarrier" strokeWidth="2" />

            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />

            <g id="SVGRepo_iconCarrier">
                <path d="M2 11C2 7.22876 2 5.34315 3.17157 4.17157C4.34315 3 6.22876 3 10 3H14C17.7712 3 19.6569 3 20.8284 4.17157C22 5.34315 22 7.22876 22 11V13C22 16.7712 22 18.6569 20.8284 19.8284C19.6569 21 17.7712 21 14 21H10C6.22876 21 4.34315 21 3.17157 19.8284C2 18.6569 2 16.7712 2 13V11Z" stroke={theme === 'light' ? '#000000' : '#ffffff'} strokeWidth="2" />
                <path d="M15 21L15 3" stroke={theme === 'light' ? '#000000' : '#ffffff'} strokeWidth="1.5" strokeLinecap="round" />
            </g>

        </svg>
    );
};
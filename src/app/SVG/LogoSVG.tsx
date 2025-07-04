import React from "react";
import { colorInterface } from './interface';

/**
 *  This component renders an SVG icon.
 * @param theme - The theme of the application, either 'light' or 'dark'. 
 * @param className - Optional CSS class name for additional styling.
 * @returns 
 */
export const LogoSVG: React.FC<colorInterface & { className?: string }> = ({ className, theme }) => {
    const fillColor = theme === 'light' ? '#000000' : '#ffffff'
    return <svg className={`w-8 h-8 ${className}`} viewBox="0 0 396 397" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M172.149 70.2228C172.149 55.9665 183.747 44.3714 198.001 44.3714C212.254 44.3714 223.852 55.9665 223.852 70.2228V124.032V128.559C223.852 152.794 243.5 172.441 267.734 172.441V128.559V70.2228C267.734 31.7718 236.452 0.494773 198.001 0.494773C159.55 0.494773 128.267 31.7718 128.267 70.2228V118.169H172.149V70.2228Z" fill={fillColor} />
        <path d="M326.06 172.431C340.314 172.431 351.912 184.026 351.912 198.282C351.912 212.536 340.314 224.134 326.06 224.134H272.251H267.724C243.489 224.134 223.842 243.778 223.842 268.013H267.724H326.06C364.511 268.013 395.791 236.73 395.791 198.282C395.791 159.831 364.511 128.548 326.06 128.548H278.114V172.431H326.06Z" fill={fillColor} />
        <path d="M223.852 326.339C223.852 340.595 212.254 352.193 198.001 352.193C183.747 352.193 172.149 340.595 172.149 326.339V272.53V268.003C172.149 243.768 152.502 224.123 128.267 224.123V268.003V326.339C128.267 364.793 159.55 396.073 198.001 396.073C236.452 396.073 267.734 364.793 267.734 326.339V278.396H223.852V326.339Z" fill={fillColor} />
        <path d="M69.941 224.134C55.6875 224.134 44.0895 212.536 44.0895 198.282C44.0895 184.026 55.6875 172.431 69.941 172.431H123.75H128.277C152.512 172.431 172.159 152.783 172.159 128.548H128.277H69.941C31.4928 128.548 0.208939 159.831 0.208939 198.282C0.208939 236.73 31.4928 268.013 69.941 268.013H117.887V224.134H69.941Z" fill={fillColor} />
        <defs>
            <linearGradient id="paint0_linear_202_6" x1="128.267" y1="172.441" x2="128.267" y2="0.460441" gradientUnits="userSpaceOnUse">
                <stop />
            </linearGradient>
            <linearGradient id="paint1_linear_202_6" x1="128.267" y1="396.073" x2="128.267" y2="224.092" gradientUnits="userSpaceOnUse">
                <stop offset="1" />
            </linearGradient>
        </defs>
    </svg>
};


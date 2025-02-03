import React, { useContext, useState } from 'react';
import ThemeContext from '../Context/ThemeContext';
import logo from './../../../public/Logo.png';
// import Image from 'next/image';
import { SettingSVG } from '../SVG';
import { Settings } from './index';

export const Header: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const [settingClicked, setSetting] = useState<boolean>(false);
  return (
    <div className="flex justify-between items-center mx-4">
      <img
        className="w-10 h-10 border rounded-full"
        src={logo.src}
        alt="image"
      />
      <button onClick={() => setSetting((prevState) => !prevState)}>
        <SettingSVG theme={theme} />
      </button>

      <Settings clicked={settingClicked} />
    </div>
  );
};

Header.displayName = 'Header';

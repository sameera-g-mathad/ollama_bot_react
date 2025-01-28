import React, { useContext, useState } from 'react';
import ThemeContext from '../Context/ThemeContext';
import {
  DarkThemeSVG,
  DefaultThemeSVG,
  LightThemeSVG,
  SettingSVG,
} from '../SVG';
export const Header: React.FC = () => {
  const { theme, changeTheme } = useContext(ThemeContext);
  const [setting, setSetting] = useState<boolean>(false);
  return (
    <div className="flex justify-between items-center mx-4">
      <p>Bot</p>
      <button onClick={() => setSetting((prevState) => !prevState)}>
        <SettingSVG theme={theme} />
      </button>
      <div
        className={`w-44 h-40 absolute border shadow-md  shadow-neutral-100 rounded-lg right-2 top-10 ${
          theme === 'light' ? 'bg-white' : 'bg-gray-700'
        } ${setting ? 'visible' : 'hidden'}`}
      >
        <div className="flex">
          <button onClick={() => changeTheme('light')} className="p-1">
            <LightThemeSVG theme={theme} />
          </button>
          <button onClick={() => changeTheme('dark')} className="p-1">
            <DarkThemeSVG theme={theme} />
          </button>
          <button onClick={() => changeTheme('system')} className="p-1">
            <DefaultThemeSVG theme={theme} />
          </button>
        </div>
      </div>
    </div>
  );
};

Header.displayName = 'Header';

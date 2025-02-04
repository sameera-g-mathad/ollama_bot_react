import React, { useContext, useEffect, useState } from 'react';
import ThemeContext from '../Context/ThemeContext';
import logo from './../../../public/Logo.png';
import ChatContext from '../Context/ChatContext';
import { SettingSVG } from '../SVG';
import { Settings } from './index';

export const Header: React.FC = () => {
  const { theme } = useContext(ThemeContext);
  const { listModels } = useContext(ChatContext);

  useEffect(() => {
    listModels();
  });
  const [settingClicked, setSetting] = useState<boolean>(false);

  return (
    <div className="flex justify-between items-center mx-4">
      <img
        className="w-10 h-10 border rounded-full"
        src={logo.src}
        alt="image"
      />
      <div className="flex w-32 items-center justify-between">
        <div>Hello</div>
        <button onClick={() => setSetting((prevState) => !prevState)}>
          <SettingSVG theme={theme} />
        </button>

        <Settings clicked={settingClicked} />
      </div>
    </div>
  );
};

Header.displayName = 'Header';

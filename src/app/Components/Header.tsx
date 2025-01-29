import React, { useContext, useState } from 'react';
import ThemeContext from '../Context/ThemeContext';
import {
  DarkThemeSVG,
  DefaultThemeSVG,
  LightThemeSVG,
  SettingSVG,
} from '../SVG';
import { Button, ButtonGroup } from './index';

export const Header: React.FC = () => {
  const { theme, changeTheme, changeTextSize } = useContext(ThemeContext);
  const [setting, setSetting] = useState<boolean>(false);
  return (
    <div className="flex justify-between items-center mx-4">
      <p>Bot</p>
      <button onClick={() => setSetting((prevState) => !prevState)}>
        <SettingSVG theme={theme} />
      </button>
      <div
        className={`w-44  absolute border shadow-sm  shadow-neutral-100 rounded-lg right-2 top-10 ${
          theme === 'light' ? 'bg-white' : 'bg-gray-700'
        } ${setting ? 'visible' : 'hidden'}`}
      >
        <ButtonGroup>
          <Button callback={() => changeTheme('light')}>
            <LightThemeSVG theme={theme} />
          </Button>
          <Button callback={() => changeTheme('dark')}>
            <DarkThemeSVG theme={theme} />
          </Button>
          <Button callback={() => changeTheme('system')}>
            <DefaultThemeSVG theme={theme} />
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button callback={() => changeTextSize('text-sm')}>
            <span className="text-xs">aA</span>
          </Button>
          <Button callback={() => changeTextSize('text-base')}>
            <span className="text-base">aA</span>
          </Button>
          <Button callback={() => changeTextSize('text-lg')}>
            <span className="text-lg">aA</span>
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

Header.displayName = 'Header';

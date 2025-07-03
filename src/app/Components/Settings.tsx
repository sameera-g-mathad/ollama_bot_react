import React, { useContext } from 'react';
import ThemeContext from '../Context/ThemeContext';
import { Button, ButtonGroup } from './index';
import { DarkThemeSVG, DefaultThemeSVG, LightThemeSVG } from '../SVG';

interface settingInterface {
  clicked: boolean;
}

/**
 * 
 * @param clickedd - A boolean indicating whether the settings menu is visible or not.
 * This component renders a settings menu that allows users to change the theme and text size.
 * It includes buttons for light, dark, and system themes, as well as options for different
 * text sizes (small, medium, large). 
 * @returns 
 */
export const Settings: React.FC<settingInterface> = ({ clicked }) => {
  const { theme, changeTheme, changeTextSize } = useContext(ThemeContext);
  return (
    <div
      className={`w-44 absolute border shadow-sm  shadow-neutral-100 rounded-lg right-3 top-12 ${theme === 'light' ? 'bg-white' : 'bg-gray-700'
        } ${clicked ? 'visible' : 'hidden'}`}
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
        <Button callback={() => changeTextSize('text-xs')}>
          <span className="text-xs">aA</span>
        </Button>
        <Button callback={() => changeTextSize('text-sm')}>
          <span className="text-sm">aA</span>
        </Button>
        <Button callback={() => changeTextSize('text-base')}>
          <span className="text-base">aA</span>
        </Button>
      </ButtonGroup>
    </div>
  );
};

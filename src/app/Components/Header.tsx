import React, { memo, useContext, useEffect, useState } from 'react';
import ThemeContext from '../Context/ThemeContext';
import ChatContext from '../Context/ChatContext';
import { LogoSVG, NewChatSVG, SettingSVG, SideBarSVG } from '../SVG';
import { Button, SelectModels, Settings, SideBar } from './index';

/**
 * This component renders the header of the application.
 * It includes the logo, buttons for new chat and settings, and a sidebar.
 * The header is styled to be responsive and adjusts based on the theme.
 * @returns A React component that displays the header of the application.
 */
export const Header: React.FC = memo(() => {
  const { theme } = useContext(ThemeContext);
  const { listModels, newChat } = useContext(ChatContext);

  useEffect(() => {
    listModels();
  }, []);
  const [settingClicked, setSetting] = useState<boolean>(false);
  const [sidebarClicked, setSidebar] = useState<boolean>(false);

  return (
    <div className="flex justify-between items-center mx-4">
      <div className='flex items-center justify-between sm:gap-5 gap-2 z-10'>
        <LogoSVG theme={theme} />
        <Button callback={() => setSidebar((prevState) => !prevState)}>
          <SideBarSVG theme={theme} />
        </Button>
        <Button callback={() => newChat()}>
          <NewChatSVG theme={theme} />
        </Button>
      </div>
      <SideBar isOpen={sidebarClicked} />
      <SelectModels />
      <Button callback={() => setSetting((prevState) => !prevState)}>
        <SettingSVG theme={theme} />
      </Button>
      <Settings clicked={settingClicked} />
    </div>
  );
});

Header.displayName = 'Header';

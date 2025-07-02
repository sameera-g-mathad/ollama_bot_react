import React, { memo, useContext, useEffect, useState } from 'react';
import ThemeContext from '../Context/ThemeContext';
import logo from './../../../public/MainLogo.png';
import ChatContext from '../Context/ChatContext';
import { LogoSVG, NewChatSVG, SettingSVG, SideBarSVG } from '../SVG';
import { Button, SelectModels, Settings, SideBar } from './index';

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
        {/* <img
          className="w-10 h-10 border rounded-full"
          src={logo.src}
          alt="image"
        /> */}
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

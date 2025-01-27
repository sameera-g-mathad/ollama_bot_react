import React, { useContext, useState } from 'react';
import ThemeContext from '../Context/ThemeContext';
export const Header: React.FC = () => {
  const { changeTheme } = useContext(ThemeContext);
  const [setting, setSetting] = useState<boolean>(false);
  return (
    <div className="flex justify-between items-center mx-4">
      <p>Bot</p>
      <button onClick={() => setSetting((prevState) => !prevState)}>
        Settings
      </button>
      <div
        className={`w-44 h-40 absolute border shadow-md  shadow-neutral-100 rounded-lg right-2 top-10 ${
          setting ? 'visible' : 'hidden'
        }`}
      >
        <div className="flex">
          <button onClick={() => changeTheme('light')} className="p-1">
            1
          </button>
          <button onClick={() => changeTheme('dark')} className="p-1">
            2
          </button>
          <button onClick={() => changeTheme('system')} className="p-1">
            3
          </button>
        </div>
      </div>
    </div>
  );
};

Header.displayName = 'Header';

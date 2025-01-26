import React, { useContext } from 'react';
import ThemeContext from '../Context/ThemeContext';
export const Header: React.FC = () => {
  const { changeTheme } = useContext(ThemeContext);
  return (
    <div className="flex justify-between items-center mx-4">
      <p>Bot</p>
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
  );
};

Header.displayName = 'Header';

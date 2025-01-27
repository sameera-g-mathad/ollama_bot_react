import React, { createContext, useState } from 'react';

interface childProps {
  children: React.ReactElement;
}

interface themeInterface {
  theme: string;
  changeTheme: (theme: string) => void;
}

const ThemeContext = createContext<themeInterface>({
  theme: 'system',
  changeTheme: () => {},
});

export const ThemeContextProvider: React.FC<childProps> = ({ children }) => {
  const [theme, setTheme] = useState<string>('light');
  const changeTheme = (theme: string) => {
    if (['light', 'dark', 'system'].includes(theme)) {
      if (theme === 'system') {
        if (window.matchMedia('(prefers-color-scheme: dark)').matches)
          setTheme('dark');
        else setTheme('light');
      } else setTheme(theme);
    }
  };
  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

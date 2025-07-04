'use client';
import React, { createContext, useEffect, useReducer } from 'react';

interface childProps {
  children: React.ReactElement;
}

interface themeInterface {
  theme: string;
  textSize: string;
  changeTheme: (theme: string) => void;
  changeTextSize: (size: string) => void;
}

const ThemeContext = createContext<themeInterface>({
  theme: 'system',
  textSize: 'text-md',
  changeTheme: () => { },
  changeTextSize: () => { },
});

const themeReducer = (
  state: { theme: string; textSize: string },
  payload: { action: string; value: string }
) => {
  switch (payload.action) {
    case 'themeChange':
      localStorage.setItem('theme', payload.value)
      return { ...state, theme: payload.value };
    case 'textSizeChange':
      localStorage.setItem('textSize', payload.value)
      return { ...state, textSize: payload.value };
    default:
      return state;
  }
};

export const ThemeContextProvider: React.FC<childProps> = ({ children }) => {
  // I added useEffect here, since I was getting an error that LocalStorage is not defined,
  // by Next.js.
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const savedTextSize = localStorage.getItem('textSize');
    dispatch({ action: 'themeChange', value: savedTheme || 'light' });
    dispatch({ action: 'textSizeChange', value: savedTextSize || 'text-xs' });
  }, []);
  const [state, dispatch] = useReducer(themeReducer, {
    theme: 'light',
    textSize: 'text-sm',
  });
  // This is a reference to the current theme, so that we can use it in the components.
  const changeTheme = (theme: string) => {
    if (['light', 'dark', 'system'].includes(theme)) {
      if (theme === 'system')
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      dispatch({ action: 'themeChange', value: theme });
    }
  };
  // This is a reference to the current text size, so that we can use it in the components.
  const changeTextSize = (size: string) => {
    dispatch({ action: 'textSizeChange', value: size });
  };


  return (
    <ThemeContext.Provider
      value={{
        ...state,
        changeTheme,
        changeTextSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

ThemeContextProvider.displayName = 'ThemeContextProvider'

export default ThemeContext;

import React, { createContext, useState, useReducer } from 'react';

interface childProps {
  children: React.ReactElement;
}

interface themeInterface {
  theme: string;
  textSize: string;
  // lineHeight: string;
  changeTheme: (theme: string) => void;
  changeTextSize: (size: string) => void;
  // changeLineHeight: (size: string) => void;
}

const ThemeContext = createContext<themeInterface>({
  theme: 'system',
  textSize: 'text-md',
  // lineHeight: '',
  changeTheme: () => {},
  changeTextSize: () => {},
  // changeLineHeight: () => {},
});

const themeReducer = (
  state: { theme: string; textSize: string },
  payload: { action: string; value: string }
) => {
  switch (payload.action) {
    case 'themeChange':
      return { ...state, theme: payload.value };
    case 'textSizeChange':
      return { ...state, textSize: payload.value };
    // case 'lineHeight':
    //   return { ...state, lineHeight: payload.value };
    default:
      return state;
  }
};

export const ThemeContextProvider: React.FC<childProps> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, {
    theme: 'system',
    textSize: 'text-base',
    // lineHeight: 'leading-6',
  });
  const changeTheme = (theme: string) => {
    if (['light', 'dark', 'system'].includes(theme)) {
      dispatch({ action: 'themeChange', value: theme });
    }
  };
  const changeTextSize = (size: string) => {
    dispatch({ action: 'textSizeChange', value: size });
  };

  const changeLineHeight = (size: string) => {
    dispatch({ action: 'lineHeight', value: size });
  };

  return (
    <ThemeContext.Provider
      value={{
        ...state,
        theme:
          state.theme === 'system'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
              ? 'dark'
              : 'light'
            : state.theme,
        changeTheme,
        changeTextSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;

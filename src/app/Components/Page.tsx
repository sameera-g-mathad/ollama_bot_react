import React, { useContext } from 'react';
import { Footer, Header } from './index';
import ThemeContext from '../Context/ThemeContext';

interface childProps {
  children: React.ReactNode;
}

export const Page: React.FC<childProps> = ({ children }) => {
  const { theme, textSize } = useContext(ThemeContext);
  return (
    <div
      className={`page font-sans ${theme === 'light' ? 'bg-white' : 'bg-gray-700'} ${theme === 'light' ? 'text-gray-700' : 'text-white'
        } ${textSize}`}
    >
      <Header />
      {children}
      <Footer />
    </div>
  );
};

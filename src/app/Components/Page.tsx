import React, { useContext } from 'react';
import { Body, Footer, Header } from './index';
import ThemeContext from '../Context/ThemeContext';

export const Page: React.FC = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`page ${theme === 'light' ? 'bg-white' : 'bg-gray-700'} ${
        theme === 'light' ? 'text-gray-700' : 'text-white'
      }`}
    >
      <Header />
      <Body />
      <Footer />
    </div>
  );
};

import React, { useContext } from 'react';
import { Footer, Header } from './index';
import ThemeContext from '../Context/ThemeContext';

interface childProps {
  children: React.ReactNode;
}

/**
 * This component serves as the main layout for the application.
 * It includes a header, footer, and a content area where child components can be rendered.
 * The layout adjusts based on the current theme and text size from the ThemeContext.
 * @param children The child components to be rendered inside the page.
 * @returns A React component that displays the page layout with header, footer, and content area.
 */
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

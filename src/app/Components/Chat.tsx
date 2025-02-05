import React, { useContext } from 'react';
import ThemeContext from '../Context/ThemeContext';
interface childProps {
  children: React.ReactElement;
  generatedBy: boolean;
}

export const Chat: React.FC<childProps> = ({ children, generatedBy }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={`p-1 my-2 ${
        generatedBy ? (theme == 'light' ? 'bg-gray-100' : 'bg-gray-800') : ''
      }`}
    >
      {children}
    </div>
  );
};

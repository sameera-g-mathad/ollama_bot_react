import React from 'react';

interface buttonProps {
  children: React.ReactNode;
  callback: () => void;
}

/**
 * 
 * @param children - The content to be displayed inside the button.
 * @param callback - The function to be called when the button is clicked.
 * @returns 
 */
export const Button: React.FC<buttonProps> = ({ children, callback }) => {
  return (
    <div
      className="w-8 h-8 flex justify-center items-center rounded-lg cursor-pointer"
      onClick={callback}
    >
      {children}
    </div>
  );
};

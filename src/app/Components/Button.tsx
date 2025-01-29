import React from 'react';

interface buttonProps {
  children: React.ReactNode;
  callback: () => void;
}

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

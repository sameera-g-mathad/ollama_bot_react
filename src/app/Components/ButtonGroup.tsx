import React from 'react';

interface childProps {
  children: React.ReactNode;
}

export const ButtonGroup: React.FC<childProps> = ({ children }) => {
  return (
    <div className="flex border p-1 m-3 justify-around items-center rounded-lg">
      {children}
    </div>
  );
};

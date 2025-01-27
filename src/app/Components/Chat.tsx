import React from 'react';

interface childProps {
  children: React.ReactElement;
}

export const Chat: React.FC<childProps> = ({ children }) => {
  return <div className="p-1 my-2">{children}</div>;
};

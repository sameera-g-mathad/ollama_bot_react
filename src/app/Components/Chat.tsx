import React from 'react';

interface childProps {
  children: React.ReactElement;
}

export const Chat: React.FC<childProps> = ({ children }) => {
  return <div>{children}</div>;
};

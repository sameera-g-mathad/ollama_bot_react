import React from 'react';

interface childProps {
  children: React.ReactNode;
}

/**
 * This component renders a button group with a flex layout.
 * It is styled with a border, padding, margin, and rounded corners.
 * @param children The children to be rendered inside the button group. 
 * @returns 
 */
export const ButtonGroup: React.FC<childProps> = ({ children }) => {
  return (
    <div className="flex border p-1 m-3 justify-around items-center rounded-lg">
      {children}
    </div>
  );
};

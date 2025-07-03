import React, { useState } from 'react';
import { PlusSVG } from '../SVG';

interface searchInterface {
  theme: string;
  callback: (modelName: string) => void;
}

/**
 * This component renders a search bar for model names.
 */
export const SearchBar: React.FC<searchInterface> = ({ theme, callback }) => {
  const [model, setModelName] = useState<string>('');
  return (
    <div className="flex justify-between items-center h-16 rounded-lg">
      <input
        className="w-full h-10 bg-transparent border rounded-lg focus:outline-none pl-4 m-4"
        placeholder="Search Models"
        onChange={(e) => setModelName(e.target.value)}
      />
      <button
        className="pr-4 mr-4 rounded-full"
        onClick={() => callback(model)}
      >
        <PlusSVG theme={theme} />
      </button>
    </div>
  );
};

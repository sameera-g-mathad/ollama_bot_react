import React, { useContext, useState } from 'react';
import ChatContext from '../Context/ChatContext';
import { Submit } from '../SVG';
import ThemeContext from '../Context/ThemeContext';

export const TextBox = () => {
  const [query, setQuery] = useState<string>('');
  const { requestQuery } = useContext(ChatContext);
  const { theme } = useContext(ThemeContext);
  return (
    <div className="flex flex-col w-full sm:w-3/6 h-26 border shadow-md shadow-neutral-300 mt-2 rounded-xl">
      <span className="flex flex-col justify-center p-2 h-full">
        <textarea
          className="border rounded-lg shadow-sm shadow-neutral-100 outline-none flex pt-2 pl-2 resize-none max-h-32 bg-transparent"
          placeholder="Type.."
          value={query}
          onChange={(e) => {
            if ((e.target.value, e.target.value !== '\n'))
              setQuery(e.target.value);
            else {
              setQuery('');
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              requestQuery(query);
              setQuery('');
            }
          }}
        />
        <span className="py-1 flex justify-end">
          <button
            className="text-neutral-300"
            onClick={() => {
              requestQuery(query);
              setQuery('');
            }}
          >
            <Submit theme={theme} />
          </button>
        </span>
      </span>
    </div>
  );
};

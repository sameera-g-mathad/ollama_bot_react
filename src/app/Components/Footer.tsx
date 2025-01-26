'use client';
import React, { useContext, useState } from 'react';
import ChatContext from '../Context/ChatContext';
export const Footer: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const { requestQuery } = useContext(ChatContext);
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col w-full sm:w-3/6 h-26 border rounded-xl">
        <span className="flex flex-col justify-center p-2 h-full">
          <textarea
            className="border rounded-lg outline-none flex pt-2 pl-2 resize-none max-h-32"
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
          <span className="py-1  flex justify-end">
            <button className="bg-yellow-500">submit</button>
          </span>
        </span>
      </div>
    </div>
  );
};

Footer.displayName = 'Footer';

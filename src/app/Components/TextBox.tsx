import React, { useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatContext from '../Context/ChatContext';
import { Submit } from '../SVG';
import ThemeContext from '../Context/ThemeContext';

/**
 * This component renders a text box for user input in the chat application.
 * It allows users to type their queries, submit them by pressing Enter or clicking the submit button,
 * and automatically adjusts the height of the text area based on the content.
 * The text box is styled based on the current theme (light or dark).
 * @returns A React component that renders a text box for user input.
 */
export const TextBox = () => {
  const router = useRouter()
  const [query, setQuery] = useState<string>('');
  const [textheight, setTextHeight] = useState<number>(30);
  const { requestQuery } = useContext(ChatContext);
  const { theme } = useContext(ThemeContext);
  return (
    <div
      className={` ${theme === 'light' ? 'bg-white' : 'bg-gray-700'
        } flex flex-col w-full sm:w-1/2 border shadow-sm shadow-neutral-300 rounded-xl`}
    >
      <span className="flex justify-start items-center p-2">
        <textarea
          style={{ height: `${textheight}px` }}
          className="outline-none w-full pl-2 resize-none bg-transparent "
          placeholder="Ask Anything..."
          value={query}
          onChange={(e) => {
            if ((e.target.value, e.target.value !== '\n')) {
              setQuery(e.target.value);
              setTextHeight(() =>
                e.target.scrollHeight < 100 ? e.target.scrollHeight : 100
              );
            } else {
              setQuery('');
              setTextHeight(30);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              requestQuery(query);
              setQuery('')
            }
          }}
        />
        <span className="py-1 flex justify-end">
          <button
            className="text-neutral-300"
            onClick={() => {
              requestQuery(query);
              setQuery('')
            }
            }
          >
            {/* <span className={`${theme} text-3xl p-1 mr-1`}>+</span> */}
            <Submit theme={theme} />
          </button>
        </span>
      </span>
    </div>
  );
};

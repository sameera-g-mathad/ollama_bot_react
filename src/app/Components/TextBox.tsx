import React, { useContext, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import ChatContext from '../Context/ChatContext';
import { Submit } from '../SVG';
import ThemeContext from '../Context/ThemeContext';
import { randomUUID } from '../Utils';

export const TextBox = () => {
  const router = useRouter()
  const [query, setQuery] = useState<string>('');
  const [textheight, setTextHeight] = useState<number>(30);
  const { requestQuery } = useContext(ChatContext);
  const { theme } = useContext(ThemeContext);
  const onClick = () => {
    const uuid = randomUUID()
    // router.push(`chats/${uuid}`)
    requestQuery(query, uuid);
    setQuery('')
  }
  return (
    <div
      className={` ${theme === 'light' ? 'bg-white' : 'bg-gray-700'
        } flex flex-col w-full sm:w-1/2 border shadow-sm shadow-neutral-300 rounded-xl`}
    >
      <span className="flex justify-start items-center p-2">
        <textarea
          style={{ height: `${textheight}px` }}
          className="outline-none w-full pl-2 resize-none bg-transparent "
          placeholder="Ask anything..."
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
            if (e.key === 'Enter') onClick();
          }}
        />
        <span className="py-1 flex justify-end">
          <button
            className="text-neutral-300"
            onClick={() => onClick()}
          >
            {/* <span className={`${theme} text-3xl p-1 mr-1`}>+</span> */}
            <Submit theme={theme} />
          </button>
        </span>
      </span>
    </div>
  );
};

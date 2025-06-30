import React, { useContext, useRef, useEffect, memo } from 'react';
import { Chat } from './Chat';
import ChatContext from '../Context/ChatContext';

export const Body: React.FC = memo(() => {
  const { chatMessages } = useContext(ChatContext);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);
  return (
    <div
      ref={scrollRef}
      className="flex justify-center overflow-y-scroll leading-7"
    >
      <div className=" sm:w-1/2 w-full">
        {
          chatMessages.map((el, index) => {
            return <Chat key={index} role={el.role} content={el.content} />
          })
        }
      </div>
    </div>
  );
});

Body.displayName = 'Body';

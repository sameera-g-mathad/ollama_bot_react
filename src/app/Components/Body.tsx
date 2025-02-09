import React, { useContext, useRef, useEffect } from 'react';
import ChatContext from '../Context/ChatContext';

export const Body: React.FC = () => {
  const { chatHistory } = useContext(ChatContext);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatHistory]);
  return (
    <div
      ref={scrollRef}
      className="flex justify-center overflow-y-scroll leading-7"
    >
      <div className=" sm:w-1/2 w-full">
        {chatHistory.map((el, i) => (
          <div key={i}>{el}</div>
        ))}
      </div>
    </div>
  );
};

Body.displayName = 'Body';

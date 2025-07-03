import React, { useContext, useRef, useEffect, memo } from 'react';
import { Chat } from './Chat';
import ChatContext from '../Context/ChatContext';
import { LogoSVG } from '../SVG';
import ThemeContext from '../Context/ThemeContext';

/**
 * This component renders the chat content area.
 * It displays a list of chat messages and scrolls to the bottom when new messages are added.
 * If there are no messages, it shows a welcome message with the logo.
 * @returns A React component that displays the chat content.
 */
export const Content: React.FC = memo(() => {
  const { theme } = useContext(ThemeContext)
  const { chatMessages } = useContext(ChatContext);
  const scrollRef = useRef<HTMLDivElement>(null);
  // This ref is used to scroll the chat messages container to the bottom when new messages are added.
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
        { // If there are chat messages, map through them and render each Chat component.
          // Otherwise, display a welcome message with the logo.
          chatMessages.length > 0 ?
            chatMessages.map((el, index) => {
              return <Chat key={index} role={el.role} content={el.content} />
            })
            :
            <div className='w-full h-full flex justify-center items-center'>
              <div className='w-full h-1/2 flex flex-col items-center gap-5'>
                <LogoSVG theme={theme} className='sm:!w-20 sm:!h-20 !w-16 !h-16' />
                <span className='font-bold text-2xl tracking-widest'>Ollama Bot</span>

              </div>
            </div>
        }
      </div>
    </div>
  );
});

Content.displayName = 'Content';

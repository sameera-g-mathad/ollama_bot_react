import React, { memo, useContext } from 'react';
import { chatMessage } from '../Context/ChatContext';
import ThemeContext from '../Context/ThemeContext';
import { LogoSVG } from '../SVG';


export const Chat: React.FC<chatMessage> = memo(({ role, content }) => {
  const { theme } = useContext(ThemeContext);
  if (role === 'user') return <UserChat content={content} />
  return <AssistantChat content={content} />
});

interface contentInterface {
  content: string;
}

const AssistantChat: React.FC<contentInterface> = memo(({ content }) => {
  const { theme } = useContext(ThemeContext)
  return <div className="flex items-end gap-3 p-3 mt-2">
    <div><LogoSVG theme={theme} className='!w-5 !h-5' /></div>
    <div
      className="border-none whitespace-pre-line"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  </div>
})

const UserChat: React.FC<contentInterface> = memo(({ content }) => {
  return <div className="flex justify-end">
    <span
      className="border flex rounded-xl p-1 px-3"
      style={{ maxWidth: '70%' }}
    >
      {content}
    </span>
  </div>
});
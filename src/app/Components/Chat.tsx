import React, { memo, useContext } from 'react';
import { chatMessage } from '../Context/ChatContext';
import ThemeContext from '../Context/ThemeContext';


export const Chat: React.FC<chatMessage> = memo(({ role, content }) => {
  const { theme } = useContext(ThemeContext);
  if (role === 'user') return <UserChat content={content} />
  return <AssistantChat content={content} />
});

interface contentInterface {
  content: string;
}

const AssistantChat: React.FC<contentInterface> = memo(({ content }) => {
  return <div className="flex">
    <div
      className="border-none rounded-xl p-3 whitespace-pre-line"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  </div>
})

const UserChat: React.FC<contentInterface> = memo(({ content }) => {
  return <div className="flex justify-end">
    <span
      className="border rounded-xl p-1 px-3"
      style={{ maxWidth: '70%' }}
    >
      {content}
    </span>
  </div>
});
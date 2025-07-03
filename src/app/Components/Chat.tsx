import React, { memo, useContext } from 'react';
import { chatMessage } from '../Context/ChatContext';
import ThemeContext from '../Context/ThemeContext';
import { LogoSVG } from '../SVG';

/**
 * This component renders a chat message based on the role of the sender.
 * If the role is 'user', it renders a UserChat component, otherwise it renders an AssistantChat component.
 * @param role The role of the sender, either 'user' or 'assistant'.
 * @param content The content of the chat message.
 * @returns A React component that displays the chat message.
 */
export const Chat: React.FC<chatMessage> = memo(({ role, content }) => {
  // const { theme } = useContext(ThemeContext);
  if (role === 'user') return <UserChat content={content} />
  return <AssistantChat content={content} />
});

Chat.displayName = 'Chat'

interface contentInterface {
  content: string;
}

/**
 * This component renders a chat message from the assistant.
 * It displays the assistant's logo and the content of the message.
 * @param content The content of the chat message.
 * @returns A React component that displays the assistant's chat message.
 */
const AssistantChat: React.FC<contentInterface> = memo(({ content }) => {
  const { theme } = useContext(ThemeContext)
  return <div className="flex items-end gap-3 p-3 mt-2">
    <div className='pb-1'><LogoSVG theme={theme} className='!w-5 !h-5' /></div>
    <div
      className="border-none whitespace-pre-line"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  </div>
})

AssistantChat.displayName = 'AssistantChat'

/**
 * This component renders a chat message from the user.
 * It displays the content of the user's message in a styled span.
 * @param content The content of the chat message.
 * @returns A React component that displays the user's chat message.
 */
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

UserChat.displayName = 'UserChat'
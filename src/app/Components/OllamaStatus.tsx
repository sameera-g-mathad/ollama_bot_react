import React, { useContext } from 'react';
import ChatContext from '../Context/ChatContext';
import { OllamaLogoSVG } from '../SVG';

/**
 * This component displays the status of the Ollama connection.
 * It shows a green background when connected and ready, and a red background when there is a connection issue.
 * The status message is displayed in the center of the component.
 * @returns A React component that renders the Ollama status.
 */
export const OllamaStatus: React.FC = () => {
  const { isRunning } = useContext(ChatContext);
  return (
    <div
      className={`w-full h-5 mt-2 text-sm z-10 flex justify-center rounded-t text-white ${isRunning ? 'bg-green-500' : 'bg-red-500'
        }`}
    >
      {
        isRunning ?
          <span className='flex gap-1'>
            <OllamaLogoSVG theme='light' />
            <span>Connected to Ollama — Ready to chat!</span>
          </span> :
          <span>🚫 Connection issue detected. Try refreshing or checking Ollama status. <span>In case of CORS related issue, click <a className='text-blue-500' href='https://objectgraph.com/blog/ollama-cors/'>here.</a></span></span>
      }
    </div>
  );
};

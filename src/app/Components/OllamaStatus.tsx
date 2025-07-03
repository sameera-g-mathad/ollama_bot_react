import React, { useContext } from 'react';
import ChatContext from '../Context/ChatContext';
import { OllamaLogoSVG } from '../SVG';
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
          <span>🚫 Connection issue detected. Try refreshing or checking Ollama status.</span>
      }
    </div>
  );
};

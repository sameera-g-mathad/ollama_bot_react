import React, { useContext } from 'react';
import ChatContext from '../Context/ChatContext';
export const OllamaStatus: React.FC = () => {
  const { isRunning } = useContext(ChatContext);
  const response = isRunning ? 'Ollama Running!!!' : 'Check your connection';

  return (
    <div
      className={`w-full h-5 mt-2 text-sm  flex justify-center rounded-t text-white ${isRunning ? 'bg-green-500' : 'bg-red-500'
        }`}
    >
      {response}
    </div>
  );
};

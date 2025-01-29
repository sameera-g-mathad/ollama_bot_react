import React, { useContext } from 'react';
import ChatContext from '../Context/ChatContext';
export const OllamaStatus: React.FC = () => {
  const { isRunning } = useContext(ChatContext);
  const response = isRunning ? 'Ollama Running!!!' : 'Check your connection';

  return (
    <div
      className={`w-full mt-2 text-sm h-full flex justify-center rounded-t text-white ${
        isRunning ? 'bg-green-400' : 'bg-red-400'
      }`}
    >
      {response}
    </div>
  );
};

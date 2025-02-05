import React, { useContext } from 'react';
import ChatContext from '../Context/ChatContext';

export const Body: React.FC = () => {
  const { chatHistory } = useContext(ChatContext);
  return (
    <div className="flex justify-center overflow-y-scroll leading-7">
      <div className=" sm:w-1/2 w-full">
        {chatHistory.map((el, i) => (
          <div key={i}>{el}</div>
        ))}
      </div>
    </div>
  );
};

Body.displayName = 'Body';

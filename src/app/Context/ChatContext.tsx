import React, { createContext } from 'react';

interface chatInterface {
  requestQuery: (query: string) => void;
}

interface childProps {
  children: React.ReactElement;
}

const ChatContext = createContext<chatInterface>({
  requestQuery: (query: string) => false,
});

export const ChatContextProvider: React.FC<childProps> = ({ children }) => {
  const requestQuery = (query: string) => {
    console.log(query);
  };
  return (
    <ChatContext.Provider value={{ requestQuery }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;

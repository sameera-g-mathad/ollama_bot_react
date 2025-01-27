import React, { createContext, useState, useReducer } from 'react';

interface chatInterface {
  chatHistory: string[];
  requestQuery: (query: string) => void;
}

interface childProps {
  children: React.ReactElement;
}

const BASE_URL = 'http://localhost:11434';
const decoder = new TextDecoder();

const reducer = (
  state: { message: string; chatHistory: string[] },
  payload: any
) => {
  switch (payload.action) {
    case 'set_message':
      return {
        ...state,
        message: state.message + payload.value,
        chatHistory: [...state.chatHistory, state.message],
      };
    case 'set_chat_from_llm':
      return {
        ...state,
        chatHistory: [...state.chatHistory, state.message],
        message: '',
      };
    default:
      return state;
  }
};

const ChatContext = createContext<chatInterface>({
  chatHistory: [],
  requestQuery: (query: string) => false,
});

export const ChatContextProvider: React.FC<childProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    message: '',
    chatHistory: [],
  });
  const requestQuery = async (query: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ model: 'llama3.2', prompt: query }),
      });
      if (response.body) {
        const reader = response.body?.getReader();
        let finish = false;
        while (!finish) {
          const { done: doneReading, value } = await reader.read();
          finish = doneReading;
          if (value !== undefined) {
            const { response, done } = JSON.parse(
              decoder.decode(value, { stream: true })
            );
            if (!done) {
              dispatch({ action: 'set_message', value: response });
            }
          }
          // else {
          //   dispatch({ action: 'set_chat_from_llm' });
          //   // setChatHistory((history) => [...history, message]);
          //   // setMessage('');
          // }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <ChatContext.Provider
      value={{ chatHistory: state.chatHistory, requestQuery }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;

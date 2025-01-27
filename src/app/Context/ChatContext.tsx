import React, { createContext, useReducer } from 'react';
import { Chat } from '../Components';

interface chatInterface {
  chatHistory: React.ReactNode[];
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
      };
    case 'set_chat_from_user':
      return { ...state, chatHistory: [...state.chatHistory, payload.value] };
    case 'set_chat_from_llm':
      return {
        ...state,
        chatHistory: [...state.chatHistory, payload.value],
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
      dispatch({
        action: 'set_chat_from_user',
        value: React.cloneElement(
          <Chat>
            <div>{query}</div>
          </Chat>
        ),
      });
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
              dispatch({
                action: 'set_chat_from_llm',
                value: React.cloneElement(
                  <Chat>
                    <div>{response}</div>
                  </Chat>
                ),
              });
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

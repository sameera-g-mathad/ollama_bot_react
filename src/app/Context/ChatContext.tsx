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
    // case 'set_message':
    //   return {
    //     ...state,
    //     message: state.message + payload.value,
    //   };
    case 'set_chat':
      return {
        ...state,
        chatHistory: [...state.chatHistory, payload.value[0], payload.value[1]],
      };
    case 'set_chat_from_llm':
      return {
        ...state,
        chatHistory: state.chatHistory.map((chat, index) => {
          if (index === payload.value[0])
            return React.cloneElement(
              <Chat key={state.chatHistory.length - 1}>
                <div>{payload.value[1]}</div>
              </Chat>
            );
          return chat;
        }),
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
        action: 'set_chat',
        value: [
          React.cloneElement(
            <Chat key={state.chatHistory.length}>
              <div className="flex justify-end">
                <span className="border p-1 rounded-lg shadow-sm  shadow-neutral-100 rounded-tr-none">
                  {query}
                </span>
              </div>
            </Chat>
          ),
          <Chat key={state.chatHistory.length + 1}>
            <div>{}</div>
          </Chat>,
        ],
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
        let message = '';
        while (!finish) {
          const { done: doneReading, value } = await reader.read();
          finish = doneReading;
          if (value !== undefined) {
            const { response, done } = JSON.parse(
              decoder.decode(value, { stream: true })
            );

            if (!done) {
              message += response;
              dispatch({
                action: 'set_chat_from_llm',
                value: [state.chatHistory.length + 1, message],
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

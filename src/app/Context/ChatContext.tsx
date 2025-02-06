import React, { createContext, useReducer } from 'react';
import { Chat } from '../Components';

interface chatRequirementsInterface {
  chatHistory: React.ReactNode[];
  models: string[];
  isRunning: boolean;
}

interface chatInterface extends chatRequirementsInterface {
  requestQuery: (query: string) => void;
  listModels: () => void;
}

interface childProps {
  children: React.ReactElement;
}

const BASE_URL = 'http://localhost:11434';
const decoder = new TextDecoder();

const reducer = (
  state: chatRequirementsInterface,
  payload: {
    action: string;
    value: [number, string] | [React.ReactNode, React.ReactNode] | [];
  }
) => {
  switch (payload.action) {
    case 'set_chat':
      return {
        ...state,
        chatHistory: [...state.chatHistory, payload.value[0], payload.value[1]],
      };
    case 'set_chat_from_llm':
      return {
        ...state,
        isRunning: true,
        chatHistory: state.chatHistory.map((chat, index) => {
          if (index === payload.value[0])
            return React.cloneElement(
              <Chat generatedBy={true} key={state.chatHistory.length - 1}>
                <div className="flex">
                  {/* <span className="w-3 h-3 mr-5 rounded-full border"></span> */}
                  <div className="border-none rounded-xl p-3">
                    {payload.value[1]}
                  </div>
                </div>
              </Chat>
            );
          return chat;
        }),
      };
    case 'setStatusOff':
      return { ...state, isRunning: false };
    default:
      return state;
  }
};

const ChatContext = createContext<chatInterface>({
  chatHistory: [],
  models: [],
  isRunning: false,
  requestQuery: (query: string) => query,
  listModels: () => false,
});

export const ChatContextProvider: React.FC<childProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    models: [],
    isRunning: false,
    chatHistory: [],
  });

  const requestQuery = async (query: string) => {
    try {
      if (query === '') return;
      dispatch({
        action: 'set_chat',
        value: [
          React.cloneElement(
            <Chat generatedBy={false} key={state.chatHistory.length}>
              <div className="flex justify-end">
                <span
                  className="border rounded-xl p-1 px-3"
                  style={{ maxWidth: '70%' }}
                >
                  {query}
                </span>
              </div>
            </Chat>
          ),
          <Chat generatedBy={true} key={state.chatHistory.length + 1}>
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
            console.log(JSON.parse(decoder.decode(value, { stream: true })));
            if (!done) {
              message += response;
              dispatch({
                action: 'set_chat_from_llm',
                value: [state.chatHistory.length + 1, message],
              });
            }
          }
        }
      }
    } catch (e) {
      dispatch({ action: 'setStatusOff', value: [] });
      console.log(e);
    }
  };

  const listModels = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/ps`);
    } catch (e) {
      dispatch({ action: 'setStatusOff', value: [] });
      console.log(e);
    }
  };

  return (
    <ChatContext.Provider value={{ ...state, requestQuery, listModels }}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;

import React, { createContext, useReducer } from 'react';
import { Chat } from '../Components';

interface chatRequirementsInterface {
  chatHistory: React.ReactNode[];
  models: string[];
  isRunning: boolean;
  activeModel: string;
}

interface chatInterface extends chatRequirementsInterface {
  requestQuery: (query: string) => void;
  listModels: () => void;
  deleteModel: (modelName: string) => void;
  addModel: (modelName: string) => void;
  selectModel: (modelName: string) => void;
  // checkModel: (modelName: string) => void;
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
    value: any;
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
    case 'models_list':
      return {
        ...state,
        isRunning: true,
        models: payload.value,
        activeModel: payload.value[0],
      };
    case 'setActiveModel':
      return { ...state, isRunning: true, activeModel: payload.value };
    case 'setStatusOff':
      return { ...state, isRunning: false };
    default:
      return state;
  }
};

const ChatContext = createContext<chatInterface>({
  chatHistory: [],
  models: [],
  activeModel: '',
  isRunning: false,
  requestQuery: (query: string) => query,
  listModels: () => false,
  deleteModel: (modelName: string) => false,
  addModel: (modelName: string) => false,
  selectModel: (modelName: string) => false,
  // checkModel: () => false,
});

export const ChatContextProvider: React.FC<childProps> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    models: [],
    activeModel: '',
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
          <Chat generatedBy={false} key={state.chatHistory.length + 1}>
            <div>{}</div>
          </Chat>,
        ],
      });
      const response = await fetch(`${BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ model: state.activeModel, prompt: query }),
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
      const response = await fetch(`${BASE_URL}/api/tags`);
      if (response.body) {
        const reader = response.body.getReader();
        const { done, value } = await reader.read();
        if (!done) {
          const models = JSON.parse(decoder.decode(value, { stream: true }))[
            'models'
          ];
          dispatch({
            action: 'models_list',
            value: models.map((el: { name: string }) => el.name),
          });
        }
      }
    } catch (e) {
      dispatch({ action: 'setStatusOff', value: [] });
      console.log(e);
    }
  };

  const deleteModel = async (modelName: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/delete`, {
        method: 'delete',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ name: modelName }),
      });
    } catch (error) {
      dispatch({ action: 'setStatusOff', value: [] });
      console.log(error);
    }
  };

  const addModel = async (modelName: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/pull`, {
        method: 'Post',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ name: modelName, stream: true }),
      });
      console.log(response);
    } catch (error) {
      dispatch({ action: 'setStatusOff', value: [] });
      console.log(error);
    }
  };

  const selectModel = (modelName: string) => {
    dispatch({ action: 'setActiveModel', value: modelName });
  };
  // const checkModel = async (modelName: string) => {
  //   try {
  //     const response = await fetch(`${BASE_URL}/api/show`, {
  //       method: 'POST',
  //       headers: {
  //         'content-type': 'application/json',
  //       },
  //       body: JSON.stringify({ name: modelName }),
  //     });
  //     if (response.body) {
  //       const reader = response.body.getReader();
  //       const { done, value } = await reader.read();
  //       console.log(decoder.decode(value, { stream: true }));
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  return (
    <ChatContext.Provider
      value={{
        ...state,
        addModel,
        deleteModel,
        listModels,
        requestQuery,
        selectModel,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;

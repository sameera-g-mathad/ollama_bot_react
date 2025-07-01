'use client'
import React, { createContext, useCallback, useEffect, useReducer, useRef } from 'react';
import { formatMessage, DB } from '../Utils';

export type chatMessage = {
  role: 'user' | 'assistant';
  content: string;
}

interface chatRequirementsInterface {
  chatMessages: chatMessage[]
  models: string[];
  isRunning: boolean;
  activeModel: string;
}

type chatReducerActionTypes =
  { action: 'setChat', value: [chatMessage, chatMessage] } |
  { action: 'setChatFromLLM', value: string } |
  { action: 'setModelsList', value: string[] }

interface chatInterface extends chatRequirementsInterface {
  requestQuery: (query: string, uuid: string) => void;
  listModels: () => void;
  deleteModel: (modelName: string) => void;
  addModel: (modelName: string) => void;
  selectModel: (modelName: string) => void;
}

interface childProps {
  children: React.ReactElement;
}

const BASE_URL = 'http://localhost:11434';
const decoder = new TextDecoder();

const reducer = (
  state: chatRequirementsInterface,
  payload: chatReducerActionTypes | {
    action: string;
    value: any;
  }
) => {
  switch (payload.action) {
    case 'setChat': {
      return { ...state, chatMessages: [...state.chatMessages, ...payload.value] }
    }
    case 'setChatFromLLM': return {
      ...state,
      isRunning: true,
      chatMessages: [
        ...state.chatMessages.slice(0, state.chatMessages.length - 1),
        { role: 'assistant', content: payload.value }
      ]
    }
    case 'setModelsList':
      return {
        ...state,
        isRunning: true,
        models: payload.value,
        activeModel: localStorage.getItem('activeModel') || payload.value[0],
      };
    case 'setActiveModel':
      localStorage.setItem('activeModel', payload.value)
      return { ...state, isRunning: true, activeModel: payload.value, chatMessages: [] };

    case 'setStatusOff':
      return { ...state, isRunning: false };
    default:
      return state;
  }
};

const ChatContext = createContext<chatInterface>({
  chatMessages: [],
  models: [],
  activeModel: '',
  isRunning: false,
  requestQuery: (query: string, uuid: string) => query,
  listModels: () => false,
  deleteModel: (modelName: string) => false,
  addModel: (modelName: string) => false,
  selectModel: (modelName: string) => false,
  // checkModel: () => false,
});

export const ChatContextProvider: React.FC<childProps> = ({ children }) => {
  const db = useRef(new DB('OllamaBot', 1)).current;
  useEffect(() => {
    const initDB = async () => {
      await db.open()
      await db.createObjStore('chats', { keyPath: 'uuid' })
      await db.createObjStore('conversations', { keyPath: 'id', autoIncrement: true }, true, 'uuid')
    }
    initDB()
  }, [])

  const [state, dispatch] = useReducer(reducer, {
    models: [],
    activeModel: '',
    isRunning: false,
    chatMessages: []
  });

  const requestCompletion = useCallback(async (query: string) => {
    try {
      if (query === '') return;
      dispatch({
        action: 'setChat',
        value: [{ role: 'user', content: query }, { role: 'assistant', content: '' }]
      })
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
            // console.log(JSON.parse(decoder.decode(value, { stream: true })));
            if (!done) {
              message += response;
              message = formatMessage(message);
              dispatch({
                action: 'setChatFromLLM',
                value: message
              })
            }
          }
        }
      }
    } catch (e) {
      dispatch({ action: 'setStatusOff', value: [] });
      console.log(e);
    }
  }, [state.activeModel]);

  const requestConversation = useCallback(async (query: string, uuid: string) => {
    try {
      if (query === '') return;
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ model: state.activeModel, messages: [...state.chatMessages, { role: 'user', content: query }] }),
      });
      dispatch({
        action: 'setChat',
        value: [{ role: 'user', content: query }, { role: 'assistant', content: '' }]
      })
      if (response.body) {
        const reader = response.body?.getReader();
        let finish = false;
        let reply = '';
        while (!finish) {
          const { done: doneReading, value } = await reader.read();
          finish = doneReading;
          if (value !== undefined) {
            const { message, done } = JSON.parse(
              decoder.decode(value, { stream: true })
            );
            if (!done) {
              reply += message['content'];
              reply = formatMessage(reply);
              dispatch({
                action: 'setChatFromLLM',
                value: reply
              })
            }
          }
        }
        if (await db.get('chats', uuid) === undefined) {
          db.add('chats', { uuid, createdAt: new Date().toLocaleDateString() })
        }

        db.add('conversations', { uuid, role: 'user', content: query, createdAt: new Date().toLocaleDateString() })
        db.add('conversations', { uuid, role: 'assistant', content: reply, createdAt: new Date().toLocaleDateString() })
      }
    } catch (e) {
      dispatch({ action: 'setStatusOff', value: [] });
      console.log(e);
    }
  }, [state.activeModel, state.chatMessages]);

  const listModels = useCallback(async () => {
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
            action: 'setModelsList',
            value: models.map((el: { name: string }) => el.name),
          });
        }
      }
    } catch (e) {
      dispatch({ action: 'setStatusOff', value: [] });
      // console.log(e);
    }
  }, []);

  const deleteModel = useCallback(async (modelName: string) => {
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
  }, []);

  const addModel = useCallback(async (modelName: string) => {
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
  }, []);

  const selectModel = useCallback((modelName: string) => {
    dispatch({ action: 'setActiveModel', value: modelName });
  }, []);

  return (
    <ChatContext.Provider
      value={{
        ...state,
        addModel,
        deleteModel,
        listModels,
        requestQuery: requestConversation,
        selectModel,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;

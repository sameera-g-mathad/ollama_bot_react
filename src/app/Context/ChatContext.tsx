'use client'
import React, { createContext, useCallback, useEffect, useReducer, useRef } from 'react';
import { formatMessage, DB, randomUUID } from '../Utils';

export type chatMessage = {
  role: 'user' | 'assistant';
  content: string;
}
export type conversation = {
  uuid: string;
  title: string;
  createdAt: Date;
}

interface chatRequirementsInterface {
  chatMessages: chatMessage[],
  chatHistory: conversation[],
  models: string[];
  isRunning: boolean;
  activeModel: string;
}

type chatReducerActionTypes =
  { action: 'setChat', value: [chatMessage, chatMessage] } |
  { action: 'setChatFromLLM', value: string } |
  { action: 'setModelsList', value: string[] } |
  { action: 'setActiveModel', value: string } |
  { action: 'setStatusOff' } |
  { action: 'setConversation', value: any[] } |
  { action: 'setAllChats', value: conversation[] } |
  { action: 'setNewChat' }

interface chatInterface extends chatRequirementsInterface {
  requestQuery: (query: string) => void;
  listModels: () => void;
  deleteModel: (modelName: string) => void;
  addModel: (modelName: string) => void;
  selectModel: (modelName: string) => void;
  setConversation: (uuid: string) => void;
  newChat: () => void;
  deleteChat: (uuid: string) => void;
}

interface childProps {
  children: React.ReactElement;
}

const BASE_URL = 'http://localhost:11434';
const decoder = new TextDecoder();

const reducer = (
  state: chatRequirementsInterface,
  payload: chatReducerActionTypes
) => {
  switch (payload.action) {
    case 'setNewChat': return { ...state, chatMessages: [] }
    case 'setChat': {
      return { ...state, chatMessages: [...state.chatMessages, ...payload.value] }
    }
    case 'setChatFromLLM': return {
      ...state,
      isRunning: true,
      chatMessages: [
        ...state.chatMessages.slice(0, state.chatMessages.length - 1),
        { role: 'assistant' as 'assistant', content: payload.value }
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

    case 'setConversation': {
      return { ...state, chatMessages: [...payload.value] }
    }
    case 'setAllChats': return { ...state, chatHistory: [...payload.value] }
    default:
      return state;
  }
};

const ChatContext = createContext<chatInterface>({
  chatMessages: [],
  chatHistory: [],
  models: [],
  activeModel: '',
  isRunning: false,
  requestQuery: (query: string) => query,
  listModels: () => false,
  deleteModel: (modelName: string) => false,
  addModel: (modelName: string) => false,
  selectModel: (modelName: string) => false,
  setConversation: (uuid: string) => false,
  newChat: () => false,
  deleteChat: (uuid: string) => false
});

export const ChatContextProvider: React.FC<childProps> = ({ children }) => {
  const db = useRef(new DB('OllamaBot', 1)).current;
  const uuid = useRef<string>(null);
  const getAllChats = useCallback(async () => {
    const chats = await db.getAll('chats')
    chats.sort((a: conversation, b: conversation) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA
    })
    dispatch({ action: 'setAllChats', value: chats })
  }
    , [])
  useEffect(() => {
    const initDB = async () => {
      await db.open()
      await db.createObjStore('chats', { keyPath: 'uuid' })
      await db.createObjStore('conversations', { keyPath: 'id', autoIncrement: true }, true, 'uuid')
      getAllChats()
    }
    initDB()
  }, [])

  const [state, dispatch] = useReducer(reducer, {
    models: [],
    activeModel: '',
    isRunning: false,
    chatMessages: [],
    chatHistory: []
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
      dispatch({ action: 'setStatusOff' });
      console.log(e);
    }
  }, [state.activeModel]);

  const requestConversation = useCallback(async (query: string) => {
    try {
      if (query === '') return;
      dispatch({
        action: 'setChat',
        value: [{ role: 'user' as 'user', content: query }, { role: 'assistant' as 'assistant', content: '' }]
      })
      const response = await fetch(`${BASE_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ model: state.activeModel, messages: [...state.chatMessages, { role: 'user', content: query }] }),
      });
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
        if (uuid.current === null) {
          uuid.current = randomUUID();
        }
        if (await db.get('chats', uuid.current) === undefined) {
          const title = await fetch(`${BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: state.activeModel,
              messages: [
                {
                  role: 'user',
                  content: query,
                },
                {
                  role: 'assistant',
                  content: reply
                },
                {
                  role: 'user',
                  content: "Please generate a small chat title without quotes around."
                }
              ],
              stream: false
            })
          })

          const data = await title.json()
          db.add('chats', { uuid: uuid.current, title: data.message?.content, createdAt: new Date().toISOString() })
          getAllChats()
        }

        db.add('conversations', { uuid: uuid.current, role: 'user', content: query, createdAt: new Date().toISOString() })
        db.add('conversations', { uuid: uuid.current, role: 'assistant', content: reply, createdAt: new Date().toISOString() })
      }
    } catch (e) {
      dispatch({ action: 'setStatusOff' });
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
      dispatch({ action: 'setStatusOff' });
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
      localStorage.removeItem('activeModel')
      return listModels()
    } catch (error) {
      dispatch({ action: 'setStatusOff' });
      console.log(error);
    }
  }, []);

  const addModel = useCallback(async (modelName: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/pull`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ name: modelName, stream: true }),
      });
    } catch (error) {
      dispatch({ action: 'setStatusOff' });
      console.log(error);
    }
  }, []);

  const selectModel = useCallback((modelName: string) => {
    dispatch({ action: 'setActiveModel', value: modelName });
  }, []);

  const setConversation = useCallback(async (convUuid: string) => {
    uuid.current = convUuid;
    const conversations = await db.getAll('conversations', convUuid, true, 'uuid')
    dispatch({ action: 'setConversation', value: conversations })
  }, [])

  const newChat = useCallback(async () => {
    uuid.current = null;
    dispatch({ action: 'setNewChat' })
  }, [])

  const deleteChat = useCallback((uuid: string) => {
    db.delete('chats', uuid);
    db.delete('conversations', uuid, true, 'uuid');
    getAllChats()
  }, [])

  return (
    <ChatContext.Provider
      value={{
        ...state,
        addModel,
        deleteModel,
        listModels,
        requestQuery: requestConversation,
        selectModel,
        setConversation,
        newChat,
        deleteChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;

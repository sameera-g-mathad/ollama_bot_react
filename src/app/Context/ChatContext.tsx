'use client'
import React, { createContext, useCallback, useEffect, useReducer, useRef } from 'react';
import { formatMessage, DB, randomUUID } from '../Utils';
import { deprecate } from 'util';

// This file defines the ChatContext, which provides state and functions for managing chat messages, models, and conversations in a React application.
// It includes types for chat messages, conversations, and the context interface, as well as a reducer function to handle state updates.
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
        ...state.chatMessages.slice(0, state.chatMessages.length - 1), // remove the last assistant message
        { role: 'assistant' as 'assistant', content: payload.value }
      ]
    }
    case 'setModelsList':
      return {
        ...state,
        isRunning: true,
        models: payload.value,
        activeModel: localStorage.getItem('activeModel') || payload.value[0], // set the first model as active if no active model is stored.
      };
    case 'setActiveModel':
      localStorage.setItem('activeModel', payload.value)
      return { ...state, isRunning: true, activeModel: payload.value, chatMessages: [] }; // reset chat messages when a new model is selected

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

    // Sort chats by createdAt date in descending order.
    if (!chats) return;
    chats.sort((a: conversation, b: conversation) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA
    })
    dispatch({ action: 'setAllChats', value: chats })
  }
    , [])
  useEffect(() => {
    // Initialize the database and create object stores for chats and conversations. This will throw warnings if the 
    // object stores already exist, but that's okay since we are just ensuring they are there.
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

  // This method is used to request a completion from the LLM.
  // This method works, but does not handle conversations.
  const requestCompletion = useCallback(async (query: string) => {
    try {
      // If the query is empty, do not send a request.
      if (query === '') return;

      // update the chat with the user query.
      // The last message in the chat is always the assistant message, so we need 
      // to add a new user message before sending the request.
      // The reason it is added is to handle streaming responses from the LLM.
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
      // Since the response is a stream, we need to read it in chunks.
      if (response.body) {
        const reader = response.body?.getReader();
        let finish = false;
        let message = '';
        while (!finish) {
          const { done: doneReading, value } = await reader.read();
          finish = doneReading;
          if (value !== undefined) {
            // Decode the value and parse the JSON response.
            // The response is expected to be in the format { response: string, done: boolean}
            const { response, done } = JSON.parse(
              decoder.decode(value, { stream: true })
            );
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

  // This method is used to request a conversation with the LLM.
  // It sends a user query and receives a response from the LLM.
  const requestConversation = useCallback(async (query: string) => {
    try {
      // If the query is empty, do not send a request.
      if (query === '') return;

      // update the chat with the user query.
      // The last message in the chat is always the assistant message, so we need 
      // to add a new user message before sending the request.
      // The reason it is added is to handle streaming responses from the LLM.
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

      // Since the response is a stream, we need to read it in chunks.
      if (response.body) {
        const reader = response.body?.getReader();
        let finish = false;
        let reply = '';
        while (!finish) {

          const { done: doneReading, value } = await reader.read();
          finish = doneReading;
          if (value !== undefined) {
            // Decode the value and parse the JSON response.
            // The response is expected to be in the format { message: string, done: boolean}
            const { message, done } = JSON.parse(
              decoder.decode(value, { stream: true })
            );
            if (!done) {
              reply += message['content'];
              // Format the message to remove any unwanted characters or formatting.
              // This is a utility function that can be defined in the Utils file.
              reply = formatMessage(reply);
              dispatch({
                action: 'setChatFromLLM',
                value: reply
              })
            }
          }
        }
        // After the response is received, we need to save the conversation to the database.
        // If the uuid is not set, we need to create a new chat.
        if (uuid.current === null) {
          uuid.current = randomUUID();
        }
        // If the chat does not exist in the database, we need to create a new chat.
        // We will use the uuid to identify the chat and save the conversation.
        if (await db.get('chats', uuid.current) === undefined) {
          // Generate a title for the chat using the LLM.
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
          // Add new chat to the database.
          db.add('chats', { uuid: uuid.current, title: data.message?.content, createdAt: new Date().toISOString() })
          getAllChats()
        }
        // Add the conversations to the database.
        db.add('conversations', { uuid: uuid.current, role: 'user', content: query, createdAt: new Date().toISOString() })
        db.add('conversations', { uuid: uuid.current, role: 'assistant', content: reply, createdAt: new Date().toISOString() })
      }
    } catch (e) {
      dispatch({ action: 'setStatusOff' });
      console.log(e);
    }
  }, [state.activeModel, state.chatMessages]);

  // This method is used to list all the models available in the LLM.
  // It fetches the models from the server and updates the state with the list of models
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

  // This method is used to delete a model from the LLM.
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

  // This method is used to add a new model to the LLM.
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

  // Method to select a model from the list of models.
  const selectModel = useCallback((modelName: string) => {
    dispatch({ action: 'setActiveModel', value: modelName });
  }, []);

  // Method to set the conversation based on the uuid.
  // This will fetch the conversation from the database and update the state.
  // It will also set the uuid to the current conversation uuid.
  const setConversation = useCallback(async (convUuid: string) => {
    uuid.current = convUuid;
    const conversations = await db.getAll('conversations', convUuid, true, 'uuid')
    dispatch({ action: 'setConversation', value: conversations })
  }, [])

  // Method to create a new chat.
  // This will reset the uuid and the chat messages, and set the state to a new
  const newChat = useCallback(async () => {
    uuid.current = null;
    dispatch({ action: 'setNewChat' })
  }, [])

  // Method to delete a chat.
  // This will delete the chat from the database and reset the state.
  // It will also delete all the conversations associated with the chat.
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

'use client';

import { Page } from './Components';
import './page.css';
import { ThemeContextProvider } from './Context/ThemeContext';
import { ChatContextProvider } from './Context/ChatContext';
export default function Home() {
  return (
    <ThemeContextProvider>
      <ChatContextProvider>
        <Page />
      </ChatContextProvider>
    </ThemeContextProvider>
  );
}

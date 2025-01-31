'use client';

import { Page } from './Components';
import './page.css';
import { ThemeContextProvider } from './Context/ThemeContext';
import { ChatContextProvider } from './Context/ChatContext';

import exec from 'child_process';
import { useEffect } from 'react';

export default function Home() {
  return (
    <ThemeContextProvider>
      <ChatContextProvider>
        <Page />
      </ChatContextProvider>
    </ThemeContextProvider>
  );
}

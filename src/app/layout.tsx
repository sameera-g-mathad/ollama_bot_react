import type { Metadata } from 'next';

import './globals.css';
import { ThemeContextProvider } from './Context/ThemeContext';
import { ChatContextProvider } from './Context/ChatContext';

export const metadata: Metadata = {
  title: 'Ollama Bot',
  description: 'Web Interface to interact with Ollama.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <ThemeContextProvider>
          <ChatContextProvider>
            <>
              {children}
            </>
          </ChatContextProvider>
        </ThemeContextProvider>

      </body>
    </html>
  );
}

'use client';
import React from 'react';
import { OllamaStatus, TextBox } from './index';

/**
 *  Displays the footer of the application.
 *  It includes a text box for user input and the Ollama status component.
 *  The footer is styled to be at the bottom of the page and centered.
 * @returns A React component that renders the footer of the application.
 */
export const Footer: React.FC = () => {
  return (
    <div className="flex flex-col justify-end items-center text-base">
      <TextBox />
      <OllamaStatus />
    </div>
  );
};

Footer.displayName = 'Footer';

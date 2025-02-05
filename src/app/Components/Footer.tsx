'use client';
import React from 'react';

import { OllamaStatus, TextBox } from './index';

export const Footer: React.FC = () => {
  return (
    <div className="flex flex-col justify-end items-center text-base">
      <TextBox />
      <OllamaStatus />
    </div>
  );
};

Footer.displayName = 'Footer';

export const formatMessage = (message: string): string => {
  message = message.replace(/^\s*/, '');

  // Particular for deepseek <think> </think>
  message = message.replace(/<think>/, '').replace(/<\/think>/, '');

  // Check for ###
  // Check for code snippets
  if (message.includes('```')) {
    message = message
      .replace(/\s```/, '<pre><code>')
      .replace(/```/, '</code></pre>');
  }

  // Check for bold letters
  if (message.includes('**')) {
    message = message.replace(/\s\*\*/, '<b>').replace(/\*\*/, '</b>');
  }

  return message;
};

export const randomUUID = () => {
  return crypto.randomUUID();
};

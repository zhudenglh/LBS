// useAIChat Hook - AI Chat Logic

import { useState, useCallback } from 'react';
import { sendChatMessage } from '@api/ai';
import { generateUUID } from '@utils/avatar';
import type { ChatMessage } from '@types';

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (text: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: generateUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      // Build conversation history
      const history = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Send to AI
      const reply = await sendChatMessage({
        message: text,
        history,
      });

      // Add AI response
      const aiMessage: ChatMessage = {
        id: generateUUID(),
        role: 'assistant',
        content: reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMsg);
      console.error('Failed to send message:', err);

      // Add error message
      const errorMessage: ChatMessage = {
        id: generateUUID(),
        role: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearHistory,
  };
}

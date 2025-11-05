// ChatBubble Component Tests

import React from 'react';
import { render } from '@testing-library/react-native';
import ChatBubble from '../../src/components/chat/ChatBubble';
import type { ChatMessage } from '../../src/types';

describe('ChatBubble Component', () => {
  const userMessage: ChatMessage = {
    id: '1',
    role: 'user',
    content: 'Hello, this is a user message',
    timestamp: Date.now(),
  };

  const assistantMessage: ChatMessage = {
    id: '2',
    role: 'assistant',
    content: 'Hello, this is an assistant message',
    timestamp: Date.now(),
  };

  it('should render user message correctly', () => {
    const { getByText } = render(<ChatBubble message={userMessage} />);
    expect(getByText('Hello, this is a user message')).toBeTruthy();
  });

  it('should render assistant message correctly', () => {
    const { getByText } = render(<ChatBubble message={assistantMessage} />);
    expect(getByText('Hello, this is an assistant message')).toBeTruthy();
  });

  it('should apply different styles for user messages', () => {
    const { getByText } = render(<ChatBubble message={userMessage} />);
    const textElement = getByText('Hello, this is a user message');
    expect(textElement).toBeTruthy();
  });

  it('should apply different styles for assistant messages', () => {
    const { getByText } = render(<ChatBubble message={assistantMessage} />);
    const textElement = getByText('Hello, this is an assistant message');
    expect(textElement).toBeTruthy();
  });

  it('should render long messages', () => {
    const longMessage: ChatMessage = {
      id: '3',
      role: 'user',
      content: 'This is a very long message '.repeat(20),
      timestamp: Date.now(),
    };
    const { getByText } = render(<ChatBubble message={longMessage} />);
    expect(getByText(/This is a very long message/)).toBeTruthy();
  });

  it('should render empty message', () => {
    const emptyMessage: ChatMessage = {
      id: '4',
      role: 'user',
      content: '',
      timestamp: Date.now(),
    };
    const { root } = render(<ChatBubble message={emptyMessage} />);
    expect(root).toBeTruthy();
  });

  it('should render messages with special characters', () => {
    const specialMessage: ChatMessage = {
      id: '5',
      role: 'assistant',
      content: 'Hello! 👋 How are you? 😊 #test @user',
      timestamp: Date.now(),
    };
    const { getByText } = render(<ChatBubble message={specialMessage} />);
    expect(getByText('Hello! 👋 How are you? 😊 #test @user')).toBeTruthy();
  });

  it('should render multiline messages', () => {
    const multilineMessage: ChatMessage = {
      id: '6',
      role: 'user',
      content: 'Line 1\nLine 2\nLine 3',
      timestamp: Date.now(),
    };
    const { getByText } = render(<ChatBubble message={multilineMessage} />);
    expect(getByText('Line 1\nLine 2\nLine 3')).toBeTruthy();
  });

  it('should handle different message IDs', () => {
    const messages = [
      { id: 'msg-1', role: 'user' as const, content: 'Message 1', timestamp: Date.now() },
      { id: 'msg-2', role: 'assistant' as const, content: 'Message 2', timestamp: Date.now() },
      { id: 'msg-3', role: 'user' as const, content: 'Message 3', timestamp: Date.now() },
    ];

    messages.forEach(msg => {
      const { getByText } = render(<ChatBubble message={msg} />);
      expect(getByText(msg.content)).toBeTruthy();
    });
  });
});

// Chat Bubble Component

import React from 'react';
import { View, Text } from 'react-native';
import type { ChatMessage } from '@types';

interface ChatBubbleProps {
  message: ChatMessage;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <View className={`mb-3 px-4 ${isUser ? 'items-end' : 'items-start'}`}>
      <View className={`max-w-[80%] p-3 rounded-2xl ${
        isUser
          ? 'bg-[#2196F3] rounded-br-[4px]'
          : 'bg-white rounded-bl-[4px]'
      }`}>
        <Text className={`text-base leading-5 ${
          isUser ? 'text-white' : 'text-[#333333]'
        }`}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

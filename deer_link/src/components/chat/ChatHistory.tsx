// Chat History Component

import React, { useRef, useEffect } from 'react';
import { FlatList, View, ActivityIndicator, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import ChatBubble from './ChatBubble';
import type { ChatMessage } from '@types';

interface ChatHistoryProps {
  messages: ChatMessage[];
  loading?: boolean;
}

export default function ChatHistory({ messages, loading = false }: ChatHistoryProps) {
  const { t } = useTranslation();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  if (messages.length === 0 && !loading) {
    return (
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-6xl mb-4">🐱</Text>
        <Text className="text-lg text-[#666666] text-center">{t('ai_chat.welcome_message')}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <ChatBubble message={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 16 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      {loading && (
        <View className="flex-row items-center justify-center p-3">
          <ActivityIndicator color="#2196F3" />
          <Text className="ml-2 text-sm text-[#666666]">{t('ai_chat.thinking')}</Text>
        </View>
      )}
    </View>
  );
}

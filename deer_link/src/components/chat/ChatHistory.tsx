// Chat History Component

import React, { useRef, useEffect } from 'react';
import { FlatList, View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import ChatBubble from './ChatBubble';
import { colors, spacing, fontSize } from '@constants/theme';
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
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🐱</Text>
        <Text style={styles.emptyText}>{t('ai_chat.welcome_message')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <ChatBubble message={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.loadingText}>{t('ai_chat.thinking')}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: fontSize.lg,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  loadingText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
});

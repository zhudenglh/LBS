// AI Chat Screen

import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import ChatHistory from '../components/chat/ChatHistory';
import ChatInput from '../components/chat/ChatInput';
import { sendChatMessage } from '@api/ai';
import { colors } from '@constants/theme';
import { generateUUID } from '@utils/avatar';
import type { ChatMessage } from '@types';

export default function AIChatScreen() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (text: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: generateUUID(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

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
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert(t('ai_chat.error'), t('ai_chat.network_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ChatHistory messages={messages} loading={loading} />
      <ChatInput onSend={handleSend} disabled={loading} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

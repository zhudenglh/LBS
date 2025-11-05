// Chat Input Component

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const { t } = useTranslation();
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim().length === 0) return;

    onSend(text.trim());
    setText('');
  };

  return (
    <View className="flex-row items-end p-3 bg-white border-t border-[#E5E5E5]">
      <TextInput
        className="flex-1 bg-[#F5F5F5] rounded-2xl px-4 py-3 text-base max-h-[100px] mr-3"
        placeholder={t('ai_chat.placeholder')}
        value={text}
        onChangeText={setText}
        multiline
        maxLength={500}
        editable={!disabled}
      />
      <TouchableOpacity
        className={`w-11 h-11 rounded-full items-center justify-center ${
          !text.trim() || disabled ? 'bg-[#999999]' : 'bg-[#2196F3]'
        }`}
        onPress={handleSend}
        disabled={!text.trim() || disabled}
      >
        <Text className="text-xl">📤</Text>
      </TouchableOpacity>
    </View>
  );
}

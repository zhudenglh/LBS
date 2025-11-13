// Comment Input - 评论输入框
import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface CommentInputProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  replyTo?: string | null;
  onCancelReply?: () => void;
}

export default function CommentInput({
  onSubmit,
  placeholder = '添加评论...',
  replyTo,
  onCancelReply,
}: CommentInputProps) {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="bg-white border-t border-gray-200 px-4 py-3"
    >
      {replyTo && (
        <View className="flex-row items-center justify-between mb-2 bg-blue-50 px-3 py-2 rounded">
          <Text className="text-xs text-blue-600">回复 {replyTo}</Text>
          <TouchableOpacity onPress={onCancelReply}>
            <Text className="text-xs text-gray-600">取消</Text>
          </TouchableOpacity>
        </View>
      )}
      <View className="flex-row items-center gap-2">
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm"
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!content.trim()}
          className={`px-4 py-2 rounded-full ${
            content.trim() ? 'bg-blue-500' : 'bg-gray-200'
          }`}
          activeOpacity={0.7}
        >
          <Text
            className={`text-sm font-medium ${
              content.trim() ? 'text-white' : 'text-gray-400'
            }`}
          >
            发送
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

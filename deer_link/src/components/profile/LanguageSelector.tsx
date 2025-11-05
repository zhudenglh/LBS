// Language Selector Component

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal as RNModal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { storage } from '@utils/storage';
import { STORAGE_KEYS } from '@constants/config';

interface LanguageSelectorProps {
  visible: boolean;
  onClose: () => void;
}

const LANGUAGES = [
  { code: 'zh', name: '中文', nativeName: '简体中文' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
];

export default function LanguageSelector({ visible, onClose }: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const handleLanguageSelect = async (languageCode: string) => {
    try {
      await i18n.changeLanguage(languageCode);
      await storage.set(STORAGE_KEYS.LANGUAGE, languageCode);
      setSelectedLanguage(languageCode);
      setTimeout(() => {
        onClose();
      }, 300);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-6">
        <View className="bg-white rounded-2xl w-full max-w-[400px]">
          <View className="flex-row justify-between items-center p-4 border-b border-[#E5E5E5]">
            <Text className="text-lg font-bold text-[#333333]">选择语言 / Select Language</Text>
            <TouchableOpacity onPress={onClose} className="p-1">
              <Text className="text-xl text-[#666666]">✕</Text>
            </TouchableOpacity>
          </View>

          <View className="p-3">
            {LANGUAGES.map((language) => (
              <TouchableOpacity
                key={language.code}
                className={`flex-row justify-between items-center p-4 rounded-lg mb-2 ${
                  selectedLanguage === language.code
                    ? 'bg-[#2196F315] border-2 border-[#2196F3]'
                    : 'bg-[#F5F5F5]'
                }`}
                onPress={() => handleLanguageSelect(language.code)}
              >
                <View className="flex-1">
                  <Text className="text-base font-semibold text-[#333333] mb-1">{language.nativeName}</Text>
                  <Text className="text-sm text-[#666666]">{language.name}</Text>
                </View>
                {selectedLanguage === language.code && (
                  <Text className="text-xl text-[#2196F3] font-bold">✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </RNModal>
  );
}

// Language Selector Component

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal as RNModal,
  StyleSheet,
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
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerText}>选择语言 / Select Language</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {LANGUAGES.map((language) => {
              const isSelected = selectedLanguage === language.code;
              return (
                <TouchableOpacity
                  key={language.code}
                  style={[
                    styles.languageItem,
                    isSelected && styles.languageItemSelected,
                  ]}
                  onPress={() => handleLanguageSelect(language.code)}
                >
                  <View style={styles.languageInfo}>
                    <Text style={styles.languageNative}>{language.nativeName}</Text>
                    <Text style={styles.languageName}>{language.name}</Text>
                  </View>
                  {isSelected && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 20,
    color: '#666666',
  },
  content: {
    padding: 12,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F5F5F5',
  },
  languageItemSelected: {
    backgroundColor: 'rgba(33, 150, 243, 0.08)',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  languageInfo: {
    flex: 1,
  },
  languageNative: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  languageName: {
    fontSize: 14,
    color: '#666666',
  },
  checkmark: {
    fontSize: 20,
    color: '#2196F3',
    fontWeight: 'bold',
  },
});

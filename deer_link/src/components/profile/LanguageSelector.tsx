// Language Selector Component

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal as RNModal,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { storage } from '@utils/storage';
import { STORAGE_KEYS } from '@constants/config';
import { colors, spacing, fontSize, borderRadius } from '@constants/theme';

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
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>选择语言 / Select Language</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {LANGUAGES.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageItem,
                  selectedLanguage === language.code && styles.languageItemSelected,
                ]}
                onPress={() => handleLanguageSelect(language.code)}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.languageName}>{language.nativeName}</Text>
                  <Text style={styles.languageCode}>{language.name}</Text>
                </View>
                {selectedLanguage === language.code && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
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
    padding: spacing.xl,
  },
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    width: '100%',
    maxWidth: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  closeButton: {
    padding: spacing.xs,
  },
  closeIcon: {
    fontSize: 20,
    color: colors.text.secondary,
  },
  content: {
    padding: spacing.md,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  languageItemSelected: {
    backgroundColor: `${colors.primary}15`,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  languageCode: {
    fontSize: fontSize.sm,
    color: colors.text.secondary,
  },
  checkIcon: {
    fontSize: 20,
    color: colors.primary,
    fontWeight: 'bold',
  },
});

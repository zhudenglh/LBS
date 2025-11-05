// i18n Configuration

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { storage } from '@utils/storage';
import { STORAGE_KEYS, APP_CONFIG } from '@constants/config';

import en from './locales/en.json';
import zh from './locales/zh.json';
import id from './locales/id.json';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
  id: { translation: id },
};

// Initialize i18n
i18n.use(initReactI18next).init({
  resources,
  lng: APP_CONFIG.DEFAULT_LANGUAGE,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v3',
});

// Load saved language preference
storage.get(STORAGE_KEYS.LANGUAGE).then((savedLanguage) => {
  if (savedLanguage && APP_CONFIG.SUPPORTED_LANGUAGES.includes(savedLanguage)) {
    i18n.changeLanguage(savedLanguage);
  }
});

export default i18n;

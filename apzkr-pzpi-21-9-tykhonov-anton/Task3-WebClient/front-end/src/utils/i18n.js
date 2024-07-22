import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Настройка i18next
i18n
  .use(HttpApi) // загружает переводы с бэкенда
  .use(LanguageDetector) // определяет язык пользователя
  .use(initReactI18next) // интеграция с react-i18next
  .init({
    fallbackLng: 'en', // язык по умолчанию
    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie']
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;

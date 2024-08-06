import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Configure i18next
i18n
  .use(HttpApi) // Load translations from the backend
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Integration with react-i18next
  .init({
    fallbackLng: 'en', // Default language if detected language is not available
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


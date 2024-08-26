import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

/**
 * Configures and initializes the i18next instance for internationalization in a React application.
 * 
 * This setup includes:
 * - Loading translations from a backend server.
 * - Detecting the user's language from various sources.
 * - Integrating with React through `react-i18next`.
 * - Setting up fallback language and caching strategies.
 * 
 * Configuration Details:
 * 
 * 1. `HttpApi`: Plugin to load translations from a backend server.
 * 2. `LanguageDetector`: Plugin to automatically detect the user's language.
 * 3. `initReactI18next`: React integration for `i18next`.
 * 
 * Options:
 * - `fallbackLng`: The default language to use if the detected or requested language is not available.
 * - `detection`: Configuration for detecting the user's language, including the order and caching strategies.
 * - `backend`: Configuration for loading translation files from a server.
 * - `react`: Configuration for React integration, including disabling suspense for component rendering.
 * 
 * @returns {i18n} - Configured i18next instance.
 */
i18n
  .use(HttpApi) // Load translations from the backend server
  .use(LanguageDetector) // Automatically detect user language from various sources
  .use(initReactI18next) // Integrate with React for translation support
  .init({
    fallbackLng: 'en', // Default language if detected or requested language is not available

    detection: {
      order: ['queryString', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
      caches: ['cookie'] // Cache language settings in cookies
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json' // Path to translation files on the server
    },

    react: {
      useSuspense: false // Disable suspense for React components to avoid blocking rendering
    }
  });

export default i18n;

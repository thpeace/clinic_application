import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import translationEN from '../public/locales/en.json';
import translationTH from '../public/locales/th.json';

// Load translations upfront
const resources = {
  en: { translation: translationEN },
  th: { translation: translationTH },
};

i18n
  .use(HttpApi) // Load translations from external files
  .use(LanguageDetector) // Detect browser language
  .use(initReactI18next) // Initialize react-i18next
  .init({
    resources, // Loaded translations
    lng: 'th', // Initial language
    supportedLngs: ['en', 'th'], // Add more languages here
    fallbackLng: 'th', // Default language
    debug: true, // Enable console logs for debugging

    interpolation: {
      escapeValue: false, // React already escapes strings
    },

    backend: {
      loadPath: '/locales/{{lng}}.json', // Translation file path
    },
    react: {
      useSuspense: false, // Disable Suspense
    },
  });

export default i18n;

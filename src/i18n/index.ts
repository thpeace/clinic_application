import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en.json';
import thTranslation from './locales/th.json';

const resources = {
    en: {
        translation: enTranslation,
    },
    th: {
        translation: thTranslation,
    },
};

i18n
    .use(LanguageDetector) // Detect user language
    .use(initReactI18next) // Pass i18n to react-i18next
    .init({
        resources,
        fallbackLng: 'en', // Default language
        debug: import.meta.env.DEV, // Enable debug in development

        interpolation: {
            escapeValue: false, // React already escapes by default
        },

        detection: {
            // Order of language detection
            order: ['localStorage', 'navigator', 'htmlTag'],
            // Key to store language in localStorage
            lookupLocalStorage: 'i18nextLng',
            // Cache user language
            caches: ['localStorage'],
        },
    });

export default i18n;

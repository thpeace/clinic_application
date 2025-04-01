import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import "@fontsource/mitr"; // Defaults to weight 400
import translationEN from "./locales/en.json";
import translationTH from "./locales/th.json";

// Load translations upfront
const resources = {
  en: { translation: translationEN },
  th: { translation: translationTH },
};

i18n
  .use(Backend) // Load translation files
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Initialize with React
  .init({
    resources, // Loaded translations
    fallbackLng: "en", // Default language
    lng: "th", // Initial language
    debug: true, // Set to false in production
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Path to translation files
    },
  });

export default i18n;

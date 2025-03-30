import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(Backend) // Load translation files
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Initialize with React
  .init({
    fallbackLng: "th", // Default language
    // lng: "th", // Initial language
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Path to translation files
    },
    detection: {
      order: ["localStorage", "cookie", "navigator"], // Detect language from these sources
      caches: ["localStorage", "cookie"], // Store detected language
    },
  });

export default i18n;

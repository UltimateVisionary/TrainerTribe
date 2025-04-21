import React, { createContext, useContext, useState, useEffect } from 'react';
const i18n = require('./i18n');

const LanguageContext = createContext();

const SUPPORTED_LANGUAGES = ['en', 'es', 'zh'];

export const LanguageProvider = ({ children }) => {
  // Always use a supported code, fallback to 'en' if not
  const getValidLanguage = (code) => SUPPORTED_LANGUAGES.includes(code) ? code : 'en';
  // Use device locale if supported, otherwise fallback to 'en'
  const deviceLocale = (typeof window === 'undefined' ? require('expo-localization').locale : (navigator.language || 'en')).split('-')[0];
  const initialLanguage = getValidLanguage(deviceLocale);
  const [language, _setLanguage] = useState(initialLanguage);

  // Safe setter that always uses a valid code
  const setLanguage = (code) => {
    const validCode = getValidLanguage(code);
    _setLanguage(validCode);
    if (i18n.locale !== validCode) {
      i18n.locale = validCode;
    }
  };

  useEffect(() => {
    if (i18n.locale !== language) {
      i18n.locale = language;
    }
  }, [language]);

  const contextValue = React.useMemo(() => ({
    language,
    setLanguage,
    t: i18n.t.bind(i18n),
    key: language
  }), [language]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

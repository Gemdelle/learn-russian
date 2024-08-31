import React, { createContext, useContext, useState } from 'react';
import es from '../locales/es.json';
import ru from '../locales/ru.json';

const LocalizationContext = createContext();

export function LocalizationProvider({ children }) {
    const [language, setLanguage] = useState('es');

    const translations = {
        es,
        ru
    };

    const translate = (key, lang) => {
        const targetLang = lang || language;
        return translations[targetLang][key] || key;
    };

    const getLanguage = () => language;

    return (
        <LocalizationContext.Provider value={{ translate, setLanguage, getLanguage }}>
            {children}
        </LocalizationContext.Provider>
    );
}

export function useLocalization() {
    return useContext(LocalizationContext);
}

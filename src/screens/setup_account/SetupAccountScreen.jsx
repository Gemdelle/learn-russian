import React, { useState, useEffect, useCallback } from 'react';
import { useLocalization } from '../../contexts/LocalizationsContext';
import { useUserProfile } from '../../contexts/UserProfileContext';
import './styles/SetupAccountScreen.css';
import {useNavigate} from "react-router-dom";

export default function SetupAccountScreen() {
    const navigate = useNavigate();
    const { translate, setLanguage } = useLocalization();
    const { nativeLanguage, chosenLanguage, name, updateProfile } = useUserProfile();
    const [languageSelected, setLanguageSelected] = useState(chosenLanguage || '');
    const [inputName, setInputName] = useState(name || '');

    useEffect(() => {
        const userLanguage = navigator.language || navigator.userLanguage;

        if (userLanguage.startsWith('es')) {
            setLanguage('es');
            updateProfile({ nativeLanguage: 'es', chosenLanguage: 'RU' });
            setLanguageSelected('RU');
        } else if (userLanguage.startsWith('ru')) {
            setLanguage('ru');
            updateProfile({ nativeLanguage: 'ru', chosenLanguage: 'AR' });
            setLanguageSelected('AR');
        }
    }, [setLanguage, updateProfile]);

    const handleLanguageClick = useCallback((language) => {
        const newLanguage = language === 'RU' ? 'es' : 'ru';
        setLanguage(newLanguage);
        updateProfile({ chosenLanguage: language });
        setLanguageSelected(language);
    }, [setLanguage, updateProfile]);

    const handleNameChange = (event) => {
        const newName = event.target.value;
        setInputName(newName);
        updateProfile({ name: newName });
    };

    const goToPetSelection = () => {
        navigate('/pet-selection');
    };

    return (
        <>
            <div className="title">{translate('learn')}</div>
            <div className="flags-container">
                <div
                    className={`flag flag-ru ${languageSelected === 'RU' ? 'active' : ''}`}
                    onClick={() => handleLanguageClick('RU')}
                />
                <div
                    className={`flag flag-ar ${languageSelected === 'AR' ? 'active' : ''}`}
                    onClick={() => handleLanguageClick('AR')}
                />
            </div>
            <div className="name-container">
                <div>{translate('name_prompt')}</div>
                <input
                    value={inputName}
                    onChange={handleNameChange}
                    placeholder={translate('input_placeholder')}
                />
            </div>
            <button onClick={goToPetSelection}>Next</button>
        </>
    );
}

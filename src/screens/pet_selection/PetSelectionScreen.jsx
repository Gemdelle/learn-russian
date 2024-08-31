import React, { useState, useEffect, useCallback } from 'react';
import { useLocalization } from '../../contexts/LocalizationsContext';
import { useUserProfile } from '../../contexts/UserProfileContext';
import './styles/PetSelectionScreen.css';
import {useNavigate} from "react-router-dom";

export default function PetSelectionScreen() {
    const navigate = useNavigate();
    const { translate, setLanguage, getLanguage } = useLocalization();
    const { nativeLanguage, chosenLanguage, name, updateProfile } = useUserProfile();
    const [languageSelected, setLanguageSelected] = useState(chosenLanguage || '');
    const goToPetSelection = () => {
        navigate('/book-selection');
    };

    return (
        <>
            <div>{translate("choose_your_pet", getLanguage() === "es" ? "ru" : "es")}</div>
            <div>{translate("choose_your_pet")}</div>
            <div className="pets-container">
                <div>PET 1</div>
                <div>PET 2</div>
                <div>PET 3</div>
            </div>
            <button onClick={goToPetSelection}>Next</button>
        </>
    );
}

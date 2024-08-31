import React, { createContext, useContext, useState, useCallback } from 'react';

const UserProfileContext = createContext();

export function UserProfileProvider({ children }) {
    const [nativeLanguage, setNativeLanguage] = useState('');
    const [chosenLanguage, setChosenLanguage] = useState('');
    const [name, setName] = useState('');

    const updateProfile = useCallback((profile) => {
        if (profile.nativeLanguage !== undefined) {
            setNativeLanguage(profile.nativeLanguage);
        }
        if (profile.chosenLanguage !== undefined) {
            setChosenLanguage(profile.chosenLanguage);
        }
        if (profile.name !== undefined) {
            setName(profile.name);
        }
    }, []);

    return (
        <UserProfileContext.Provider value={{ nativeLanguage, chosenLanguage, name, updateProfile }}>
            {children}
        </UserProfileContext.Provider>
    );
}

export function useUserProfile() {
    return useContext(UserProfileContext);
}

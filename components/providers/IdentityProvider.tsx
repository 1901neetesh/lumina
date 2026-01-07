"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Identity = 'Male' | 'Female' | 'Non-Binary' | 'Gay' | 'Lesbian' | 'Queer' | 'Trans' | 'Pansexual';

export type ThemeMode = 'default' | 'pride' | 'pink' | 'blue';

interface IdentityContextType {
    identity: Identity;
    setIdentity: (identity: Identity) => void;
    themeMode: ThemeMode;
}

const IdentityContext = createContext<IdentityContextType | undefined>(undefined);

const PRIDE_IDENTITIES: Identity[] = ['Non-Binary', 'Gay', 'Lesbian', 'Queer', 'Trans', 'Pansexual'];

export function IdentityProvider({ children }: { children: React.ReactNode }) {
    const [identity, setIdentityState] = useState<Identity>('Male');
    const [themeMode, setThemeMode] = useState<ThemeMode>('default');

    useEffect(() => {
        const saved = localStorage.getItem('lumina_identity');
        if (saved) {
            setIdentityState(saved as Identity);
            updateTheme(saved as Identity);
        }
    }, []);

    const updateTheme = (id: Identity) => {
        let mode: ThemeMode = 'default';
        if (id === 'Female') {
            mode = 'pink';
        } else if (id === 'Male') {
            mode = 'blue';
        } else if (PRIDE_IDENTITIES.includes(id)) {
            mode = 'pride';
        }
        setThemeMode(mode);
        document.body.setAttribute('data-theme', mode);
    };

    const setIdentity = (newIdentity: Identity) => {
        setIdentityState(newIdentity);
        localStorage.setItem('lumina_identity', newIdentity);
        updateTheme(newIdentity);
    };

    const value = {
        identity,
        setIdentity,
        themeMode
    };

    return (
        <IdentityContext.Provider value={value}>
            {children}
        </IdentityContext.Provider>
    );
}

export function useIdentity() {
    const context = useContext(IdentityContext);
    if (context === undefined) {
        throw new Error('useIdentity must be used within a IdentityProvider');
    }
    return context;
}

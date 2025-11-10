import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type FeatureMode = 'mvp' | 'future-state';

interface FeatureModeContextType {
    featureMode: FeatureMode;
    setFeatureMode: (mode: FeatureMode) => void;
    isMVPMode: boolean;
    isFutureMode: boolean;
}

const FeatureModeContext = createContext<FeatureModeContextType | undefined>(undefined);

interface FeatureModeProviderProps {
    children: ReactNode;
}

export function FeatureModeProvider({ children }: FeatureModeProviderProps) {
    const [featureMode, setFeatureModeState] = useState<FeatureMode>(() => {
        // Load from localStorage on mount, default to 'mvp'
        const saved = localStorage.getItem('feature-prioritization-mode');
        return (saved as FeatureMode) || 'mvp';
    });

    // Save to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('feature-prioritization-mode', featureMode);
    }, [featureMode]);

    const setFeatureMode = (mode: FeatureMode) => {
        setFeatureModeState(mode);
    };

    const value: FeatureModeContextType = {
        featureMode,
        setFeatureMode,
        isMVPMode: featureMode === 'mvp',
        isFutureMode: featureMode === 'future-state',
    };

    return (
        <FeatureModeContext.Provider value={value}>
            {children}
        </FeatureModeContext.Provider>
    );
}

export function useFeatureMode(): FeatureModeContextType {
    const context = useContext(FeatureModeContext);
    if (context === undefined) {
        throw new Error('useFeatureMode must be used within a FeatureModeProvider');
    }
    return context;
}

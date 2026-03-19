import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export const defaultStationListContext = {
    type: null,
    region: null,
    currentIndex: -1,
    stations: []
};

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
    const [player, setPlayer] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [listContext, setListContext] = useState(defaultStationListContext);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const savedFavorites = window.localStorage.getItem('favoritesData');
        if (!savedFavorites) {
            return;
        }

        try {
            const parsed = JSON.parse(savedFavorites);
            if (Array.isArray(parsed)) {
                setFavorites(parsed);
            }
        } catch (error) {
            console.error('Failed to parse favoritesData from localStorage:', error);
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        window.localStorage.setItem('favoritesData', JSON.stringify(favorites));
    }, [favorites]);

    const value = useMemo(() => ({
        player,
        setPlayer,
        favorites,
        setFavorites,
        listContext,
        setListContext
    }), [favorites, listContext, player]);

    return (
        <AppStateContext.Provider value={value}>
            {children}
        </AppStateContext.Provider>
    );
}

export function useAppState() {
    const context = useContext(AppStateContext);

    if (!context) {
        throw new Error('useAppState must be used inside AppStateProvider');
    }

    return context;
}
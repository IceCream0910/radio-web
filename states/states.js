import { atom } from 'recoil';
import { localStorageEffect } from "./localStorage";

const playerData = atom({
    key: 'playerData',
    default: [],
});

const favoritesData = atom({
    key: 'favoritesData',
    default: [],
    effects: [localStorageEffect("favoritesData")],
});

const stationListContext = atom({
    key: 'stationListContext',
    default: {
        type: null,
        region: null,
        currentIndex: -1,
        stations: []
    }
});

export { playerData, favoritesData, stationListContext };
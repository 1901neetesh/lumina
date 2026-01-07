import { Recommendation } from "./suggestions";

const HISTORY_KEY = "lumina_history_v1";
const FAVORITES_KEY = "lumina_favorites_v1";

export interface HistoryItem {
    id: string;
    timestamp: number;
    recommendation: Recommendation;
}

export function saveToHistory(recommendation: Recommendation) {
    if (typeof window === "undefined") return;

    const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        recommendation,
    };

    const existingHistory = getHistory();
    const updatedHistory = [newItem, ...existingHistory].slice(0, 50); // Keep last 50

    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
    return updatedHistory;
}

export function getHistory(): HistoryItem[] {
    if (typeof window === "undefined") return [];

    try {
        const stored = localStorage.getItem(HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to parse history", e);
        return [];
    }
}

export function saveToFavorites(recommendation: Recommendation) {
    if (typeof window === "undefined") return;

    const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        recommendation,
    };

    const existingFavorites = getFavorites();
    const updatedFavorites = [newItem, ...existingFavorites.filter(f => f.id !== newItem.id)];

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return updatedFavorites;
}

export function getFavorites(): HistoryItem[] {
    if (typeof window === "undefined") return [];

    try {
        const stored = localStorage.getItem(FAVORITES_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        console.error("Failed to parse favorites", e);
        return [];
    }
}

export function removeFromFavorites(id: string) {
    if (typeof window === "undefined") return;

    const existingFavorites = getFavorites();
    const updatedFavorites = existingFavorites.filter(f => f.id !== id);

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    return updatedFavorites;
}

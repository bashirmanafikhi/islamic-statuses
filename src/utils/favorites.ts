// Favorites utility using AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteCard } from '../types';

const FAVORITES_KEY = '@islamic_statuses_favorites';

/**
 * Get all favorites from storage
 */
export const getFavorites = async (): Promise<FavoriteCard[]> => {
    try {
        const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error loading favorites:', e);
        return [];
    }
};

/**
 * Add a card to favorites
 */
export const addFavorite = async (
    ayahId: number,
    backgroundIndex: number,
    fontFamily: string
): Promise<FavoriteCard> => {
    try {
        const favorites = await getFavorites();

        // Check if already exists
        const exists = favorites.find(
            f => f.ayahId === ayahId && f.backgroundIndex === backgroundIndex
        );
        if (exists) return exists;

        const newFavorite: FavoriteCard = {
            id: `fav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            ayahId,
            backgroundIndex,
            fontFamily,
            createdAt: Date.now(),
        };

        const updatedFavorites = [newFavorite, ...favorites];
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));

        return newFavorite;
    } catch (e) {
        console.error('Error adding favorite:', e);
        throw e;
    }
};

/**
 * Remove a card from favorites
 */
export const removeFavorite = async (id: string): Promise<void> => {
    try {
        const favorites = await getFavorites();
        const updatedFavorites = favorites.filter(f => f.id !== id);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
    } catch (e) {
        console.error('Error removing favorite:', e);
        throw e;
    }
};

/**
 * Check if a card is favorited
 */
export const isFavorite = async (
    ayahId: number,
    backgroundIndex: number
): Promise<boolean> => {
    const favorites = await getFavorites();
    return favorites.some(
        f => f.ayahId === ayahId && f.backgroundIndex === backgroundIndex
    );
};

/**
 * Toggle favorite status
 */
export const toggleFavorite = async (
    ayahId: number,
    backgroundIndex: number,
    fontFamily: string
): Promise<{ isFavorite: boolean; favorite?: FavoriteCard }> => {
    const favorites = await getFavorites();
    const existing = favorites.find(
        f => f.ayahId === ayahId && f.backgroundIndex === backgroundIndex
    );

    if (existing) {
        await removeFavorite(existing.id);
        return { isFavorite: false };
    } else {
        const favorite = await addFavorite(ayahId, backgroundIndex, fontFamily);
        return { isFavorite: true, favorite };
    }
};

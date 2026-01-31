// Data loader utilities for Islamic Statuses app
import { Ayah, Surah, AyahWithSurah } from '../types';

// Import JSON data
const ayahData = require('../../assets/json/ayah.json');
const surahData = require('../../assets/json/surah.json');
const muyassarData = require('../../assets/json/muyassar.json');
const ma3anyData = require('../../assets/json/ma3any.json');

// Convert object to array for easier access
const ayahArray: any[] = Object.values(ayahData);
const surahMap: Record<number, any> = surahData;

// Create maps for faster lookup of tafseer and meanings by surah and aya
const muyassarMap: Record<string, string> = {};
muyassarData.forEach((item: any) => {
    muyassarMap[`${item.sura}-${item.aya}`] = item.text;
});

const ma3anyMap: Record<string, string> = {};
ma3anyData.forEach((item: any) => {
    ma3anyMap[`${item.sura}-${item.aya}`] = item.text;
});

/**
 * Get a random ayah with its surah information
 */
export const getRandomAyah = (): AyahWithSurah => {
    const randomIndex = Math.floor(Math.random() * ayahArray.length);
    const rawAyah = ayahArray[randomIndex];
    const rawSurah = surahMap[rawAyah.surah_number];
    const key = `${rawAyah.surah_number}-${rawAyah.ayah_number}`;

    return {
        ayah: {
            id: rawAyah.id,
            text: rawAyah.text,
            ayahNumber: rawAyah.ayah_number,
            surahNumber: rawAyah.surah_number,
            verseKey: rawAyah.verse_key,
            tafseer: muyassarMap[key],
            meanings: ma3anyMap[key],
        },
        surah: {
            id: rawSurah.id,
            name: rawSurah.name,
            nameArabic: rawSurah.name_arabic,
            nameSimple: rawSurah.name_simple,
        },
    };
};

/**
 * Get ayah by ID
 */
export const getAyahById = (id: number): AyahWithSurah | null => {
    const rawAyah = ayahData[id];
    if (!rawAyah) return null;

    const rawSurah = surahMap[rawAyah.surah_number];
    const key = `${rawAyah.surah_number}-${rawAyah.ayah_number}`;

    return {
        ayah: {
            id: rawAyah.id,
            text: rawAyah.text,
            ayahNumber: rawAyah.ayah_number,
            surahNumber: rawAyah.surah_number,
            verseKey: rawAyah.verse_key,
            tafseer: muyassarMap[key],
            meanings: ma3anyMap[key],
        },
        surah: {
            id: rawSurah.id,
            name: rawSurah.name,
            nameArabic: rawSurah.name_arabic,
            nameSimple: rawSurah.name_simple,
        },
    };
};


/**
 * Get total number of ayahs
 */
export const getTotalAyahCount = (): number => ayahArray.length;

/**
 * Get all surahs
 */
export const getAllSurahs = (): Surah[] => {
    return Object.values(surahMap).map((s: any) => ({
        id: s.id,
        name: s.name,
        nameArabic: s.name_arabic,
        nameSimple: s.name_simple,
    }));
};

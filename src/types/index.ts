// Type definitions for Islamic Statuses app

export interface Ayah {
    id: number;
    text: string;
    ayahNumber: number;
    surahNumber: number;
    verseKey: string;
    tafseer?: string;
    meanings?: string;
}

export interface Surah {
    id: number;
    name: string;
    nameArabic: string;
    nameSimple: string;
}

export interface AyahWithSurah {
    ayah: Ayah;
    surah: Surah;
}

export interface CardData {
    id: string;
    ayah: Ayah;
    surah: Surah;
    backgroundImage: any; // require() returns any
    backgroundIndex: number;
    fontFamily: string;
    tafseer?: string;
    meanings?: string;
}


export interface FavoriteCard {
    id: string;
    ayahId: number;
    backgroundIndex: number;
    fontFamily: string;
    createdAt: number;
}

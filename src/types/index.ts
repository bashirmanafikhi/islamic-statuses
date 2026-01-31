export type ContentFilter = 'quran' | 'hadith' | 'both';

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

export interface Hadith {
    id: number;
    idInBook: number;
    chapterId: number;
    bookId: number;
    arabic: string;
    english: {
        narrator: string;
        text: string;
    };
    metadata?: {
        title: string;
        author: string;
    };
}

export interface AyahWithSurah {
    ayah: Ayah;
    surah: Surah;
}

export interface CardData {
    id: string;
    type: 'quran' | 'hadith';
    ayah?: Ayah;
    surah?: Surah;
    hadith?: Hadith;
    backgroundImage: any; // require() returns any
    backgroundIndex: number;
    fontFamily: string;
    tafseer?: string;
    meanings?: string;
}


export interface FavoriteCard {
    id: string;
    type: 'quran' | 'hadith';
    ayahId?: number;
    hadithId?: number;
    backgroundIndex: number;
    fontFamily: string;
    createdAt: number;
}

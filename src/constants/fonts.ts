// Font configuration for Islamic Statuses app
// 4 Arabic fonts available

type FontMap = Record<string, any>;

export const FONTS: FontMap = {
    'Amiri': require('../../assets/fonts/Amiri-Regular.ttf'),
    'Cairo': require('../../assets/fonts/Cairo-VariableFont_slnt,wght.ttf'),
    'Calibri': require('../../assets/fonts/calibri.ttf'),
    'Uthmanic': require('../../assets/fonts/uthmanic_hafs1_ver13.otf'),
};

export const FONT_NAMES: string[] = Object.keys(FONTS);

export const getRandomFont = (): string => {
    const index = Math.floor(Math.random() * FONT_NAMES.length);
    return FONT_NAMES[index];
};

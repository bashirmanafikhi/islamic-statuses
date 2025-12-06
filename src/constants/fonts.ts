// Font configuration for Islamic Statuses app
// 10 Arabic fonts available

type FontMap = Record<string, any>;

export const FONTS: FontMap = {
    'KFGQPCNastaleeq': require('../../assets/fonts/KFGQPCNastaleeq-Regular.ttf'),
    'QCF_SurahHeader': require('../../assets/fonts/QCF_SurahHeader_COLOR-Regular.ttf'),
    'UthmanicHafs_V22': require('../../assets/fonts/UthmanicHafs_V22.ttf'),
    'DefaultFont': require('../../assets/fonts/font.ttf'),
    'MeQuran': require('../../assets/fonts/me_quran_volt_newmet.ttf'),
    'QuranCommon': require('../../assets/fonts/quran-common.ttf'),
    'SurahName_V1': require('../../assets/fonts/surah-name-v1.ttf'),
    'SurahName_V2': require('../../assets/fonts/surah-name-v2.ttf'),
    'SurahName_V4': require('../../assets/fonts/surah-name-v4.ttf'),
    'Uthmanic_V13': require('../../assets/fonts/uthmanic_hafs1_ver13.otf'),
};

export const FONT_NAMES: string[] = Object.keys(FONTS);

export const getRandomFont = (): string => {
    const index = Math.floor(Math.random() * FONT_NAMES.length);
    return FONT_NAMES[index];
};

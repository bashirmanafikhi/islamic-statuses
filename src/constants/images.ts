// Auto-generated image manifest for Islamic Statuses app
// All background images from assets/images/

export const BACKGROUND_IMAGES: any[] = [
    require('../../assets/images/ahmet-kagan-hancer-FFhJCVaFuO0-unsplash.jpg'),
    require('../../assets/images/alexandr-hovhannisyan-x690jpFNMHE-unsplash.jpg'),
    require('../../assets/images/andrew-lancaster-9lWLanbynH0-unsplash.jpg'),
    require('../../assets/images/annie-spratt-Ufa495Wz0x8-unsplash.jpg'),
    require('../../assets/images/annie-spratt-wuc-KEIBrdE-unsplash.jpg'),
    require('../../assets/images/ashkan-forouzani-sWui4HlGXiI-unsplash.jpg'),
    require('../../assets/images/ashkan-forouzani-xiHAseekqqw-unsplash.jpg'),
    require('../../assets/images/ayse-bek-YLdYVzHopto-unsplash.jpg'),
    require('../../assets/images/birmingham-museums-trust-BPWZ01FtySg-unsplash.jpg'),
    require('../../assets/images/boim-H_6zuSsHMNo-unsplash.jpg'),
    require('../../assets/images/daniel-burka-oR9ZisoF_NE-unsplash.jpg'),
    require('../../assets/images/daniel-olah-2lMK4dgqwFM-unsplash.jpg'),
    require('../../assets/images/ekrem-osmanoglu-FLFjAn3gQI8-unsplash.jpg'),
    require('../../assets/images/fahrul-azmi-5K549TS6F08-unsplash.jpg'),
    require('../../assets/images/fahrul-azmi-gyKmF0vnfBs-unsplash.jpg'),
    require('../../assets/images/fatih-yurur-kNSREmtaGOE-unsplash.jpg'),
    require('../../assets/images/girl-with-red-hat-YQXLO2cvjYg-unsplash.jpg'),
    require('../../assets/images/haidan-Qec3HPaHWTI-unsplash.jpg'),
    require('../../assets/images/hasan-almasi-6M3_19hsDaw-unsplash.jpg'),
    require('../../assets/images/hasan-almasi-n-BplEBjZfc-unsplash.jpg'),
    require('../../assets/images/huilin-dai-yI_c35jgxYI-unsplash.jpg'),
    require('../../assets/images/hushaan-fromtinyisles-EWtprB5HAL0-unsplash.jpg'),
    require('../../assets/images/imad-alassiry-QyE_fgU2Ofs-unsplash.jpg'),
    require('../../assets/images/imad-alassiry-kbqiX4da1fA-unsplash.jpg'),
    require('../../assets/images/isak-gundrosen-dVCivGs0bj0-unsplash.jpg'),
    require('../../assets/images/ishan-seefromthesky-66Tu10CxYY0-unsplash.jpg'),
    require('../../assets/images/izuddin-helmi-adnan-JFirQekVo3U-unsplash.jpg'),
    require('../../assets/images/izuddin-helmi-adnan-onh-FdFUyeM-unsplash.jpg'),
    require('../../assets/images/jonathan-takle-6-LA_PIySJ4-unsplash.jpg'),
    require('../../assets/images/juan-camilo-guarin-p-QWByC_hnf64-unsplash.jpg'),
    require('../../assets/images/kareem-saleh-SpW9xtgGokM-unsplash.jpg'),
    require('../../assets/images/levi-meir-clancy-11pYd78qMwY-unsplash.jpg'),
    require('../../assets/images/masjid-pogung-dalangan-QOkrWM-WtOg-unsplash.jpg'),
    require('../../assets/images/mayur-k8oak9BhX7M-unsplash.jpg'),
    require('../../assets/images/mosquegrapher-uouvblwaQs4-unsplash.jpg'),
    require('../../assets/images/muhammad-irfan-baloch-QEcvxkXWp0c-unsplash.jpg'),
    require('../../assets/images/muhammed-a-mustapha-aaIsU06zWrg-unsplash.jpg'),
    require('../../assets/images/muhsin-ck-8BcNsqDJy2I-unsplash.jpg'),
    require('../../assets/images/nick-fewings-F_RkoI39JX4-unsplash.jpg'),
    require('../../assets/images/nick-fewings-ZcBY_mxVBCE-unsplash.jpg'),
    require('../../assets/images/nouman-younas-6Ppkk8rIhvk-unsplash.jpg'),
    require('../../assets/images/raimond-klavins-SyPG3HSSayY-unsplash.jpg'),
    require('../../assets/images/rawan-yasser-Y-joaXX7XCQ-unsplash.jpg'),
    require('../../assets/images/rizky-andar-7FldJVOe2DM-unsplash.jpg'),
    require('../../assets/images/rumman-amin-i1bfxi1cFBY-unsplash.jpg'),
    require('../../assets/images/ryan-miglinczy-fQtFfvedV-8-unsplash.jpg'),
    require('../../assets/images/sebastian-yepes-3NTpsPyFZlQ-unsplash.jpg'),
    require('../../assets/images/sheraz-nazar-KfpTd2B5vV4-unsplash.jpg'),
    require('../../assets/images/sheraz-nazar-XTx8EaDgrXw-unsplash.jpg'),
    require('../../assets/images/sidik-kurniawan-hiFpJqA4FcE-unsplash.jpg'),
    require('../../assets/images/sinan-toy-s8xjo4yjnHc-unsplash.jpg'),
    require('../../assets/images/untung-bekti-nugroho-6Aa4EeZTdqw-unsplash.jpg'),
    require('../../assets/images/vincent-marcini-c1QVYdg5_io-unsplash.jpg'),
    require('../../assets/images/yasmine-arfaoui-R6rh5ttDO-4-unsplash.jpg'),
    require('../../assets/images/zosia-szopka-j5HQf4MpXZQ-unsplash.jpg'),
];

export const getRandomBackground = (): { source: any; index: number } => {
    const index = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
    return { source: BACKGROUND_IMAGES[index], index };
};

export const getBackgroundByIndex = (index: number): any => {
    return BACKGROUND_IMAGES[index % BACKGROUND_IMAGES.length];
};

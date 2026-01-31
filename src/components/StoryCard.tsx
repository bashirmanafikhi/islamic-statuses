import React, { forwardRef } from 'react';
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Ayah, Surah, Hadith } from '../types';

const { width } = Dimensions.get('window');

interface StoryCardProps {
    type: 'quran' | 'hadith';
    ayah?: Ayah;
    surah?: Surah;
    hadith?: Hadith;
    backgroundImage: any;
    fontFamily: string;
    showWatermark?: boolean;
    height: number; // Dynamic height from parent
    compact?: boolean; // For preview mode
    tafseerState?: number; // 0: None, 1: Muyassar, 2: Ma3any
    showHadithEnglish?: boolean;
}


/**
 * StoryCard Component
 * Fullscreen card displaying an ayah with background image
 */
const StoryCard = forwardRef<View, StoryCardProps>(
    ({ type, ayah, surah, hadith, backgroundImage, fontFamily, showWatermark = false, height, compact = false, tafseerState = 0, showHadithEnglish = false }, ref) => {
        const dynamicStyles = {
            container: {
                width: (compact ? '100%' : width) as any,
                height: compact ? 200 : height,
            },
            ayahText: {
                fontSize: compact ? 16 : 28,
                lineHeight: compact ? 28 : 52,
            },
            surahName: {
                fontSize: compact ? 14 : 22,
            },
            hadithText: {
                fontSize: compact ? 14 : 20,
                lineHeight: compact ? 24 : 36,
            }
        };

        const isQuran = type === 'quran' && ayah && surah;
        const isHadith = type === 'hadith' && hadith;

        const tafseerText = isQuran ? (tafseerState === 1 ? ayah.tafseer : (tafseerState === 2 ? ayah.meanings : null)) : null;
        const tafseerTitle = tafseerState === 1 ? 'التفسير الميسر' : 'معاني الكلمات';

        return (
            <View ref={ref} style={[styles.container, dynamicStyles.container]} collapsable={false}>
                <ImageBackground
                    source={backgroundImage}
                    style={styles.background}
                    resizeMode="cover"
                >
                    {/* Dark overlay for text readability */}
                    <View style={styles.overlay} />

                    {/* Content */}
                    <View style={[styles.content, compact && styles.compactContent]}>
                        {/* Title / Metadata */}
                        <View style={styles.surahContainer}>
                            <Text style={[styles.surahName, { fontFamily }, dynamicStyles.surahName]}>
                                {isQuran ? surah.nameArabic : hadith?.metadata?.title}
                            </Text>
                        </View>

                        {/* Text Content */}
                        <View style={styles.ayahContainer}>
                            {isQuran ? (
                                <Text
                                    style={[styles.ayahText, { fontFamily }, dynamicStyles.ayahText]}
                                    numberOfLines={compact ? 4 : (tafseerState > 0 ? 8 : undefined)}
                                >
                                    {ayah.text}
                                </Text>
                            ) : isHadith ? (
                                <View style={styles.hadithContent}>
                                    <Text
                                        style={[styles.ayahText, { fontFamily }, dynamicStyles.hadithText]}
                                        numberOfLines={compact ? 5 : undefined}
                                    >
                                        {hadith.arabic}
                                    </Text>

                                    {!compact && showHadithEnglish && (
                                        <View style={styles.englishHadithContainer}>
                                            <Text style={styles.englishNarrator}>{hadith.english.narrator}</Text>
                                            <Text style={styles.englishText}>{hadith.english.text}</Text>
                                        </View>
                                    )}
                                </View>
                            ) : null}
                        </View>

                        {/* Tafseer / Meanings Section (Quran Only) */}
                        {!compact && isQuran && tafseerState > 0 && tafseerText && (
                            <View style={styles.tafseerContainer}>
                                <Text style={styles.tafseerTitle}>{tafseerTitle}</Text>
                                <Text style={styles.tafseerText} numberOfLines={6}>
                                    {tafseerText.replace(/<br>/g, '\n')}
                                </Text>
                            </View>
                        )}

                        {/* Verse key / Hadith Reference */}
                        {!compact && (
                            <View style={styles.verseKeyContainer}>
                                <Text style={styles.verseKey}>
                                    {isQuran ? (
                                        `﴿ ${surah.nameArabic} : ${ayah.ayahNumber} ﴾`
                                    ) : (
                                        `${hadith?.metadata?.author} - حديث رقم ${hadith?.idInBook}`
                                    )}
                                </Text>
                            </View>
                        )}
                    </View>


                    {/* Watermark for shared images */}
                    {showWatermark && !compact && (
                        <View style={styles.watermarkContainer}>
                            <Text style={styles.watermark}>حالات ستوري إسلامية</Text>
                        </View>
                    )}
                </ImageBackground>
            </View>
        );
    }
);

const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
    },
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 60,
        paddingBottom: 120,
    },
    compactContent: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 16,
    },
    surahContainer: {
        marginBottom: 20,
    },
    surahName: {
        color: '#FFD700',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    ayahContainer: {
        flex: 1,
        justifyContent: 'center',
        maxWidth: '100%',
    },
    ayahText: {
        color: '#FFFFFF',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.8)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
        writingDirection: 'rtl',
    },
    verseKeyContainer: {
        marginTop: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.4)',
    },
    verseKey: {
        fontSize: 16,
        color: '#FFD700',
        textAlign: 'center',
    },
    tafseerContainer: {
        marginTop: 20,
        padding: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 16,
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    tafseerTitle: {
        fontSize: 14,
        color: '#FFD700',
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'right',
    },
    tafseerText: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'right',
        lineHeight: 24,
        fontFamily: 'System', // Standard readable font for tafseer
    },
    watermarkContainer: {

        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    watermark: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'center',
    },
    hadithContent: {
        width: '100%',
        alignItems: 'center',
    },
    englishHadithContainer: {
        marginTop: 16,
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 12,
        width: '100%',
    },
    englishNarrator: {
        fontSize: 14,
        color: '#FFD700',
        fontWeight: 'bold',
        marginBottom: 4,
        textAlign: 'left',
    },
    englishText: {
        fontSize: 14,
        color: '#FFFFFF',
        textAlign: 'left',
        lineHeight: 20,
    },
});

export default StoryCard;

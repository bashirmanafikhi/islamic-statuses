import React, { forwardRef } from 'react';
import {
    View,
    Text,
    ImageBackground,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Ayah, Surah } from '../types';

const { width } = Dimensions.get('window');

interface StoryCardProps {
    ayah: Ayah;
    surah: Surah;
    backgroundImage: any;
    fontFamily: string;
    showWatermark?: boolean;
    height: number; // Dynamic height from parent
    compact?: boolean; // For preview mode
    tafseerState?: number; // 0: None, 1: Muyassar, 2: Ma3any
}


/**
 * StoryCard Component
 * Fullscreen card displaying an ayah with background image
 */
const StoryCard = forwardRef<View, StoryCardProps>(
    ({ ayah, surah, backgroundImage, fontFamily, showWatermark = false, height, compact = false, tafseerState = 0 }, ref) => {
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
        };

        const tafseerText = tafseerState === 1 ? ayah.tafseer : (tafseerState === 2 ? ayah.meanings : null);
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
                        {/* Surah name */}
                        <View style={styles.surahContainer}>
                            <Text style={[styles.surahName, { fontFamily }, dynamicStyles.surahName]}>
                                {surah.nameArabic}
                            </Text>
                        </View>

                        {/* Ayah text */}
                        <View style={styles.ayahContainer}>
                            <Text
                                style={[styles.ayahText, { fontFamily }, dynamicStyles.ayahText]}
                                numberOfLines={compact ? 4 : (tafseerState > 0 ? 8 : undefined)}
                            >
                                {ayah.text}
                            </Text>
                        </View>

                        {/* Tafseer / Meanings Section */}
                        {!compact && tafseerState > 0 && tafseerText && (
                            <View style={styles.tafseerContainer}>
                                <Text style={styles.tafseerTitle}>{tafseerTitle}</Text>
                                <Text style={styles.tafseerText} numberOfLines={6}>
                                    {tafseerText.replace(/<br>/g, '\n')}
                                </Text>
                            </View>
                        )}

                        {/* Verse key */}
                        {!compact && (
                            <View style={styles.verseKeyContainer}>
                                <Text style={styles.verseKey}>
                                    ﴿ {surah.nameArabic} : {ayah.ayahNumber} ﴾
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
});

export default StoryCard;

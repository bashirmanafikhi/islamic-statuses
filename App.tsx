import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Text,
    ViewToken,
    Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

import StoryCard from './src/components/StoryCard';
import ActionButtons from './src/components/ActionButtons';
import CustomizationModal from './src/components/CustomizationModal';
import FavoritesScreen from './src/screens/FavoritesScreen';
import AppMenuModal from './src/components/AppMenuModal';

import { FONTS, getRandomFont } from './src/constants/fonts';
import { BACKGROUND_IMAGES, getRandomBackground } from './src/constants/images';
import { getRandomAyah, getRandomHadith } from './src/utils/dataLoader';
import { toggleFavorite, isFavorite } from './src/utils/favorites';
import { CardData, ContentFilter } from './src/types';
import { useQuranAudio } from './src/hooks/useQuranAudio';


const { width } = Dimensions.get('window');

// Generate a new card with random data
const generateCard = (filter: ContentFilter = 'both', forceBothIndex?: number): CardData => {
    let type: 'quran' | 'hadith' = 'quran';

    if (filter === 'quran') {
        type = 'quran';
    } else if (filter === 'hadith') {
        type = 'hadith';
    } else {
        // 'both' mode - if we have index, alternate. otherwise random.
        if (forceBothIndex !== undefined) {
            type = forceBothIndex % 2 === 0 ? 'quran' : 'hadith';
        } else {
            type = Math.random() > 0.5 ? 'quran' : 'hadith';
        }
    }

    const { source: backgroundImage, index: backgroundIndex } = getRandomBackground();
    const fontFamily = getRandomFont();
    const commonData = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        backgroundImage,
        backgroundIndex,
        fontFamily,
    };

    if (type === 'quran') {
        const { ayah, surah } = getRandomAyah();
        return {
            ...commonData,
            type: 'quran',
            ayah,
            surah,
        };
    } else {
        const hadith = getRandomHadith();
        return {
            ...commonData,
            type: 'hadith',
            hadith,
        };
    }
};

// Generate initial batch of cards
const generateInitialCards = (count = 10, filter: ContentFilter = 'both'): CardData[] => {
    return Array.from({ length: count }, (_, i) => generateCard(filter, i));
};

// Main content component (needs safe area context)
function MainContent() {
    const insets = useSafeAreaInsets();
    // Use full window height + status bar + navigation bar for true fullscreen
    const screenHeight = Dimensions.get('window').height + insets.top + insets.bottom;

    // Navigation state
    const [showFavorites, setShowFavorites] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    // Content type filter
    const [contentFilter, setContentFilter] = useState<ContentFilter>('both');
    const [showHadithEnglish, setShowHadithEnglish] = useState(false);

    // Audio and Tafseer state
    const { playingKey, onPlayPause, ayaKey, status } = useQuranAudio();
    const [tafseerState, setTafseerState] = useState(0);

    // Cards data
    const [cards, setCards] = useState<CardData[]>(() => generateInitialCards(10, 'both'));
    const [currentIndex, setCurrentIndex] = useState(0);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [showActions, setShowActions] = useState(true);

    // Favorite state for current card
    const [currentIsFavorite, setCurrentIsFavorite] = useState(false);

    // Refs for view shot
    const shareCardRef = useRef<View>(null);
    const flatListRef = useRef<FlatList>(null);

    // Current card
    const currentCard = cards[currentIndex] || cards[0];

    // Check favorite status when current card changes
    useEffect(() => {
        const checkFavorite = async () => {
            if (currentCard) {
                const idToCheck = currentCard.type === 'quran' ? currentCard.ayah?.id : currentCard.hadith?.id;
                if (idToCheck) {
                    const fav = await isFavorite(idToCheck, currentCard.backgroundIndex);
                    setCurrentIsFavorite(fav);
                }
            }
        };
        checkFavorite();
    }, [currentIndex, currentCard?.ayah?.id, currentCard?.hadith?.id, currentCard?.backgroundIndex]);

    // Handle content filter change
    const handleSetContentFilter = useCallback((filter: ContentFilter) => {
        setContentFilter(filter);
        setCurrentIndex(0);
        setCards(generateInitialCards(10, filter));
        // Reset list to top
        flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }, []);

    // Handle audio for the current card
    const handleAudio = useCallback(() => {
        if (!currentCard || currentCard.type !== 'quran' || !currentCard.ayah) return;
        onPlayPause({
            surah_number: currentCard.ayah.surahNumber,
            ayah_number: currentCard.ayah.ayahNumber,
        });
    }, [currentCard, onPlayPause]);

    const isPlaying = useMemo(() => {
        if (!currentCard || currentCard.type !== 'quran' || !currentCard.ayah) return false;
        const key = ayaKey(currentCard.ayah.surahNumber, currentCard.ayah.ayahNumber);
        return playingKey === key && status.playing;
    }, [currentCard, playingKey, status.playing, ayaKey]);

    const handleToggleTafseer = useCallback(() => {
        setTafseerState(prev => (prev + 1) % 3);
    }, []);

    const handleToggleHadithEnglish = useCallback(() => {
        setShowHadithEnglish(prev => !prev);
    }, []);

    const toggleActions = useCallback(() => {
        setShowActions(prev => !prev);
    }, []);

    // Handle viewability change - only update if different
    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0 && viewableItems[0].index !== null) {
            setCurrentIndex(viewableItems[0].index);
        }
    }, []);

    const viewabilityConfig = useMemo(() => ({
        itemVisiblePercentThreshold: 50,
    }), []);

    // Load more cards when reaching end
    const onEndReached = useCallback(() => {
        setCards(prev => {
            const nextBatch = Array.from({ length: 5 }, (_, i) => generateCard(contentFilter, prev.length + i));
            return [...prev, ...nextBatch];
        });
    }, [contentFilter]);

    // Customization handlers
    const handleNewAyah = useCallback(() => {
        const newCardContent = generateCard(contentFilter, currentIndex);
        setCards(prev => {
            const newCards = [...prev];
            newCards[currentIndex] = {
                ...newCards[currentIndex],
                type: newCardContent.type,
                ayah: newCardContent.ayah,
                surah: newCardContent.surah,
                hadith: newCardContent.hadith,
            };
            return newCards;
        });
    }, [currentIndex, contentFilter]);

    const handleSelectBackground = useCallback((index: number) => {
        setCards(prev => {
            const newCards = [...prev];
            newCards[currentIndex] = {
                ...newCards[currentIndex],
                backgroundImage: BACKGROUND_IMAGES[index],
                backgroundIndex: index,
            };
            return newCards;
        });
    }, [currentIndex]);

    const handleRandomFont = useCallback(() => {
        const newFont = getRandomFont();
        setCards(prev => {
            const newCards = [...prev];
            newCards[currentIndex] = {
                ...newCards[currentIndex],
                fontFamily: newFont,
            };
            return newCards;
        });
    }, [currentIndex]);

    // Favorite handler
    const handleToggleFavorite = useCallback(async () => {
        if (!currentCard) return;

        const id = currentCard.type === 'quran' ? currentCard.ayah?.id : currentCard.hadith?.id;
        if (!id) return;

        const result = await toggleFavorite(
            currentCard.type,
            id,
            currentCard.backgroundIndex,
            currentCard.fontFamily
        );
        setCurrentIsFavorite(result.isFavorite);
    }, [currentCard]);

    // Share handler
    const handleShare = useCallback(async () => {
        try {
            setModalVisible(false);

            // Wait for modal to close
            await new Promise(resolve => setTimeout(resolve, 100));

            // Capture the card
            const uri = await captureRef(shareCardRef, {
                format: 'png',
                quality: 1,
                result: 'tmpfile',
            });

            // Check if sharing is available
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'image/png',
                    dialogTitle: 'شارك الآية',
                });
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    }, []);

    // Render card
    const renderCard = useCallback(({ item, index }: { item: CardData; index: number }) => {
        const isCurrentCard = index === currentIndex;

        return (
            <Pressable
                onPress={toggleActions}
                style={[styles.cardWrapper, { height: screenHeight }]}
            >
                <StoryCard
                    ref={isCurrentCard ? shareCardRef : undefined}
                    type={item.type}
                    ayah={item.ayah}
                    surah={item.surah}
                    hadith={item.hadith}
                    backgroundImage={item.backgroundImage}
                    fontFamily={item.fontFamily}
                    height={screenHeight}
                    showWatermark={true}
                    tafseerState={tafseerState}
                    showHadithEnglish={showHadithEnglish}
                />

                {/* Action buttons only on current card and if showActions is true */}
                {isCurrentCard && showActions && (
                    <ActionButtons
                        type={item.type}
                        onShare={handleShare}
                        onCustomize={() => setModalVisible(true)}
                        onFavorite={handleToggleFavorite}
                        onMenu={() => setMenuVisible(true)}
                        onAudio={handleAudio}
                        onToggleTafseer={handleToggleTafseer}
                        onToggleEnglish={handleToggleHadithEnglish}
                        tafseerState={tafseerState}
                        isFavorite={currentIsFavorite}
                        isPlaying={isPlaying}
                        showEnglish={showHadithEnglish}
                    />
                )}
            </Pressable>
        );
    }, [currentIndex, handleShare, handleToggleFavorite, currentIsFavorite, screenHeight, isPlaying, handleAudio, handleToggleTafseer, handleToggleHadithEnglish, tafseerState, showHadithEnglish, showActions, toggleActions]);


    // Show favorites screen
    if (showFavorites) {
        return <FavoritesScreen onBack={() => setShowFavorites(false)} />;
    }

    return (
        <View style={styles.container}>
            <StatusBar hidden />

            <FlatList
                ref={flatListRef}
                data={cards}
                renderItem={renderCard}
                keyExtractor={item => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={screenHeight}
                snapToAlignment="start"
                decelerationRate="fast"
                disableIntervalMomentum={true} // Prevents skipping multiple cards
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.5}
                initialNumToRender={3}
                maxToRenderPerBatch={3}
                windowSize={5}
                removeClippedSubviews={true}
                getItemLayout={(data, index) => ({
                    length: screenHeight,
                    offset: screenHeight * index,
                    index,
                })}
            />

            {/* Customization Modal */}
            <CustomizationModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onNewAyah={handleNewAyah}
                onSelectBackground={handleSelectBackground}
                onRandomFont={handleRandomFont}
                onShare={handleShare}
                selectedBackgroundIndex={currentCard?.backgroundIndex ?? 0}
                type={currentCard?.type ?? 'quran'}
                previewAyah={currentCard?.ayah}
                previewSurah={currentCard?.surah}
                previewHadith={currentCard?.hadith}
                previewBackground={currentCard?.backgroundImage}
                previewFont={currentCard?.fontFamily ?? 'Amiri'}
            />

            {/* App Menu Modal */}
            <AppMenuModal
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
                onGoToFavorites={() => setShowFavorites(true)}
                contentFilter={contentFilter}
                onSetContentFilter={handleSetContentFilter}
            />
        </View>
    );
}


export default function App() {
    // Load fonts
    const [fontsLoaded] = useFonts(FONTS);

    // Loading state
    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={styles.loadingText}>جاري التحميل...</Text>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <MainContent />
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    cardWrapper: {
        position: 'relative',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 18,
        color: '#FFFFFF',
    },
});

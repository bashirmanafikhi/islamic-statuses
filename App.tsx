import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Dimensions,
    ActivityIndicator,
    Text,
    ViewToken,
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

import { FONTS, getRandomFont } from './src/constants/fonts';
import { BACKGROUND_IMAGES, getRandomBackground } from './src/constants/images';
import { getRandomAyah } from './src/utils/dataLoader';
import { toggleFavorite, isFavorite } from './src/utils/favorites';
import { CardData } from './src/types';

const { width } = Dimensions.get('window');

// Generate a new card with random data
const generateCard = (): CardData => {
    const { ayah, surah } = getRandomAyah();
    const { source: backgroundImage, index: backgroundIndex } = getRandomBackground();
    const fontFamily = getRandomFont();

    return {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ayah,
        surah,
        backgroundImage,
        backgroundIndex,
        fontFamily,
    };
};

// Generate initial batch of cards
const generateInitialCards = (count = 10): CardData[] => {
    return Array.from({ length: count }, () => generateCard());
};

// Main content component (needs safe area context)
function MainContent() {
    const insets = useSafeAreaInsets();
    // Use full window height + status bar + navigation bar for true fullscreen
    const screenHeight = Dimensions.get('window').height + insets.top + insets.bottom;

    // Navigation state
    const [showFavorites, setShowFavorites] = useState(false);

    // Cards data
    const [cards, setCards] = useState<CardData[]>(() => generateInitialCards(10));
    const [currentIndex, setCurrentIndex] = useState(0);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);

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
                const fav = await isFavorite(currentCard.ayah.id, currentCard.backgroundIndex);
                setCurrentIsFavorite(fav);
            }
        };
        checkFavorite();
    }, [currentIndex, currentCard?.ayah.id, currentCard?.backgroundIndex]);

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
        setCards(prev => [...prev, ...generateInitialCards(5)]);
    }, []);

    // Customization handlers
    const handleNewAyah = useCallback(() => {
        const { ayah, surah } = getRandomAyah();
        setCards(prev => {
            const newCards = [...prev];
            newCards[currentIndex] = {
                ...newCards[currentIndex],
                ayah,
                surah,
            };
            return newCards;
        });
    }, [currentIndex]);

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

        const result = await toggleFavorite(
            currentCard.ayah.id,
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
            <View style={[styles.cardWrapper, { height: screenHeight }]}>
                <StoryCard
                    ref={isCurrentCard ? shareCardRef : undefined}
                    ayah={item.ayah}
                    surah={item.surah}
                    backgroundImage={item.backgroundImage}
                    fontFamily={item.fontFamily}
                    height={screenHeight}
                    showWatermark={true}
                />

                {/* Action buttons only on current card */}
                {isCurrentCard && (
                    <ActionButtons
                        onShare={handleShare}
                        onCustomize={() => setModalVisible(true)}
                        onFavorite={handleToggleFavorite}
                        onGoToFavorites={() => setShowFavorites(true)}
                        isFavorite={currentIsFavorite}
                    />
                )}
            </View>
        );
    }, [currentIndex, handleShare, handleToggleFavorite, currentIsFavorite, screenHeight]);

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
                previewAyah={currentCard?.ayah}
                previewSurah={currentCard?.surah}
                previewBackground={currentCard?.backgroundImage}
                previewFont={currentCard?.fontFamily ?? 'Amiri'}
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

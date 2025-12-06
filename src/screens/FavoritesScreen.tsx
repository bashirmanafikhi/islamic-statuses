import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    View,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    BackHandler,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';

import StoryCard from '../components/StoryCard';
import { FavoriteCard, CardData } from '../types';
import { getFavorites, removeFavorite } from '../utils/favorites';
import { getAyahById } from '../utils/dataLoader';
import { getBackgroundByIndex } from '../constants/images';

const { width } = Dimensions.get('window');

interface FavoritesScreenProps {
    onBack: () => void;
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ onBack }) => {
    const insets = useSafeAreaInsets();
    // Use full window height + status bar + navigation bar for true fullscreen
    const screenHeight = Dimensions.get('window').height + insets.top + insets.bottom;

    const [favorites, setFavorites] = useState<FavoriteCard[]>([]);
    const [cards, setCards] = useState<CardData[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    const cardRefs = useRef<{ [key: string]: View | null }>({});

    // Load favorites
    useEffect(() => {
        loadFavorites();
    }, []);

    // Handle Android back button
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            onBack();
            return true; // Prevent default behavior (exit app)
        });

        return () => backHandler.remove();
    }, [onBack]);

    const loadFavorites = async () => {
        setLoading(true);
        const favs = await getFavorites();
        setFavorites(favs);

        // Convert favorites to cards
        const cardData: CardData[] = favs.map(fav => {
            const ayahData = getAyahById(fav.ayahId);
            return {
                id: fav.id,
                ayah: ayahData!.ayah,
                surah: ayahData!.surah,
                backgroundImage: getBackgroundByIndex(fav.backgroundIndex),
                backgroundIndex: fav.backgroundIndex,
                fontFamily: fav.fontFamily,
            };
        }).filter(card => card.ayah); // Filter out any null ayahs

        setCards(cardData);
        setLoading(false);
    };

    const handleRemoveFavorite = async (id: string) => {
        await removeFavorite(id);
        loadFavorites();
    };

    const handleShare = async (index: number) => {
        try {
            const card = cards[index];
            if (!card) {
                console.error('Card not found at index:', index);
                return;
            }

            const ref = cardRefs.current[card.id];
            if (!ref) {
                console.error('Ref not found for card:', card.id);
                return;
            }

            const uri = await captureRef(ref, {
                format: 'png',
                quality: 1,
                result: 'tmpfile',
            });

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
    };

    const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index);
        }
    }, []);

    const renderCard = useCallback(({ item, index }: { item: CardData; index: number }) => {
        const isCurrentCard = index === currentIndex;

        return (
            <View style={[styles.cardWrapper, { height: screenHeight }]}>
                <StoryCard
                    ref={(ref) => { cardRefs.current[item.id] = ref; }}
                    ayah={item.ayah}
                    surah={item.surah}
                    backgroundImage={item.backgroundImage}
                    fontFamily={item.fontFamily}
                    height={screenHeight}
                    showWatermark={true}
                />

                {/* Action buttons */}
                {isCurrentCard && (
                    <View style={styles.actions}>
                        {/* Remove from favorites */}
                        <TouchableOpacity
                            style={[styles.actionButton, styles.removeButton]}
                            onPress={() => handleRemoveFavorite(item.id)}
                        >
                            <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
                        </TouchableOpacity>

                        {/* Share */}
                        <TouchableOpacity
                            style={[styles.actionButton, styles.shareButton]}
                            onPress={() => handleShare(index)}
                        >
                            <Ionicons name="share-social-outline" size={28} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }, [currentIndex, screenHeight]);

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#FFD700" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-forward" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>المفضلة</Text>
                <View style={styles.headerRight}>
                    <Text style={styles.countText}>{favorites.length}</Text>
                </View>
            </View>

            {cards.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="bookmark-outline" size={80} color="rgba(255, 215, 0, 0.3)" />
                    <Text style={styles.emptyText}>لا توجد عناصر مفضلة</Text>
                    <Text style={styles.emptySubtext}>اضغط على أيقونة الإشارة المرجعية لحفظ الآيات</Text>
                </View>
            ) : (
                <FlatList
                    data={cards}
                    renderItem={renderCard}
                    keyExtractor={item => item.id}
                    pagingEnabled
                    showsVerticalScrollIndicator={false}
                    snapToInterval={screenHeight}
                    snapToAlignment="start"
                    decelerationRate="fast"
                    onViewableItemsChanged={onViewableItemsChanged}
                    viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
                    getItemLayout={(data, index) => ({
                        length: screenHeight,
                        offset: screenHeight * index,
                        index,
                    })}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    headerRight: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    countText: {
        fontSize: 16,
        color: '#FFD700',
        fontWeight: 'bold',
    },
    cardWrapper: {
        position: 'relative',
    },
    actions: {
        position: 'absolute',
        bottom: 50,
        right: 20,
        flexDirection: 'column',
        gap: 16,
    },
    actionButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    removeButton: {
        borderColor: 'rgba(255, 107, 107, 0.5)',
    },
    shareButton: {
        backgroundColor: 'rgba(255, 215, 0, 0.3)',
        borderColor: 'rgba(255, 215, 0, 0.5)',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyText: {
        fontSize: 22,
        color: '#FFFFFF',
        marginTop: 20,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.6)',
        marginTop: 8,
        textAlign: 'center',
    },
});

export default FavoritesScreen;

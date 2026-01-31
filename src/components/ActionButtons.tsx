import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionButtonsProps {
    onShare: () => void;
    onCustomize: () => void;
    onFavorite: () => void;
    onMenu: () => void;
    onAudio: () => void;
    onToggleTafseer: () => void;
    tafseerState: number; // 0: None, 1: Muyassar, 2: Ma3any
    isFavorite: boolean;
    isPlaying: boolean;
}

/**
 * ActionButtons Component
 * Floating action buttons with improved hierarchy and ergonomics
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({
    onShare,
    onCustomize,
    onFavorite,
    onMenu,
    onAudio,
    onToggleTafseer,
    tafseerState,
    isFavorite,
    isPlaying,
}) => {
    return (
        <View style={styles.container}>
            {/* Top actions */}
            <View style={styles.topActions}>
                {/* Menu */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={onMenu}
                    activeOpacity={0.7}
                >
                    <Ionicons name="menu" size={28} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Audio */}
                <TouchableOpacity
                    style={[styles.button, isPlaying && styles.audioActive]}
                    onPress={onAudio}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={isPlaying ? 'pause' : 'volume-medium'}
                        size={28}
                        color={isPlaying ? '#4FACFE' : '#FFFFFF'}
                    />
                </TouchableOpacity>
            </View>

            {/* Bottom actions */}
            <View style={styles.bottomActions}>
                {/* Favorite */}
                <TouchableOpacity
                    style={[styles.button, isFavorite && styles.favoriteActive]}
                    onPress={onFavorite}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={isFavorite ? 'heart' : 'heart-outline'}
                        size={28}
                        color={isFavorite ? '#FF6B6B' : '#FFFFFF'}
                    />
                </TouchableOpacity>

                {/* Tafseer */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        tafseerState > 0 && styles.tafseerActive,
                    ]}
                    onPress={onToggleTafseer}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name={tafseerState === 0 ? 'book-outline' : 'book'}
                        size={26}
                        color={tafseerState > 0 ? '#FFD700' : '#FFFFFF'}
                    />
                    {tafseerState > 0 && (
                        <View style={styles.stateIndicator}>
                            <Text style={styles.stateText}>
                                {tafseerState === 1 ? 'ت' : 'م'}
                            </Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Customize */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={onCustomize}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="color-palette-outline"
                        size={28}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>

                {/* Share */}
                <TouchableOpacity
                    style={[styles.button, styles.shareButton]}
                    onPress={onShare}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="share-social-outline"
                        size={28}
                        color="#FFFFFF"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        right: 20,
        top: 60,
        bottom: 50,
        justifyContent: 'space-between',
    },
    topActions: {
        gap: 16,
    },
    bottomActions: {
        gap: 16,
    },
    button: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    favoriteActive: {
        backgroundColor: 'rgba(255, 107, 107, 0.2)',
        borderColor: 'rgba(255, 107, 107, 0.5)',
    },
    tafseerActive: {
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        borderColor: 'rgba(255, 215, 0, 0.5)',
    },
    audioActive: {
        backgroundColor: 'rgba(79, 172, 254, 0.2)',
        borderColor: 'rgba(79, 172, 254, 0.5)',
    },
    shareButton: {
        backgroundColor: 'rgba(255, 215, 0, 0.3)',
        borderColor: 'rgba(255, 215, 0, 0.5)',
    },
    stateIndicator: {
        position: 'absolute',
        top: -4,
        right: -4,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
    },
    stateText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#000000',
    },
});

export default ActionButtons;

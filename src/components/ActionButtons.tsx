import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ActionButtonsProps {
    onShare: () => void;
    onCustomize: () => void;
    onFavorite: () => void;
    onGoToFavorites: () => void;
    isFavorite: boolean;
}

/**
 * ActionButtons Component
 * Floating buttons for Share, Customize, and Favorite actions
 */
const ActionButtons: React.FC<ActionButtonsProps> = ({
    onShare,
    onCustomize,
    onFavorite,
    onGoToFavorites,
    isFavorite,
}) => {
    return (
        <View style={styles.container}>
            {/* Go to Favorites */}
            <TouchableOpacity
                style={styles.button}
                onPress={onGoToFavorites}
                activeOpacity={0.7}
            >
                <Ionicons name="list" size={24} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Favorite Button */}
            <TouchableOpacity
                style={[styles.button, isFavorite && styles.favoriteActive]}
                onPress={onFavorite}
                activeOpacity={0.7}
            >
                <Ionicons
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={28}
                    color={isFavorite ? "#FF6B6B" : "#FFFFFF"}
                />
            </TouchableOpacity>

            {/* Customize Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={onCustomize}
                activeOpacity={0.7}
            >
                <Ionicons name="color-palette-outline" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity
                style={[styles.button, styles.shareButton]}
                onPress={onShare}
                activeOpacity={0.7}
            >
                <Ionicons name="share-social-outline" size={28} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 50,
        right: 20,
        flexDirection: 'column',
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
    shareButton: {
        backgroundColor: 'rgba(255, 215, 0, 0.3)',
        borderColor: 'rgba(255, 215, 0, 0.5)',
    },
});

export default ActionButtons;

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    StyleSheet,
    Dimensions,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BACKGROUND_IMAGES } from '../constants/images';
import { Ayah, Surah, Hadith } from '../types';
import StoryCard from './StoryCard';

const { width } = Dimensions.get('window');
const THUMBNAIL_SIZE = (width - 60) / 4;
const PREVIEW_HEIGHT = 280;

interface CustomizationModalProps {
    visible: boolean;
    onClose: () => void;
    onNewAyah: () => void;
    onSelectBackground: (index: number) => void;
    onRandomFont: () => void;
    onShare: () => void;
    selectedBackgroundIndex: number;
    // Preview data
    type: 'quran' | 'hadith';
    previewAyah?: Ayah;
    previewSurah?: Surah;
    previewHadith?: Hadith;
    previewBackground: any;
    previewFont: string;
}

/**
 * CustomizationModal Component
 * Bottom sheet for customizing the current card with live preview
 */
const CustomizationModal: React.FC<CustomizationModalProps> = ({
    visible,
    onClose,
    onNewAyah,
    onSelectBackground,
    onRandomFont,
    onShare,
    selectedBackgroundIndex,
    type,
    previewAyah,
    previewSurah,
    previewHadith,
    previewBackground,
    previewFont,
}) => {
    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableOpacity style={styles.dismissArea} onPress={onClose} />

                <View style={styles.container}>
                    {/* Handle */}
                    <View style={styles.handle} />

                    {/* Live Preview */}
                    <View style={styles.previewContainer}>
                        <Text style={styles.previewLabel}>المعاينة</Text>
                        <View style={styles.previewCard}>
                            <StoryCard
                                type={type}
                                ayah={previewAyah}
                                surah={previewSurah}
                                hadith={previewHadith}
                                backgroundImage={previewBackground}
                                fontFamily={previewFont}
                                height={PREVIEW_HEIGHT}
                                compact={true}
                            />
                        </View>
                    </View>

                    {/* Action Buttons Row */}
                    <View style={styles.actionsRow}>
                        {/* New Item */}
                        <TouchableOpacity style={styles.actionButton} onPress={onNewAyah}>
                            <View style={styles.actionIconContainer}>
                                <Ionicons name="refresh" size={24} color="#FFD700" />
                            </View>
                            <Text style={styles.actionText}>{type === 'quran' ? 'آية جديدة' : 'حديث جديد'}</Text>
                        </TouchableOpacity>

                        {/* Random Font */}
                        <TouchableOpacity style={styles.actionButton} onPress={onRandomFont}>
                            <View style={styles.actionIconContainer}>
                                <Ionicons name="text" size={24} color="#FFD700" />
                            </View>
                            <Text style={styles.actionText}>خط جديد</Text>
                        </TouchableOpacity>

                        {/* Share */}
                        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
                            <View style={[styles.actionIconContainer, styles.shareIcon]}>
                                <Ionicons name="share-social" size={24} color="#FFFFFF" />
                            </View>
                            <Text style={styles.actionText}>مشاركة</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Background Picker */}
                    <Text style={styles.sectionTitle}>اختر الخلفية</Text>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.backgroundsContainer}
                    >
                        {/* Random Background Option */}
                        <TouchableOpacity
                            style={styles.randomBackgroundButton}
                            onPress={() => {
                                const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
                                onSelectBackground(randomIndex);
                            }}
                        >
                            <Ionicons name="shuffle" size={24} color="#FFD700" />
                            <Text style={styles.randomText}>عشوائي</Text>
                        </TouchableOpacity>

                        {BACKGROUND_IMAGES.map((image, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.thumbnailContainer,
                                    selectedBackgroundIndex === index && styles.selectedThumbnail,
                                ]}
                                onPress={() => onSelectBackground(index)}
                            >
                                <Image source={image} style={styles.thumbnail} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Done Button */}
                    <TouchableOpacity style={styles.doneButton} onPress={onClose}>
                        <Text style={styles.doneButtonText}>تم</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    dismissArea: {
        flex: 1,
    },
    container: {
        backgroundColor: '#1a1a2e',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 40,
        maxHeight: '85%',
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 12,
    },
    previewContainer: {
        marginBottom: 16,
    },
    previewLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'right',
        marginBottom: 8,
    },
    previewCard: {
        borderRadius: 16,
        overflow: 'hidden',
        height: PREVIEW_HEIGHT,
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    actionButton: {
        alignItems: 'center',
        gap: 8,
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 215, 0, 0.3)',
    },
    shareIcon: {
        backgroundColor: 'rgba(255, 215, 0, 0.4)',
    },
    actionText: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    sectionTitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        marginBottom: 10,
        textAlign: 'right',
    },
    backgroundsContainer: {
        paddingVertical: 8,
        gap: 8,
    },
    randomBackgroundButton: {
        width: THUMBNAIL_SIZE,
        height: THUMBNAIL_SIZE,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 215, 0, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 215, 0, 0.5)',
        borderStyle: 'dashed',
        marginRight: 8,
    },
    randomText: {
        fontSize: 10,
        color: '#FFD700',
        marginTop: 4,
    },
    thumbnailContainer: {
        width: THUMBNAIL_SIZE,
        height: THUMBNAIL_SIZE,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: 8,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedThumbnail: {
        borderColor: '#FFD700',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    doneButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 14,
        borderRadius: 12,
        marginTop: 16,
    },
    doneButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a2e',
        textAlign: 'center',
    },
});

export default CustomizationModal;

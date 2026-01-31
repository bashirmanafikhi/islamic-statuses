import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ContentFilter } from '../types';
import { AppActionsService } from '@/utils/AppActionsService';

const { width } = Dimensions.get('window');

interface AppMenuModalProps {
    visible: boolean;
    onClose: () => void;
    onGoToFavorites: () => void;
    contentFilter: ContentFilter;
    onSetContentFilter: (filter: ContentFilter) => void;
}

const AppMenuModal: React.FC<AppMenuModalProps> = ({
    visible,
    onClose,
    onGoToFavorites,
    contentFilter,
    onSetContentFilter,
}) => {
    const filterOptions: { id: ContentFilter; label: string; icon: any }[] = [
        { id: 'quran', label: 'قرآن فقط', icon: 'book' },
        { id: 'hadith', label: 'حديث فقط', icon: 'list' },
        { id: 'both', label: 'الكل', icon: 'apps' },
    ];

    const menuItems = [
        {
            icon: 'heart',
            label: 'الآيات المفضلة',
            onPress: () => {
                onClose();
                onGoToFavorites();
            },
            color: '#FF6B6B',
        },
        // ... (other menu items)
        {
            icon: 'star',
            label: 'تقييم التطبيق',
            onPress: () => {
                onClose();
                AppActionsService.rateApp();
            },
            color: '#FFD700',
        },
        {
            icon: 'share-social',
            label: 'مشاركة التطبيق',
            onPress: () => {
                onClose();
                AppActionsService.shareApp();
            },
            color: '#4FACFE',
        },
        {
            icon: 'mail',
            label: 'ارسال ملاحظات',
            onPress: () => {
                onClose();
                AppActionsService.sendFeedback();
            },
            color: '#A8EDEA',
        },
    ];

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.container}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>القائمة</Text>
                            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                                <Ionicons name="close" size={32} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Content Filter Section */}
                        <View style={styles.filterSection}>
                            <Text style={styles.sectionTitle}>نوع المحتوى</Text>
                            <View style={styles.filterOptions}>
                                {filterOptions.map((opt) => (
                                    <TouchableOpacity
                                        key={opt.id}
                                        style={[
                                            styles.filterOption,
                                            contentFilter === opt.id && styles.filterOptionActive,
                                        ]}
                                        onPress={() => onSetContentFilter(opt.id)}
                                    >
                                        <Ionicons
                                            name={opt.icon}
                                            size={20}
                                            color={contentFilter === opt.id ? '#FFD700' : 'rgba(255, 255, 255, 0.6)'}
                                        />
                                        <Text
                                            style={[
                                                styles.filterLabel,
                                                contentFilter === opt.id && styles.filterLabelActive,
                                            ]}
                                        >
                                            {opt.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Menu Items */}
                        <View style={styles.menuList}>
                            {menuItems.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.menuItem}
                                    onPress={item.onPress}
                                    activeOpacity={0.7}
                                >
                                    <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                                        <Ionicons name={item.icon as any} size={28} color={item.color} />
                                    </View>
                                    <Text style={styles.menuLabel}>{item.label}</Text>
                                    <Ionicons name="chevron-back" size={20} color="rgba(255, 255, 255, 0.3)" />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={styles.footerText}>إصدار 1.0.0</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
    },
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'System', // Use a default or specific font if desired
    },
    closeButton: {
        padding: 5,
    },
    menuList: {
        gap: 16,
    },
    menuItem: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 16,
    },
    menuLabel: {
        flex: 1,
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'right',
        fontWeight: '500',
    },
    filterSection: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.5)',
        marginBottom: 12,
        textAlign: 'right',
        paddingHorizontal: 5,
    },
    filterOptions: {
        flexDirection: 'row-reverse',
        gap: 10,
    },
    filterOption: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        gap: 8,
    },
    filterOptionActive: {
        backgroundColor: 'rgba(255, 215, 0, 0.1)',
        borderColor: 'rgba(255, 215, 0, 0.4)',
    },
    filterLabel: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
        fontWeight: '500',
    },
    filterLabelActive: {
        color: '#FFD700',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 14,
    },
});

export default AppMenuModal;

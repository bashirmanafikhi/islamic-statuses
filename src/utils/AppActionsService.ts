import { Linking, Share } from 'react-native';

export class AppActionsService {
    static async rateApp() {
        try {
            // Updated with current app ID if available, otherwise using placeholder or Mutqen ID as requested
            const url = 'https://play.google.com/store/apps/details?id=com.bashirmanafikhi.islamicstatuses';
            await Linking.openURL(url);
        } catch (e) {
            console.warn('Unable to open store URL', e);
        }
    }

    static async shareApp() {
        try {
            const message = 'جرب تطبيق حالات ستوري إسلامية: \nhttps://play.google.com/store/apps/details?id=com.bashirmanafikhi.islamicstatuses';
            await Share.share({ message });
        } catch (e) {
            console.warn('Unable to share app', e);
        }
    }

    static async sendFeedback() {
        try {
            const email = 'bashir.manafikhi@gmail.com';
            const subject = encodeURIComponent('ملاحظات حول تطبيق حالات ستوري إسلامية');
            const body = encodeURIComponent('السلام عليكم،\n\nلدي الملاحظات التالية:\n\n');
            const mailUrl = `mailto:${email}?subject=${subject}&body=${body}`;
            await Linking.openURL(mailUrl);
        } catch (e) {
            console.warn('Unable to open email app', e);
        }
    }
}

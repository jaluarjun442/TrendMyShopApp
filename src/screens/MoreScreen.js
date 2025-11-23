import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import Theme from '../theme/Theme';
import { getAppSettings } from '../api/settingsApi';
import { Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AdBanner from '../components/AdBanner';

// Optional static version (you can update later)
const APP_VERSION = '1.0.0';

export default function MoreScreen() {
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [initialLoaded, setInitialLoaded] = useState(false);

    const fetchSettings = async isRefresh => {
        if (loading && !isRefresh) {
            return;
        }

        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        const res = await getAppSettings();

        if (res.status) {
            setSettings(res.data || {});
        } else {
            Alert.alert('Error', 'Unable to load app settings.');
        }

        setInitialLoaded(true);
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => {
        fetchSettings(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onRefresh = useCallback(() => {
        fetchSettings(true);
    }, []);

    const handleOpenLink = url => {
        if (!url) {
            Alert.alert('Info', 'Link not available.');
            return;
        }

        let finalUrl = url.trim().replace(/\s/g, '');

        if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
            finalUrl = 'https://' + finalUrl;
        }

        Linking.openURL(finalUrl).catch(err => {
            console.log('openURL error:', err);
            Alert.alert('Error', 'Failed to open the link.');
        });
    };

    // Generate list only for available links
    const rawMenuItems = [
        { key: 'about', title: 'About Us', icon: 'info-outline', link: settings.about_us },
        { key: 'privacy', title: 'Privacy Policy', icon: 'privacy-tip', link: settings.privacy_policy },
        { key: 'terms', title: 'Terms & Conditions', icon: 'gavel', link: settings.terms_conditions },
        { key: 'refund', title: 'Refund Policy', icon: 'receipt-long', link: settings.refund_policy },
        { key: 'help', title: 'Help Center', icon: 'help-outline', link: settings.help_center },
        { key: 'contact', title: 'Contact Us', icon: 'phone-in-talk', link: settings.contact_us },
        { key: 'rate', title: 'Rate this App', icon: 'star-rate', link: settings.play_store },
    ];

    // Filter out invalid or empty links
    const menuItems = rawMenuItems.filter(
        item => item.link && item.link.toString().trim() !== ''
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.row}
            onPress={() => handleOpenLink(item.link)}>
            <View style={styles.rowLeft}>
                <Icon
                    name={item.icon}
                    size={22}
                    color={Theme.COLORS.primary}
                    style={styles.rowIcon}
                />
                <Text style={styles.rowText}>{item.title}</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
    );

    if (loading && !refreshing && !initialLoaded) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Theme.COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={menuItems}
                keyExtractor={item => item.key}
                renderItem={renderItem}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Theme.COLORS.primary]}
                        tintColor={Theme.COLORS.primary}
                    />
                }
                ListFooterComponent={
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>TrendMyShop v{APP_VERSION}</Text>
                        {/* <AdBanner variant="MEDIUM_RECTANGLE" /> */}
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Theme.SIZES.padding,
        paddingVertical: 14,
        backgroundColor: '#fff',
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    rowIcon: {
        marginRight: 12,
    },
    rowText: {
        fontSize: 15,
        fontWeight: '500',
        color: Theme.COLORS.text,
    },
    separator: {
        height: 1,
        backgroundColor: Theme.COLORS.border,
        marginLeft: Theme.SIZES.padding + 34, // align with text (icon width + margin)
    },
    footer: {
        paddingVertical: 16,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Theme.COLORS.border,
        marginTop: 8,
    },
    footerText: {
        fontSize: 13,
        color: '#777',
    },
});

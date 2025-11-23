import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
    BannerAd,
    BannerAdSize,
    TestIds,
} from 'react-native-google-mobile-ads';

// For now, use AdMob test unit ID
const BANNER_AD_UNIT_ID = TestIds.BANNER;
// Or later: const BANNER_AD_UNIT_ID = 'your-real-unit-id';

const sizeMap = {
    BANNER: BannerAdSize.BANNER,
    LARGE_BANNER: BannerAdSize.LARGE_BANNER,
    MEDIUM_RECTANGLE: BannerAdSize.MEDIUM_RECTANGLE,
    FULL_BANNER: BannerAdSize.FULL_BANNER,
};

export default function AdBanner({ variant = 'BANNER', style }) {
    const adSize = sizeMap[variant] || BannerAdSize.BANNER;

    return (
        <View style={[styles.container, style]}>
            <BannerAd
                unitId={BANNER_AD_UNIT_ID}
                size={adSize}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true,
                }}
                onAdFailedToLoad={error => {
                    console.log('Banner ad failed to load: ', error);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 5
    },
});

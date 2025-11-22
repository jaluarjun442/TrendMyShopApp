import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Theme from '../theme/Theme';

const ROW_COUNT_DEFAULT = 10;

export default function ProductListSkeleton({ rows = ROW_COUNT_DEFAULT }) {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0.3,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ]),
        );
        loop.start();

        return () => loop.stop();
    }, [opacity]);

    const items = Array.from({ length: rows });

    return (
        <View>
            {items.map((_, index) => (
                <Animated.View key={index} style={[styles.row, { opacity }]}>
                    {/* Left thumbnail */}
                    <View style={styles.thumbnail} />

                    {/* Right text skeletons */}
                    <View style={styles.infoContainer}>
                        <View style={styles.lineShort} />
                        <View style={styles.lineLong} />
                    </View>

                    {/* Heart placeholder */}
                    <View style={styles.heart} />
                </Animated.View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
    },
    thumbnail: {
        width: 56,
        height: 56,
        borderRadius: 4,
        backgroundColor: Theme.COLORS.lightGray,
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    lineShort: {
        width: '70%',
        height: 12,
        borderRadius: 4,
        backgroundColor: Theme.COLORS.lightGray,
        marginBottom: 6,
    },
    lineLong: {
        width: '40%',
        height: 12,
        borderRadius: 4,
        backgroundColor: Theme.COLORS.lightGray,
    },
    heart: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: Theme.COLORS.lightGray,
        marginLeft: 6,
    },
});

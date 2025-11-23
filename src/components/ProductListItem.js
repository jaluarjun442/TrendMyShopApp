import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import Theme from '../theme/Theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function ProductListItem({
    item,
    onPress,
    onToggleWishlist,
    isFav,
    showPrice = true,
}) {
    return (
        <TouchableOpacity style={styles.row} onPress={onPress}>
            {item.image ? (
                <Image source={{ uri: item.image }} style={styles.thumbnail} />
            ) : (
                <View style={styles.thumbnailPlaceholder}>
                    <Text style={styles.thumbnailPlaceholderText}>
                        {item.name?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                </View>
            )}

            <View style={styles.infoContainer}>
                <Text style={styles.name} numberOfLines={2}>
                    {item.name}
                </Text>
                {showPrice && (
                    <Text style={styles.price}>
                        ₹ {item.discount_price ?? item.price}
                    </Text>
                )}
            </View>

            <TouchableOpacity
                style={styles.heartButton}
                onPress={onToggleWishlist}>
                <Icon
                    name={isFav ? 'favorite' : 'favorite-border'}
                    size={22}
                    color={isFav ? 'skyblue' : '#999'}
                />
            </TouchableOpacity>
        </TouchableOpacity>
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
    thumbnailPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 4,
        backgroundColor: Theme.COLORS.primary,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    thumbnailPlaceholderText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 3,
    },
    price: {
        fontSize: 14,
        color: Theme.COLORS.primary,
        fontWeight: '700',
    },
    heartButton: {
        padding: 6,
        marginLeft: 6,
    },
});

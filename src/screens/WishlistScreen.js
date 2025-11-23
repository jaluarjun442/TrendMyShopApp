import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
} from 'react-native';
import Theme from '../theme/Theme';
import { WishlistContext } from '../context/WishlistContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProductListItem from '../components/ProductListItem';
import commonStyles from '../styles/common';
import AdBanner from '../components/AdBanner';

export default function WishlistScreen({ navigation }) {
    const { wishlist, toggleWishlist, isInWishlist } = useContext(WishlistContext);

    const renderItem = ({ item }) => {
        const isFav = isInWishlist(item.id);

        return (
            <ProductListItem
                item={item}
                isFav={isFav}
                showPrice={false}
                onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
                onToggleWishlist={() => toggleWishlist(item)}
            />
        );
    };

    if (!wishlist || wishlist.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Icon name="favorite-border" size={40} color={Theme.COLORS.border} />
                <Text style={styles.emptyText}>No products in wishlist yet.</Text>
            </View>
        );
    }

    return (
        <View style={commonStyles.screenContainer}>
            <FlatList
                data={wishlist}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                ItemSeparatorComponent={() => (
                    <View style={commonStyles.listSeparator} />
                )}
                showsVerticalScrollIndicator={false}
            />
            <AdBanner variant="BANNER" />
        </View>
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    emptyText: {
        marginTop: 8,
        fontSize: 15,
        color: '#666',
    },
});

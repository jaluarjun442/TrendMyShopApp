import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import Theme from '../theme/Theme';
import { WishlistContext } from '../context/WishlistContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function WishlistScreen({ navigation }) {
    const { wishlist, toggleWishlist } = useContext(WishlistContext);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.heartButton}
                onPress={() => toggleWishlist(item)}>
                <Icon name="favorite" size={20} color="red" />
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.cardContent}
                onPress={() => navigation.navigate('ProductDetail', { id: item.id })}>
                {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.image} />
                ) : null}
                <Text style={styles.name} numberOfLines={2}>
                    {item.name}
                </Text>
                <Text style={styles.price}>
                    ₹ {item.discount_price ?? item.price}
                </Text>
            </TouchableOpacity>
        </View>
    );

    if (!wishlist || wishlist.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Icon name="favorite-border" size={40} color={Theme.COLORS.border} />
                <Text style={styles.emptyText}>No products in wishlist yet.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={wishlist}
                numColumns={2}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Theme.SIZES.padding,
        backgroundColor: '#fff',
    },
    card: {
        flex: 1,
        backgroundColor: Theme.COLORS.lightGray,
        margin: 8,
        padding: 10,
        borderRadius: 0,
        borderWidth: 1,
        borderColor: Theme.COLORS.border,
        position: 'relative',
    },
    cardContent: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 120,
        resizeMode: 'cover',
        borderRadius: 0,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 6,
    },
    price: {
        fontSize: 14,
        color: Theme.COLORS.primary,
        fontWeight: 'bold',
        marginTop: 4,
    },
    heartButton: {
        position: 'absolute',
        top: 6,
        right: 6,
        zIndex: 10,
        padding: 4,
    },
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

import React, { useEffect, useState, useCallback } from 'react';
import { WishlistContext } from '../context/WishlistContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Alert,
    RefreshControl,
} from 'react-native';
import Theme from '../theme/Theme';
import { getProductById } from '../api/productApi';
import { Linking } from 'react-native';

export default function ProductDetailScreen({ route, navigation }) {
    const { id } = route.params || {};

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [initialLoaded, setInitialLoaded] = useState(false);
    const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

    const fetchProduct = async isRefresh => {
        if (!id) {
            return;
        }

        if (isRefresh) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }

        const res = await getProductById(id);

        if (res.status && res.item) {
            setProduct(res.item);

            // 🔹 Set header title to product name dynamically
            navigation.setOptions({
                title: res.item.name || 'Product',
                headerRight: () => (
                    <TouchableOpacity onPress={() => toggleWishlist(res.item)} style={{ marginRight: 15 }}>
                        <Icon
                            name={isInWishlist(res.item.id) ? 'favorite' : 'favorite-border'}
                            size={24}
                            color={isInWishlist(res.item.id) ? 'skyblue' : '#fff'}
                        />
                    </TouchableOpacity>
                ),
            });
        } else {
            navigation.setOptions({ title: 'Product' });
            Alert.alert('Error', 'Unable to load product details.');
        }

        setInitialLoaded(true);
        setLoading(false);
        setRefreshing(false);
    };

    // Existing effect → fetch product & set temporary title
    useEffect(() => {
        navigation.setOptions({ title: 'Loading...' });
        fetchProduct(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // 🔥 New effect → update wishlist icon when status changes
    useEffect(() => {
        if (product) {
            navigation.setOptions({
                title: product.name || 'Product',
                headerRight: () => (
                    <TouchableOpacity
                        onPress={() => toggleWishlist(product)}
                        style={{ marginRight: 15 }}>
                        <Icon
                            name={isInWishlist(product.id) ? 'favorite' : 'favorite-border'}
                            size={24}
                            color={isInWishlist(product.id) ? 'skyblue' : '#fff'}
                        />
                    </TouchableOpacity>
                )
            });
        }
    }, [product, isInWishlist(product?.id)]);


    const onRefresh = useCallback(() => {
        fetchProduct(true);
    }, [id]);

    const handleBuyNow = () => {
        let url = product?.aff_link;

        if (!url) {
            Alert.alert('Info', 'Buy link not available.');
            return;
        }

        url = url.trim();

        // Remove any spaces/newlines in between (just in case)
        url = url.replace(/\s/g, '');

        // Ensure protocol exists
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }

        console.log('BUY NOW URL =>', url);

        Linking.openURL(url).catch(err => {
            console.log('openURL error =>', err);
            Alert.alert('Error', 'Failed to open the link.');
        });
    };



    if (loading && !refreshing && !initialLoaded) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Theme.COLORS.primary} />
            </View>
        );
    }

    if (!loading && initialLoaded && !product) {
        return (
            <View style={styles.center}>
                <Text style={styles.emptyText}>Product not found.</Text>
            </View>
        );
    }

    const price = product?.price;
    const discountPrice = product?.discount_price;

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[Theme.COLORS.primary]}
                    tintColor={Theme.COLORS.primary}
                />
            }>
            <View style={styles.card}>
                {product?.image ? (
                    <Image source={{ uri: product.image }} style={styles.image} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={styles.imagePlaceholderText}>
                            {product?.name?.charAt(0)?.toUpperCase() || '?'}
                        </Text>
                    </View>
                )}

                <Text style={styles.name}>{product?.name}</Text>



                {product?.category_name ? (
                    <Text style={styles.category}>Category: {product.category_name}</Text>
                ) : null}

                {product?.description ? (
                    <Text style={styles.description}>{product.description}</Text>
                ) : (
                    <Text style={styles.descriptionMuted}>
                        No description available.
                    </Text>
                )}

                <TouchableOpacity style={styles.buyButton} onPress={handleBuyNow}>
                    <Text style={styles.buyButtonText}>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Theme.SIZES.padding,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    card: {
        backgroundColor: Theme.COLORS.lightGray,
        borderRadius: 0,
        padding: 16,
        borderWidth: 1,
        borderColor: Theme.COLORS.border,
    },
    image: {
        width: '100%',
        height: 220,
        resizeMode: 'cover',
        borderRadius: 0,
        marginBottom: 12,
    },
    imagePlaceholder: {
        width: '100%',
        height: 220,
        borderRadius: 0,
        backgroundColor: Theme.COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    imagePlaceholderText: {
        color: '#fff',
        fontSize: 40,
        fontWeight: '700',
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 8,
        color: Theme.COLORS.text,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    discountPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: Theme.COLORS.primary,
        marginRight: 8,
    },
    originalPrice: {
        fontSize: 14,
        color: '#888',
        textDecorationLine: 'line-through',
    },
    sku: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    category: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12,
    },
    description: {
        fontSize: 14,
        color: Theme.COLORS.text,
        marginBottom: 16,
    },
    descriptionMuted: {
        fontSize: 14,
        color: '#777',
        marginBottom: 16,
    },
    buyButton: {
        marginTop: 8,
        paddingVertical: 12,
        backgroundColor: Theme.COLORS.primary,
        borderRadius: 0,
        alignItems: 'center',
    },
    buyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyText: {
        fontSize: 16,
        color: Theme.COLORS.text,
    },
});

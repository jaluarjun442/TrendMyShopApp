import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import Theme from '../theme/Theme';
import {getProducts} from '../api/productApi';

const PAGE_SIZE = 15;

export default function CategoryProductsScreen({route, navigation}) {
  const {categoryId, categoryName} = route.params || {};

  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const fetchPage = async (pageToLoad = 1, isRefresh = false) => {
    if (loadingMore && !isRefresh) {
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoadingMore(true);
    }

    const res = await getProducts(pageToLoad, {category_id: categoryId});

    if (res.status) {
      const newItems = res.items || [];

      if (isRefresh) {
        setData(newItems);
        setPage(2);
        setHasMore(newItems.length >= PAGE_SIZE);
      } else {
        if (newItems.length > 0) {
          setData(prev => [...prev, ...newItems]);
          setPage(prev => prev + 1);
          if (newItems.length < PAGE_SIZE) {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      }
    }

    setInitialLoaded(true);
    if (isRefresh) {
      setRefreshing(false);
    } else {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const onRefresh = useCallback(() => {
    setHasMore(true);
    fetchPage(1, true);
  }, [categoryId]);

  const loadMore = () => {
    if (!hasMore || loadingMore || refreshing) return;
    fetchPage(page, false);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', {id: item.id})}>
      {item.image ? (
        <Image source={{uri: item.image}} style={styles.image} />
      ) : null}
      <Text style={styles.name} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.price}>
        ₹ {item.discount_price ?? item.price}
      </Text>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={Theme.COLORS.primary} />
      </View>
    );
  };

  if (!refreshing && !loadingMore && initialLoaded && data.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>
          No products found in {categoryName || 'this category'}.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Theme.COLORS.primary]}
            tintColor={Theme.COLORS.primary}
          />
        }
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
  footer: {
    paddingVertical: 16,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Theme.COLORS.text,
    textAlign: 'center',
  },
});

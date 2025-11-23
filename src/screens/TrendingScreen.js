import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Theme from '../theme/Theme';
import { getTrendingProducts } from '../api/productApi';
import { WishlistContext } from '../context/WishlistContext';
import ProductListItem from '../components/ProductListItem';
import commonStyles from '../styles/common';
import ProductListSkeleton from '../components/ProductListSkeleton';
import AdBanner from '../components/AdBanner';

const PAGE_SIZE = 15;

export default function TrendingScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);
  const isInitialLoading = !initialLoaded && (refreshing || loadingMore);

  const fetchPage = async (pageToLoad = 1, isRefresh = false) => {
    if (loadingMore && !isRefresh) {
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoadingMore(true);
    }

    const res = await getTrendingProducts(pageToLoad);

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
  }, []);

  const onRefresh = useCallback(() => {
    setHasMore(true);
    fetchPage(1, true);
  }, []);

  const loadMore = () => {
    if (!hasMore || loadingMore || refreshing) return;
    fetchPage(page, false);
  };

  const renderItem = ({ item }) => {
    const isFav = isInWishlist(item.id);

    return (
      <ProductListItem
        item={item}
        isFav={isFav}
        showPrice={false}
        onPress={() =>
          navigation.navigate('ProductDetail', {
            id: item.id,
          })
        }
        onToggleWishlist={() => toggleWishlist(item)}
      />
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={Theme.COLORS.primary} />
      </View>
    );
  };

  if (isInitialLoading) {
    return (
      <View style={commonStyles.screenContainer}>
        <ProductListSkeleton />
      </View>
    );
  }

  if (!refreshing && !loadingMore && initialLoaded && data.length === 0) {
    return (
      <View style={[commonStyles.screenContainer, styles.emptyContainer]}>
        <Text style={styles.emptyText}>No trending products found.</Text>
      </View>
    );
  }


  if (!initialLoaded && loadingMore && !refreshing) {
    return (
      <View style={[commonStyles.screenContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Theme.COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={commonStyles.screenContainer}>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View style={commonStyles.listSeparator} />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.8} // 👈 auto-fetch before last item
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
      <AdBanner variant="BANNER" />
    </View>
  );
}

const styles = StyleSheet.create({
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

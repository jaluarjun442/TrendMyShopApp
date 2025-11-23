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
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Theme from '../theme/Theme';
import { getProducts } from '../api/productApi';
import { WishlistContext } from '../context/WishlistContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProductListItem from '../components/ProductListItem';
import commonStyles from '../styles/common';
import ProductListSkeleton from '../components/ProductListSkeleton';

const PAGE_SIZE = 15;

export default function HomeScreen({ navigation }) {
  // state + hooks (same as working version)
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

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

    const res = await getProducts(pageToLoad, {
      search: appliedSearch || undefined,
    });

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
  }, [appliedSearch]);

  const onRefresh = useCallback(() => {
    setHasMore(true);
    fetchPage(1, true);
  }, [appliedSearch]);

  const loadMore = () => {
    if (!hasMore || loadingMore || refreshing) return;
    fetchPage(page, false);
  };

  const onSubmitSearch = () => {
    setHasMore(true);
    setAppliedSearch(searchText.trim());
  };

  const clearSearch = () => {
    setSearchText('');
    if (appliedSearch !== '') {
      setAppliedSearch('');
      setHasMore(true);
    }
  };

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBox}>
        <Icon
          name="search"
          size={20}
          color="#888"
          style={{ marginRight: 6 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          onSubmitEditing={onSubmitSearch}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={clearSearch}>
            <Icon name="close" size={18} color="#888" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.searchButton} onPress={onSubmitSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>
    </View>
  );

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
        {renderSearchBar()}
        <ProductListSkeleton />
      </View>
    );
  }

  // Empty state
  if (!refreshing && !loadingMore && initialLoaded && data.length === 0) {
    return (
      <View style={commonStyles.screenContainer}>
        {renderSearchBar()}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found.</Text>
        </View>
      </View>
    );
  }

  // Normal state
  return (
    <View style={commonStyles.screenContainer}>
      {renderSearchBar()}
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View style={commonStyles.listSeparator} />
        )}
        onEndReached={loadMore}
        onEndReachedThreshold={0.8}
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
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.COLORS.border,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  searchButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Theme.COLORS.primary,
    borderRadius: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Theme.COLORS.text,
  },
});

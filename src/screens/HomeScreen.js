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
  TouchableOpacity,
  Image,
  RefreshControl,
  TextInput,
} from 'react-native';
import Theme from '../theme/Theme';
import { getProducts } from '../api/productApi';
import { WishlistContext } from '../context/WishlistContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PAGE_SIZE = 15;

export default function HomeScreen({ navigation }) {
  // 🔹 All hooks are here at the top, in a fixed order

  // Data & pagination
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Search state
  const [searchText, setSearchText] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');

  // Wishlist context
  const { isInWishlist, toggleWishlist } = useContext(WishlistContext);

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
        setPage(2); // next page is 2
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

  // Initial & when appliedSearch changes
  useEffect(() => {
    fetchPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedSearch]);

  const onRefresh = useCallback(() => {
    setHasMore(true);
    fetchPage(1, true);
  }, [appliedSearch]);

  const loadMore = () => {
    if (!hasMore || loadingMore || refreshing) {
      return;
    }
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

  // 🔹 Rendering helpers

  const renderItem = ({ item }) => {
    const isFav = isInWishlist(item.id);

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleWishlist(item)}>
          <Icon
            name={isFav ? 'favorite' : 'favorite-border'}
            size={20}
            color={isFav ? 'red' : '#999'}
          />
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
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={Theme.COLORS.primary} />
      </View>
    );
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

  // Empty state (after data loaded, no items)
  if (!refreshing && !loadingMore && initialLoaded && data.length === 0) {
    return (
      <View style={styles.container}>
        {renderSearchBar()}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products found.</Text>
        </View>
      </View>
    );
  }

  // Normal state
  return (
    <View style={styles.container}>
      {renderSearchBar()}

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

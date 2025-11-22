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
import {getTrendingProducts} from '../api/productApi';

export default function TrendingScreen({navigation}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const fetchTrending = async (isRefresh = false) => {
    if (loading && !isRefresh) {
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const res = await getTrendingProducts();

    if (res.status) {
      setData(res.items || []);
    }

    setInitialLoaded(true);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchTrending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(() => {
    fetchTrending(true);
  }, []);

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

  if (!loading && initialLoaded && data.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>No trending products found.</Text>
      </View>
    );
  }

  if (loading && !refreshing && !initialLoaded) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={Theme.COLORS.primary} />
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

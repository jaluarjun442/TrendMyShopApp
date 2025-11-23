import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Theme from '../theme/Theme';
import { getCategories } from '../api/categoryApi';
import AdBanner from '../components/AdBanner';

export default function CategoriesScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  const fetchCategories = async (isRefresh = false) => {
    if (loading && !isRefresh) {
      return;
    }

    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const res = await getCategories();

    if (res.status) {
      setData(res.items || []);
    }

    setInitialLoaded(true);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(() => {
    fetchCategories(true);
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('CategoryProducts', {
          categoryId: item.id,
          categoryName: item.name,
        })
      }>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            {item.name?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
      )}
      <Text style={styles.name} numberOfLines={2}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  if (!loading && initialLoaded && data.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer]}>
        <Text style={styles.emptyText}>No categories found.</Text>
        <AdBanner variant="BANNER" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading && !refreshing && !initialLoaded ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.COLORS.primary} />
        </View>
      ) : (
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
      )}
      <AdBanner variant="BANNER" />
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
    padding: 12,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: Theme.COLORS.border,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
    borderRadius: 0, // square
    marginBottom: 8,
  },
  placeholder: {
    width: 80,
    height: 80,
    borderRadius: 0,
    backgroundColor: Theme.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
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

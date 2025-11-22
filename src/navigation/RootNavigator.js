import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Theme from '../theme/Theme';
import Icon from 'react-native-vector-icons/MaterialIcons';

import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import TrendingScreen from '../screens/TrendingScreen';
import MoreScreen from '../screens/MoreScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen'; // 👈 ADD THIS

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function BottomTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerStyle: { backgroundColor: Theme.COLORS.primary },
                headerTintColor: '#fff',
                tabBarActiveTintColor: Theme.COLORS.primary,
                tabBarInactiveTintColor: '#777',
                tabBarStyle: { borderTopLeftRadius: 0, borderTopRightRadius: 0 },

                tabBarIcon: ({ color, size }) => {
                    let iconName = 'home';

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Categories') {
                        iconName = 'category';
                    } else if (route.name === 'Trending') {
                        iconName = 'trending-up';
                    } else if (route.name === 'More') {
                        iconName = 'more-horiz';
                    }

                    return <Icon name={iconName} size={size} color={color} />;
                },
            })}>
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Categories" component={CategoriesScreen} />
            <Tab.Screen name="Trending" component={TrendingScreen} />
            <Tab.Screen name="More" component={MoreScreen} />
        </Tab.Navigator>
    );
}

export default function RootNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: { backgroundColor: Theme.COLORS.primary },
                headerTintColor: '#fff',
            }}>
            <Stack.Screen
                name="Tabs"
                component={BottomTabs}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
            />
            <Stack.Screen
                name="CategoryProducts"
                component={CategoryProductsScreen}
                options={({ route }) => ({
                    title: route.params?.categoryName || 'Products',
                })}
            />
        </Stack.Navigator>
    );
}

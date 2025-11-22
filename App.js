import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import WishlistProvider from './src/context/WishlistContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WishlistProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </WishlistProvider>
    </GestureHandlerRootView>
  );
}

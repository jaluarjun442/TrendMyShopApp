import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RootNavigator from './src/navigation/RootNavigator';
import WishlistProvider from './src/context/WishlistContext';
import mobileAds from 'react-native-google-mobile-ads';

export default function App() {
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(() => {
        console.log('AdMob initialized');
      });
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <WishlistProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </WishlistProvider>
    </GestureHandlerRootView>
  );
}

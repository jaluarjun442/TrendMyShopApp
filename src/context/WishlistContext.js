import React, { createContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const WishlistContext = createContext();

const STORAGE_KEY = 'WISHLIST_PRODUCTS';

export default function WishlistProvider({ children }) {
    const [wishlist, setWishlist] = useState([]);

    // Load from storage on mount
    useEffect(() => {
        (async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) {
                        setWishlist(parsed);
                    }
                }
            } catch (e) {
                console.log('Wishlist load error:', e.message);
            }
        })();
    }, []);

    // Save whenever wishlist changes
    useEffect(() => {
        (async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
            } catch (e) {
                console.log('Wishlist save error:', e.message);
            }
        })();
    }, [wishlist]);

    const isInWishlist = useCallback(
        id => wishlist.some(p => p.id === id),
        [wishlist],
    );

    const addToWishlist = useCallback(product => {
        setWishlist(prev => {
            if (prev.some(p => p.id === product.id)) {
                return prev;
            }
            return [product, ...prev]; // insert at TOP instead of bottom
        });
    }, []);

    const removeFromWishlist = useCallback(id => {
        setWishlist(prev => prev.filter(p => p.id !== id));
    }, []);

    const toggleWishlist = useCallback(product => {
        setWishlist(prev => {
            if (prev.some(p => p.id === product.id)) {
                return prev.filter(p => p.id !== product.id);
            }
            return [product, ...prev]; // new favorite goes to top
        });
    }, []);

    return (
        <WishlistContext.Provider
            value={{ wishlist, isInWishlist, addToWishlist, removeFromWishlist, toggleWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

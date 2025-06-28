"use client";
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useAuth } from "./AuthContext";
import cartApi, { setCartQuantityUpdateCallback } from "@/services/api/cartApi";

interface CartContextType {
    cartQuantity: number;
    updateCartQuantity: () => void;
    setCartQuantity: (quantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cartQuantity, setCartQuantity] = useState(0);
    const { isAuthenticated } = useAuth();

    const fetchCartQuantity = useCallback(async () => {
        if (isAuthenticated) {
            try {
                const response = await cartApi.getCart();
                const totalQuantity = response.data.reduce((sum, item) => sum + item.quantity, 0);
                console.log('🛒 Cart quantity updated to:', totalQuantity);
                setCartQuantity(totalQuantity);
            } catch (error) {
                console.error('Failed to fetch cart quantity:', error);
                setCartQuantity(0);
            }
        } else {
            setCartQuantity(0);
        }
    }, [isAuthenticated]);

    const updateCartQuantity = useCallback(() => {
        fetchCartQuantity();
    }, [fetchCartQuantity]);

    useEffect(() => {
        fetchCartQuantity();
    }, [fetchCartQuantity]);

    useEffect(() => {
        setCartQuantityUpdateCallback(updateCartQuantity);
        
        return () => {
            setCartQuantityUpdateCallback(() => {});
        };
    }, [updateCartQuantity]);

    return (
        <CartContext.Provider value={{ 
            cartQuantity, 
            updateCartQuantity,
            setCartQuantity 
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
} 
// src/contexts/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '../types/CartItem';
import { Cookie } from '../types/Cookie';

interface CartContextType {
  cart: CartItem[];
  addToCart: (cookie: Cookie, quantity?: number) => void;
  removeFromCart: (cookieId: string) => void;
  updateQuantity: (cookieId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType>({} as CartContextType);

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (cookie: Cookie, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.cookie.id === cookie.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.cookie.id === cookie.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { cookie, quantity }];
    });
  };

  const removeFromCart = (cookieId: string) => {
    setCart(prevCart => prevCart.filter(item => item.cookie.id !== cookieId));
  };

  const updateQuantity = (cookieId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cookieId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.cookie.id === cookieId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.cookie.price * item.quantity, 0);
  };

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
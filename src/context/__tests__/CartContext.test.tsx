import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { CartProvider, useCart } from '../CartContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CartItem } from '../../types/app.types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

const mockItem: Omit<CartItem, 'quantity'> = {
  id: '1',
  name: 'Sushi Roll',
  price: 12.99,
  image: 'https://example.com/sushi.jpg',
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('CartContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.clear();
  });

  it('should provide cart context', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toEqual([]);
    expect(result.current.addItem).toBeDefined();
    expect(result.current.removeItem).toBeDefined();
    expect(result.current.clearCart).toBeDefined();
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toEqual({ ...mockItem, quantity: 1 });
  });

  it('should increment quantity when adding existing item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem);
      result.current.addItem(mockItem);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem);
      result.current.removeItem('1');
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem);
      result.current.updateQuantity('1', 3);
    });

    expect(result.current.items[0].quantity).toBe(3);
  });

  it('should remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem);
      result.current.updateQuantity('1', 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should calculate total correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem);
      result.current.addItem({ ...mockItem, id: '2', price: 15.99 });
      result.current.updateQuantity('1', 2);
    });

    const expectedTotal = 12.99 * 2 + 15.99;
    expect(result.current.getTotal()).toBe(expectedTotal);
  });

  it('should calculate item count correctly', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem);
      result.current.addItem({ ...mockItem, id: '2' });
      result.current.updateQuantity('1', 3);
    });

    expect(result.current.getItemCount()).toBe(4); // 3 + 1
  });

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem(mockItem);
      result.current.addItem({ ...mockItem, id: '2' });
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
  });
});


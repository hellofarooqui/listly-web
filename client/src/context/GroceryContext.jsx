import { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI, itemAPI, categoryAPI } from '../services/api';

const GroceryContext = createContext();

export const useGrocery = () => {
  const context = useContext(GroceryContext);
  if (!context) {
    throw new Error('useGrocery must be used within GroceryProvider');
  }
  return context;
};

export const GroceryProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch initial data
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [cartRes, itemsRes, categoriesRes] = await Promise.all([
        cartAPI.get(),
        itemAPI.getGrouped(),
        categoryAPI.getAll(),
      ]);

      setCart(cartRes.data.data);
      setItems(itemsRes.data.data);
      console.log("Grouped Items",itemsRes.data)
      setCategories(categoriesRes.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Cart operations
  const addToCart = async (itemId, quantity = 1) => {
    try {
      const res = await cartAPI.addItem(itemId, quantity);
      setCart(res.data.data);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const updateCartQuantity = async (itemId, quantity) => {
    try {
      const res = await cartAPI.updateQuantity(itemId, quantity);
      setCart(res.data.data);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await cartAPI.removeItem(itemId);
      setCart(res.data.data);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      const res = await cartAPI.clear();
      setCart(res.data.data);
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const exportCart = async () => {
    try {
      const res = await cartAPI.export();
      return res.data.data;
    } catch (err) {
      throw err;
    }
  };

  // Item operations
  const addItem = async (itemData) => {
    try {
      const res = await itemAPI.create(itemData);
      await fetchItems();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const fetchItems = async () => {
    try {
      const res = await itemAPI.getGrouped();
      setItems(res.data.data);
    } catch (err) {
      throw err;
    }
  };

  // Category operations
  const addCategory = async (categoryData) => {
    try {
      const res = await categoryAPI.create(categoryData);
      await fetchCategories();
      return res.data;
    } catch (err) {
      throw err;
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryAPI.getAll();
      setCategories(res.data.data);
    } catch (err) {
      throw err;
    }
  };

  const getCartItemCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cart,
    items,
    categories,
    loading,
    error,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    exportCart,
    addItem,
    addCategory,
    fetchItems,
    fetchCategories,
    getCartItemCount,
    refreshData: fetchInitialData,
  };

  return (
    <GroceryContext.Provider value={value}>
      {children}
    </GroceryContext.Provider>
  );
};
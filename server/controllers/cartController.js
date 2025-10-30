const Cart = require('../models/Cart');
const Item = require('../models/Item');

// Helper function to get or create cart
const getOrCreateCart = async (userId = 'default_user') => {
  let cart = await Cart.findOne({ userId });
  
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  
  return cart;
};

// @desc    Get cart
// @route   GET /api/cart
// @access  Public
exports.getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart();
    await cart.populate({
      path: 'items.item',
      populate: { path: 'category', select: 'name' }
    });
    
    await cart.calculateTotal();
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/items
// @access  Public
exports.addItemToCart = async (req, res, next) => {
  try {
    const { itemId, quantity = 1 } = req.body;
    
    if (!itemId) {
      return res.status(400).json({
        success: false,
        message: 'Item ID is required'
      });
    }
    
    // Check if item exists
    const itemExists = await Item.findById(itemId);
    
    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    const cart = await getOrCreateCart();
    
    // Check if item already in cart
    const existingItemIndex = cart.items.findIndex(
      cartItem => cartItem.item.toString() === itemId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        item: itemId,
        quantity
      });
    }
    
    await cart.save();
    await cart.populate({
      path: 'items.item',
      populate: { path: 'category', select: 'name' }
    });
    
    await cart.calculateTotal();
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/items/:itemId
// @access  Public
exports.updateCartItemQuantity = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }
    
    const cart = await getOrCreateCart();
    
    const cartItemIndex = cart.items.findIndex(
      cartItem => cartItem.item.toString() === itemId
    );
    
    if (cartItemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    cart.items[cartItemIndex].quantity = quantity;
    
    await cart.save();
    await cart.populate({
      path: 'items.item',
      populate: { path: 'category', select: 'name' }
    });
    
    await cart.calculateTotal();
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/items/:itemId
// @access  Public
exports.removeItemFromCart = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    
    const cart = await getOrCreateCart();
    
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      cartItem => cartItem.item.toString() !== itemId
    );
    
    if (cart.items.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }
    
    await cart.save();
    await cart.populate({
      path: 'items.item',
      populate: { path: 'category', select: 'name' }
    });
    
    await cart.calculateTotal();
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Public
exports.clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart();
    
    cart.items = [];
    cart.totalEstimatedPrice = 0;
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export cart as text
// @route   GET /api/cart/export
// @access  Public
exports.exportCartAsText = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart();
    await cart.populate({
      path: 'items.item',
      populate: { path: 'category', select: 'name' }
    });
    
    if (cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }
    
    // Group items by category
    const groupedItems = cart.items.reduce((acc, cartItem) => {
      const categoryName = cartItem.item.category.name;
      
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      
      acc[categoryName].push({
        name: cartItem.item.name,
        quantity: cartItem.quantity,
        unit: cartItem.item.unit
      });
      
      return acc;
    }, {});
    
    // Generate text format
    let textOutput = '🛒 GROCERY SHOPPING LIST\n';
    textOutput += '='.repeat(40) + '\n';
    textOutput += `Date: ${new Date().toLocaleDateString()}\n\n`;
    
    Object.entries(groupedItems).forEach(([category, items]) => {
      textOutput += `📦 ${category.toUpperCase()}\n`;
      textOutput += '-'.repeat(40) + '\n';
      
      items.forEach(item => {
        textOutput += `  ☐ ${item.name} - ${item.quantity} ${item.unit}\n`;
      });
      
      textOutput += '\n';
    });
    
    await cart.calculateTotal();
    
    if (cart.totalEstimatedPrice > 0) {
      textOutput += '=' .repeat(40) + '\n';
      textOutput += `💰 Estimated Total: $${cart.totalEstimatedPrice.toFixed(2)}\n`;
    }
    
    res.status(200).json({
      success: true,
      data: {
        text: textOutput,
        itemCount: cart.items.length,
        totalEstimated: cart.totalEstimatedPrice
      }
    });
  } catch (error) {
    next(error);
  }
};
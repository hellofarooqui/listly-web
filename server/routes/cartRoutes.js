const express = require('express');
const router = express.Router();
const {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearCart,
  exportCartAsText
} = require('../controllers/cartController');

router.route('/')
  .get(getCart)
  .delete(clearCart);

router.get('/export', exportCartAsText);

router.route('/items')
  .post(addItemToCart);

router.route('/items/:itemId')
  .put(updateCartItemQuantity)
  .delete(removeItemFromCart);

module.exports = router;
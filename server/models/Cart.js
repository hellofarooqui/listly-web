const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: 'default_user', // For now, using default user. Later can be linked to auth
      required: true
    },
    items: [cartItemSchema],
    totalEstimatedPrice: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Method to calculate total estimated price
cartSchema.methods.calculateTotal = async function() {
  await this.populate('items.item');
  
  this.totalEstimatedPrice = this.items.reduce((total, cartItem) => {
    const price = cartItem.item.estimatedPrice || 0;
    return total + (price * cartItem.quantity);
  }, 0);
  
  return this.totalEstimatedPrice;
};

module.exports = mongoose.model('Cart', cartSchema);
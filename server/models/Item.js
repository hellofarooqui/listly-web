const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
      minlength: [2, 'Item name must be at least 2 characters'],
      maxlength: [100, 'Item name cannot exceed 100 characters']
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required']
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/150?text=No+Image'
    },
    unit: {
      type: String,
      enum: ['kg', 'g', 'l', 'ml', 'piece', 'pack', 'dozen'],
      default: 'piece'
    },
    estimatedPrice: {
      type: Number,
      min: [0, 'Price cannot be negative']
    },
    isCustom: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

// Compound index for category-based queries
itemSchema.index({ category: 1, name: 1 });

module.exports = mongoose.model('Item', itemSchema);
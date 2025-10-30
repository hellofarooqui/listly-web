const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Category name must be at least 2 characters'],
      maxlength: [50, 'Category name cannot exceed 50 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters']
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

// Add index for faster queries
categorySchema.index({ name: 1 });

module.exports = mongoose.model('Category', categorySchema);
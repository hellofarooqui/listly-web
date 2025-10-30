const Item = require('../models/Item');
const Category = require('../models/Category');

// @desc    Get all items (with optional category filter)
// @route   GET /api/items?category=categoryId
// @access  Public
exports.getAllItems = async (req, res, next) => {
  try {
    const { category } = req.query;
    
    const query = category ? { category } : {};
    
    const items = await Item.find(query)
      .populate('category', 'name')
      .sort({ name: 1 });
    
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get items grouped by category
// @route   GET /api/items/grouped
// @access  Public
exports.getItemsGroupedByCategory = async (req, res, next) => {
  try {
    const items = await Item.find()
      .populate('category', 'name')
      .sort({ name: 1 });
    
    // Group items by category
    const grouped = items.reduce((acc, item) => {
      const categoryName = item.category.name;
      
      if (!acc[categoryName]) {
        acc[categoryName] = {
          categoryId: item.category._id,
          categoryName: categoryName,
          items: []
        };
      }
      
      acc[categoryName].items.push(item);
      return acc;
    }, {});
    
    // Convert to array
    const groupedArray = Object.values(grouped);
    
    res.status(200).json({
      success: true,
      count: groupedArray.length,
      data: groupedArray
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Public
exports.getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('category', 'name');
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Public
exports.createItem = async (req, res, next) => {
  try {
    const { name, category, image, unit, estimatedPrice } = req.body;
    
    // Validation
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Item name is required'
      });
    }
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }
    
    // Check if category exists
    const categoryExists = await Category.findById(category);
    
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Category does not exist'
      });
    }
    
    const item = await Item.create({
      name: name.trim(),
      category,
      image,
      unit,
      estimatedPrice,
      isCustom: true
    });
    
    const populatedItem = await Item.findById(item._id).populate('category', 'name');
    
    res.status(201).json({
      success: true,
      data: populatedItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Public
exports.updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    const { category } = req.body;
    
    // If category is being updated, check if it exists
    if (category) {
      const categoryExists = await Category.findById(category);
      
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Category does not exist'
        });
      }
    }
    
    item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate('category', 'name');
    
    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Public
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }
    
    await item.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
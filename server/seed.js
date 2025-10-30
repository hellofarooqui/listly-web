const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/Category');
const Item = require('./models/Item');
const Cart = require('./models/Cart');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB Connected...');

    // Clear existing data
    await Category.deleteMany({});
    await Item.deleteMany({});
    await Cart.deleteMany({});

    console.log('Cleared existing data...');

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Vegetables', description: 'Fresh vegetables', isCustom: false },
      { name: 'Fruits', description: 'Fresh fruits', isCustom: false },
      { name: 'Dairy', description: 'Milk and dairy products', isCustom: false },
      { name: 'Snacks', description: 'Snacks and munchies', isCustom: false },
      { name: 'Beverages', description: 'Drinks and beverages', isCustom: false },
      { name: 'Bakery', description: 'Bread and baked goods', isCustom: false },
      { name: 'Meat & Seafood', description: 'Fresh meat and seafood', isCustom: false },
      { name: 'Pantry', description: 'Dry goods and pantry staples', isCustom: false }
    ]);

    console.log('Categories created...');

    // Create items for each category
    const items = [];

    // Vegetables
    const vegCategory = categories.find(c => c.name === 'Vegetables');
    items.push(
      { name: 'Tomatoes', category: vegCategory._id, unit: 'kg', estimatedPrice: 3.5, image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=200' },
      { name: 'Potatoes', category: vegCategory._id, unit: 'kg', estimatedPrice: 2.0, image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200' },
      { name: 'Onions', category: vegCategory._id, unit: 'kg', estimatedPrice: 2.5, image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=200' },
      { name: 'Carrots', category: vegCategory._id, unit: 'kg', estimatedPrice: 2.8, image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=200' },
      { name: 'Spinach', category: vegCategory._id, unit: 'pack', estimatedPrice: 2.0, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=200' }
    );

    // Fruits
    const fruitCategory = categories.find(c => c.name === 'Fruits');
    items.push(
      { name: 'Apples', category: fruitCategory._id, unit: 'kg', estimatedPrice: 4.5, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200' },
      { name: 'Bananas', category: fruitCategory._id, unit: 'dozen', estimatedPrice: 3.0, image: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=200' },
      { name: 'Oranges', category: fruitCategory._id, unit: 'kg', estimatedPrice: 3.5, image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=200' },
      { name: 'Grapes', category: fruitCategory._id, unit: 'kg', estimatedPrice: 5.5, image: 'https://images.unsplash.com/photo-1599819177746-f84c48c02c19?w=200' },
      { name: 'Strawberries', category: fruitCategory._id, unit: 'pack', estimatedPrice: 4.0, image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200' }
    );

    // Dairy
    const dairyCategory = categories.find(c => c.name === 'Dairy');
    items.push(
      { name: 'Milk', category: dairyCategory._id, unit: 'l', estimatedPrice: 3.5, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=200' },
      { name: 'Yogurt', category: dairyCategory._id, unit: 'pack', estimatedPrice: 2.5, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200' },
      { name: 'Cheese', category: dairyCategory._id, unit: 'pack', estimatedPrice: 5.0, image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=200' },
      { name: 'Butter', category: dairyCategory._id, unit: 'pack', estimatedPrice: 4.5, image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=200' },
      { name: 'Eggs', category: dairyCategory._id, unit: 'dozen', estimatedPrice: 3.0, image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200' }
    );

    // Snacks
    const snackCategory = categories.find(c => c.name === 'Snacks');
    items.push(
      { name: 'Potato Chips', category: snackCategory._id, unit: 'pack', estimatedPrice: 2.5, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=200' },
      { name: 'Cookies', category: snackCategory._id, unit: 'pack', estimatedPrice: 3.0, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200' },
      { name: 'Nuts Mix', category: snackCategory._id, unit: 'pack', estimatedPrice: 4.5, image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200' },
      { name: 'Chocolate Bar', category: snackCategory._id, unit: 'piece', estimatedPrice: 2.0, image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=200' }
    );

    // Beverages
    const beverageCategory = categories.find(c => c.name === 'Beverages');
    items.push(
      { name: 'Orange Juice', category: beverageCategory._id, unit: 'l', estimatedPrice: 3.5, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200' },
      { name: 'Coffee', category: beverageCategory._id, unit: 'pack', estimatedPrice: 8.0, image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=200' },
      { name: 'Tea', category: beverageCategory._id, unit: 'pack', estimatedPrice: 5.0, image: 'https://images.unsplash.com/photo-1563822249366-3efb6fffccac?w=200' },
      { name: 'Soft Drink', category: beverageCategory._id, unit: 'l', estimatedPrice: 2.0, image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200' }
    );

    // Bakery
    const bakeryCategory = categories.find(c => c.name === 'Bakery');
    items.push(
      { name: 'White Bread', category: bakeryCategory._id, unit: 'piece', estimatedPrice: 2.5, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200' },
      { name: 'Whole Wheat Bread', category: bakeryCategory._id, unit: 'piece', estimatedPrice: 3.0, image: 'https://images.unsplash.com/photo-1549931319-a545dcf3bc34?w=200' },
      { name: 'Croissant', category: bakeryCategory._id, unit: 'pack', estimatedPrice: 4.0, image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=200' }
    );

    // Meat & Seafood
    const meatCategory = categories.find(c => c.name === 'Meat & Seafood');
    items.push(
      { name: 'Chicken Breast', category: meatCategory._id, unit: 'kg', estimatedPrice: 8.0, image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200' },
      { name: 'Ground Beef', category: meatCategory._id, unit: 'kg', estimatedPrice: 10.0, image: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=200' },
      { name: 'Salmon Fillet', category: meatCategory._id, unit: 'kg', estimatedPrice: 15.0, image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=200' }
    );

    // Pantry
    const pantryCategory = categories.find(c => c.name === 'Pantry');
    items.push(
      { name: 'Rice', category: pantryCategory._id, unit: 'kg', estimatedPrice: 3.0, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200' },
      { name: 'Pasta', category: pantryCategory._id, unit: 'pack', estimatedPrice: 2.5, image: 'https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=200' },
      { name: 'Olive Oil', category: pantryCategory._id, unit: 'l', estimatedPrice: 8.0, image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200' },
      { name: 'Salt', category: pantryCategory._id, unit: 'pack', estimatedPrice: 1.5, image: 'https://images.unsplash.com/photo-1598932431118-9f896f3faf5b?w=200' },
      { name: 'Sugar', category: pantryCategory._id, unit: 'kg', estimatedPrice: 2.0, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200' }
    );

    await Item.insertMany(items);

    console.log('Items created...');

    // Create an empty cart
    await Cart.create({ userId: 'default_user', items: [] });

    console.log('Cart initialized...');

    console.log('\n✅ Database seeded successfully!');
    console.log(`📦 Created ${categories.length} categories`);
    console.log(`🛍️  Created ${items.length} items`);
    console.log('🛒 Initialized empty cart\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
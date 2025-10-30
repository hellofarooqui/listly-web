# 🛒 Household Grocery Management - Backend API

A RESTful API built with Node.js, Express, and MongoDB for managing household grocery lists.

## 📁 Project Structure

```
household-grocery-backend/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── categoryController.js # Category CRUD operations
│   ├── itemController.js     # Item CRUD operations
│   └── cartController.js     # Cart management & export
├── models/
│   ├── Category.js           # Category schema
│   ├── Item.js               # Item schema
│   └── Cart.js               # Cart schema
├── routes/
│   ├── categoryRoutes.js     # Category endpoints
│   ├── itemRoutes.js         # Item endpoints
│   └── cartRoutes.js         # Cart endpoints
├── .env                      # Environment variables
├── .env.example              # Environment template
├── package.json              # Dependencies
├── seed.js                   # Database seeding script
└── server.js                 # Main application entry
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher) - running locally or MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone or create the project directory:**
   ```bash
   mkdir household-grocery-backend
   cd household-grocery-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` with your configuration:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/household_grocery
   ```
   
   **For MongoDB Atlas** (cloud database):
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/household_grocery
   ```

4. **Make sure MongoDB is running:**
   
   **Local MongoDB:**
   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   ```
   
   **Or use MongoDB Atlas** (cloud) - just update the MONGODB_URI in .env

5. **Seed the database with sample data:**
   ```bash
   npm run seed
   ```
   
   This will create:
   - 8 default categories (Vegetables, Fruits, Dairy, etc.)
   - 40+ sample grocery items
   - An empty cart for the default user

6. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The server will start at `http://localhost:5000`

## 📡 API Endpoints

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |
| GET | `/api/categories/:id` | Get single category |
| POST | `/api/categories` | Create new category |
| PUT | `/api/categories/:id` | Update category |
| DELETE | `/api/categories/:id` | Delete category |

**Example: Create Category**
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{"name": "Frozen Foods", "description": "Frozen meals and ingredients"}'
```

### Items

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/items` | Get all items (optional ?category=id filter) |
| GET | `/api/items/grouped` | Get items grouped by category |
| GET | `/api/items/:id` | Get single item |
| POST | `/api/items` | Create new item |
| PUT | `/api/items/:id` | Update item |
| DELETE | `/api/items/:id` | Delete item |

**Example: Create Item**
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Avocado",
    "category": "CATEGORY_ID_HERE",
    "unit": "piece",
    "estimatedPrice": 2.5,
    "image": "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=200"
  }'
```

### Cart

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get current cart |
| POST | `/api/cart/items` | Add item to cart |
| PUT | `/api/cart/items/:itemId` | Update item quantity |
| DELETE | `/api/cart/items/:itemId` | Remove item from cart |
| DELETE | `/api/cart` | Clear entire cart |
| GET | `/api/cart/export` | Export cart as text |

**Example: Add Item to Cart**
```bash
curl -X POST http://localhost:5000/api/cart/items \
  -H "Content-Type: application/json" \
  -d '{"itemId": "ITEM_ID_HERE", "quantity": 2}'
```

**Example: Export Cart**
```bash
curl http://localhost:5000/api/cart/export
```

## 🧪 Testing the API

You can test the API using:

1. **cURL** (command line)
2. **Postman** - Import the endpoints above
3. **Thunder Client** (VS Code extension)
4. **Browser** - for GET requests like:
   - `http://localhost:5000/api/categories`
   - `http://localhost:5000/api/items/grouped`
   - `http://localhost:5000/api/cart`

## 🗄️ Database Models

### Category
```javascript
{
  name: String (required, unique),
  description: String,
  isCustom: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Item
```javascript
{
  name: String (required),
  category: ObjectId (ref: Category),
  image: String (URL),
  unit: String (kg/g/l/ml/piece/pack/dozen),
  estimatedPrice: Number,
  isCustom: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Cart
```javascript
{
  userId: String,
  items: [{
    item: ObjectId (ref: Item),
    quantity: Number,
    addedAt: Date
  }],
  totalEstimatedPrice: Number,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Available Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm run seed    # Seed database with sample data
```

## 🌟 Features Implemented

✅ **Category Management**
- Create custom categories from settings
- Default categories (Vegetables, Fruits, Dairy, etc.)
- Update and delete categories (with validation)

✅ **Item Management**
- Add new grocery items manually
- Associate items with categories
- Upload/link item images
- Set estimated prices and units

✅ **Shopping Cart**
- Add items to cart with quantity
- Update quantities
- Remove items
- Clear entire cart
- Calculate estimated total

✅ **Export Functionality**
- Export cart as formatted text
- Grouped by category
- Shows quantities and units
- Displays estimated total

✅ **Error Handling**
- Input validation
- Proper error messages
- Async/await pattern
- MongoDB connection handling

## 🔜 Next Steps

Once you confirm the backend is working, we'll move on to building the **React frontend** with:
- Beautiful UI for browsing items by category
- Shopping cart interface
- Add custom items and categories
- Export and share functionality

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Make sure MongoDB is running
- Check MONGODB_URI in .env file
- For Atlas: verify network access and credentials

**Port Already in Use:**
- Change PORT in .env to another port (e.g., 5001)
- Or stop the process using port 5000

**Module Not Found:**
- Run `npm install` again
- Delete `node_modules` and run `npm install`

## 📝 Notes

- The API currently uses a default user (`default_user`) for the cart
- Authentication will be added in future iterations
- All prices are in USD (can be customized)
- Images use Unsplash URLs (free stock photos)

---

Ready to test? Run `npm run seed` followed by `npm run dev` and start making API calls! 🚀
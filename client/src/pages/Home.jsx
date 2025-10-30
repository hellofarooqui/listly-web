import { useState } from 'react';
import { useGrocery } from '../context/GroceryContext';

const Home = () => {
  const { items, loading, addToCart } = useGrocery();
  const [addingItem, setAddingItem] = useState(null);
  const [notification, setNotification] = useState(null);

  const handleAddToCart = async (itemId, itemName) => {
    try {
      setAddingItem(itemId);
      await addToCart(itemId, 1);
      
      // Show notification
      setNotification(`${itemName} added to cart!`);
      setTimeout(() => setNotification(null), 2000);
    } catch (err) {
      alert('Failed to add item to cart');
    } finally {
      setAddingItem(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-6">
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          ✓ {notification}
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Grocery Items
        </h2>
       
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No items available</p>
          <p className="text-gray-400">Run the seed script to populate items</p>
        </div>
      ) : (
        <div className="space-y-8">
          {items?.map((group) => (
            <div key={group.categoryId}>
              {/* Category Header */}
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800 border-l-4 border-primary-500 pl-3">
                  {group.categoryName}
                </h3>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {group.items.map((item) => (
                  <div
                    key={item._id}
                    className="card hover:shadow-md transition-shadow"
                  >
                    {/* Item Image */}
                    <div className="aspect-square bg-gray-100 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/200?text=No+Image';
                        }}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="p-2">
                      <h4 className="font-medium text-gray-900 truncate text-sm">
                        {item.name}
                      </h4>
                      
                      {/* {item.estimatedPrice && (
                        <p className="text-xs text-gray-600 mb-2">
                          ${item.estimatedPrice.toFixed(2)} / {item.unit}
                        </p>
                      )} */}

                      <button
                        onClick={() => handleAddToCart(item._id, item.name)}
                        disabled={addingItem === item._id}
                        className={`w-full py-1 px-3 rounded-lg font-medium transition-colors ${
                          addingItem === item._id
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-700 hover:bg-primary-700 text-white'
                        }`}
                      >
                        {addingItem === item._id ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Adding...
                          </span>
                        ) : 
                          "Add"
                        }
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
import { useState } from 'react';
import { useGrocery } from '../context/GroceryContext';

const Cart = () => {
  const { cart, updateCartQuantity, removeFromCart, clearCart, exportCart } = useGrocery();
  const [exporting, setExporting] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await updateCartQuantity(itemId, newQuantity);
    } catch (err) {
      alert('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!confirm('Remove this item from cart?')) return;
    
    try {
      await removeFromCart(itemId);
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Clear entire cart?')) return;
    
    try {
      await clearCart();
      showNotification('Cart cleared');
    } catch (err) {
      alert('Failed to clear cart');
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const data = await exportCart();
      
      // Copy to clipboard
      await navigator.clipboard.writeText(data.text);
      showNotification('Shopping list copied to clipboard!');
      
      // Also download as file
      const blob = new Blob([data.text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `grocery-list-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export cart');
    } finally {
      setExporting(false);
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Start adding items from the home page
        </p>
      </div>
    );
  }

  // Group items by category
  const groupedItems = cart.items.reduce((acc, cartItem) => {
    const categoryName = cartItem.item.category.name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(cartItem);
    return acc;
  }, {});

  return (
    <div className="pb-6">
      {/* Notification */}
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          ✓ {notification}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Shopping Cart
          </h2>
          <p className="text-gray-600">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <button
          onClick={handleClearCart}
          className="text-red-600 hover:text-red-700 font-medium text-sm"
        >
          Clear All
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-6 mb-6">
        {Object.entries(groupedItems).map(([categoryName, items]) => (
          <div key={categoryName}>
            <h3 className="font-semibold text-gray-700 mb-3 border-l-4 border-primary-500 pl-3">
              {categoryName}
            </h3>

            <div className="space-y-3">
              {items.map((cartItem) => (
                <div
                  key={cartItem.item._id}
                  className="card p-4 flex items-center gap-4"
                >
                  {/* Image */}
                  <img
                    src={cartItem.item.image}
                    alt={cartItem.item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                    }}
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">
                      {cartItem.item.name}
                    </h4>
                    {cartItem.item.estimatedPrice && (
                      <p className="text-sm text-gray-600">
                        ${cartItem.item.estimatedPrice.toFixed(2)} / {cartItem.item.unit}
                      </p>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(cartItem.item._id, cartItem.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium">
                      {cartItem.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(cartItem.item._id, cartItem.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(cartItem.item._id)}
                    className="text-red-600 hover:text-red-700 p-2"
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      {cart.totalEstimatedPrice > 0 && (
        <div className="card p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-700">
              Estimated Total
            </span>
            <span className="text-2xl font-bold text-primary-600">
              ${cart.totalEstimatedPrice.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Export Button */}
      <button
        onClick={handleExport}
        disabled={exporting}
        className={`w-full py-4 rounded-lg font-semibold text-lg transition-colors ${
          exporting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primary-600 hover:bg-primary-700 text-white'
        }`}
      >
        {exporting ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Exporting...
          </span>
        ) : (
          '📤 Export Shopping List'
        )}
      </button>

      <p className="text-center text-sm text-gray-500 mt-3">
        List will be copied to clipboard and downloaded as text file
      </p>
    </div>
  );
};

export default Cart;
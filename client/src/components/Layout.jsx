import { Link, useLocation } from 'react-router-dom';
import { useGrocery } from '../context/GroceryContext';

const Layout = ({ children }) => {
  const location = useLocation();
  const { getCartItemCount } = useGrocery();
  const cartCount = getCartItemCount();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/cart', label: 'Cart', icon: '🛒', badge: cartCount },
    { path: '/add-item', label: 'Add Item', icon: '➕' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-green-600">
            🛒 Listly
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t sticky bottom-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around items-center py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex flex-col items-center justify-center min-w-[70px] py-2 px-3 rounded-lg transition-all ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl mb-1 relative">
                    {item.icon}
                    {item.badge > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Layout;
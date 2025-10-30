import { useState } from 'react';
import { useGrocery } from '../context/GroceryContext';

const Settings = () => {
  const { categories, addCategory } = useGrocery();
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('Category name is required');
      return;
    }

    try {
      setLoading(true);
      await addCategory({
        name: formData.name.trim(),
        description: formData.description.trim(),
      });
      
      // Reset form
      setFormData({ name: '', description: '' });
      setShowAddForm(false);
      alert('Category added successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add category');
    } finally {
      setLoading(false);
    }
  };

  const customCategories = categories.filter((cat) => cat.isCustom);
  const defaultCategories = categories.filter((cat) => !cat.isCustom);

  return (
    <div className="max-w-2xl mx-auto pb-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Manage categories and preferences</p>
      </div>

      {/* Add Category Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            showAddForm
              ? 'bg-gray-200 text-gray-700'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          {showAddForm ? '✕ Cancel' : '+ Add Custom Category'}
        </button>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <div className="card p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            New Category
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Frozen Foods"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the category"
                rows="3"
                className="input-field resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {loading ? 'Adding...' : 'Add Category'}
            </button>
          </form>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-6">
        {/* Custom Categories */}
        {customCategories.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Custom Categories
            </h3>
            <div className="space-y-2">
              {customCategories.map((category) => (
                <div key={category._id} className="card p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {category.name}
                      </h4>
                      {category.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                      Custom
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Default Categories */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Default Categories
          </h3>
          <div className="space-y-2">
            {defaultCategories.map((category) => (
              <div key={category._id} className="card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {category.name}
                    </h4>
                    {category.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    Default
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">About</h3>
        <p className="text-sm text-gray-600">
          Household Grocery Manager v1.0.0
        </p>
        <p className="text-sm text-gray-600 mt-1">
          Built with React, Node.js, Express, and MongoDB
        </p>
      </div>
    </div>
  );
};

export default Settings;
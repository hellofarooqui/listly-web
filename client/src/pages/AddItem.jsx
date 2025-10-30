import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGrocery } from '../context/GroceryContext';

const AddItem = () => {
  const navigate = useNavigate();
  const { categories, addItem } = useGrocery();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    image: '',
    unit: 'piece',
    estimatedPrice: '',
  });

  const units = ['kg', 'g', 'l', 'ml', 'piece', 'pack', 'dozen'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.category) {
      alert('Please fill in required fields');
      return;
    }

    try {
      setLoading(true);
      
      const itemData = {
        name: formData.name.trim(),
        category: formData.category,
        unit: formData.unit,
        ...(formData.image && { image: formData.image }),
        ...(formData.estimatedPrice && { estimatedPrice: parseFloat(formData.estimatedPrice) }),
      };

      await addItem(itemData);
      
      alert('Item added successfully!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto pb-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Add New Item
        </h2>
        <p className="text-gray-600">
          Create a custom grocery item
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        {/* Item Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Organic Apples"
            className="input-field"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Unit
          </label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="input-field"
          >
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </div>

        {/* Estimated Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Price (optional)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              name="estimatedPrice"
              value={formData.estimatedPrice}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="input-field pl-7"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL (optional)
          </label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="input-field"
          />
          {formData.image && (
            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Preview:</p>
              <img
                src={formData.image}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/128?text=Invalid+URL';
                }}
              />
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            {loading ? 'Adding...' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;
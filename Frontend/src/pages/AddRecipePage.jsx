import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/Auth/AuthContext';
import { PlusCircle, Loader, Image as ImageIcon, Clock, Utensils, BookOpen, List, Type, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

const AddRecipePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cookingTime: '',
    imageUrl: '',
    category: 'Dinner',
    ingredients: '', // Will be split by newline
    instructions: '', // Will be split by newline
  });

  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Drink'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Process ingredients: split by newline and filter empty
      const ingredientsArray = formData.ingredients
        .split('\n')
        .map((item) => item.trim())
        .filter((item) => item !== '');

      // Process instructions: split by newline, filter empty, and map to object { step: '...' }
      const instructionsArray = formData.instructions
        .split('\n')
        .map((item) => item.trim())
        .filter((item) => item !== '')
        .map((step) => ({ step }));

      // Validate required fields
      if (!formData.title || !formData.imageUrl || ingredientsArray.length === 0 || instructionsArray.length === 0 || !formData.cookingTime) {
        throw new Error('Please fill in all required fields properly.');
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        cookingTime: Number(formData.cookingTime),
        imageUrl: formData.imageUrl,
        category: formData.category,
        ingredients: ingredientsArray,
        instructions: instructionsArray,
      };

      const response = await fetch('http://localhost:3000/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if your backend requires it (e.g., Bearer token)
          // 'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create recipe');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/menu'); // Redirect to menu after success
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
        <div className="min-h-screen pt-24 px-4 flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
                <p className="text-gray-600 mb-4">You must be logged in to add a recipe.</p>
                <button 
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition"
                >
                  Log In
                </button>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
            <PlusCircle className="text-blue-600" size={32} />
            Add New Recipe
          </h1>
          <p className="text-gray-600">Share your culinary masterpiece with the world</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6 mb-0">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6 mb-0">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700">Recipe created successfully! Redirecting...</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Type size={16} /> Recipe Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Spicy Chicken Curry"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Tag size={16} /> Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <BookOpen size={16} /> Description <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Briefly describe your dish..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            {/* Cooking Time & Image URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock size={16} /> Cooking Time (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="cookingTime"
                  value={formData.cookingTime}
                  onChange={handleChange}
                  placeholder="e.g., 45"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <ImageIcon size={16} /> Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Utensils size={16} /> Ingredients <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Enter each ingredient on a new line.</p>
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder={"2 cups Flour\n1 tsp Sugar\n2 Eggs"}
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm"
                required
              />
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <List size={16} /> Instructions <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 mb-2">Enter each step on a new line.</p>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                placeholder={"Preheat oven to 350°F.\nMix dry ingredients.\nBake for 30 mins."}
                rows="6"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-lg text-white font-semibold shadow-lg transform transition-all duration-200 
                  ${loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-1 hover:shadow-xl'
                  }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader className="animate-spin" size={20} /> Publishing...
                  </span>
                ) : (
                  'Share Recipe'
                )}
              </button>
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddRecipePage;

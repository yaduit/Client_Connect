import { useState } from 'react';
import ImageUploadSection from '../providers/imageUploadSection.jsx';
import { createServiceApi, uploadServiceImagesApi } from '../../api/services.api.js';
import { useCategories } from '../../hooks/useCategories.jsx';
import { Loader2 } from 'lucide-react';

const ServiceForm = ({ onSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { categories, loading: categoriesLoading } = useCategories();

  const getCurrentSubcategories = () => {
    if (!selectedCategory || !categories.length) return [];
    const category = categories.find(cat => String(cat._id) === String(selectedCategory));
    return category?.subCategories || [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!selectedCategory) {
      setError('Category is required');
      return;
    }

    if (!selectedSubcategory) {
      setError('Subcategory is required');
      return;
    }

    try {
      setLoading(true);
      const res = await createServiceApi({ 
        title: title.trim(), 
        description: description.trim(), 
        price: price ? Number(price) : 0,
        categoryId: selectedCategory,
        subcategoryName: selectedSubcategory
      });
      
      if (!res.success) {
        setError(res.message || 'Failed to create service');
        setLoading(false);
        return;
      }

      const created = res.service;

      if (selectedImages.length > 0) {
        try {
          await uploadServiceImagesApi(created._id, selectedImages);
        } catch (imgErr) {
          console.error('Image upload failed:', imgErr);
          const msg = imgErr?.response?.data?.message || imgErr?.message || 'Image upload failed';
          setError(`Service created but image upload failed: ${msg}`);
        }
      }

      onSuccess && onSuccess(created);
    } catch (err) {
      console.error('Failed to create service:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create service');
    } finally {
      setLoading(false);
    }
  };

  const subcategories = getCurrentSubcategories();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">{error}</div>}

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
        <select 
          value={selectedCategory} 
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedSubcategory('');
          }} 
          disabled={categoriesLoading}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100"
        >
          <option value="">
            {categoriesLoading ? 'Loading categories...' : 'Select a category'}
          </option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id || cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Subcategory <span className="text-red-500">*</span></label>
        <select 
          value={selectedSubcategory} 
          onChange={(e) => setSelectedSubcategory(e.target.value)} 
          disabled={!selectedCategory || subcategories.length === 0}
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100"
        >
          <option value="">
            {!selectedCategory ? 'Select category first' : subcategories.length === 0 ? 'No subcategories' : 'Select a subcategory'}
          </option>
          {subcategories.map(subCat => (
            <option key={subCat.slug} value={subCat.name}>
              {subCat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Service Title <span className="text-red-500">*</span></label>
        <input 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="e.g., Web Design, Logo Design"
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent outline-none" 
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Brief description of your service"
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent outline-none resize-none" 
          rows={2} 
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Price (Optional)</label>
        <input 
          value={price} 
          onChange={(e) => setPrice(e.target.value)} 
          type="number" 
          min="0" 
          step="0.01"
          placeholder="0.00"
          className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500 focus:border-transparent outline-none" 
        />
      </div>

      <div className="bg-gray-50 p-2 rounded border border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-1">Add Images (Optional)</p>
        <ImageUploadSection onImagesChange={setSelectedImages} maxImages={4} maxFileSize={5} existingImages={[]} />
      </div>
  <div className="flex items-center justify-end gap-2 pt-2">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-3 py-1.5 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading} 
            className="px-3 py-1.5 text-sm rounded bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium transition-colors flex items-center gap-1"
          >
            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
            {loading ? 'Creating...' : 'Create Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;

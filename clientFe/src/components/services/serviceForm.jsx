import { useState, useEffect } from 'react';
import ImageUploadSection from '../providers/imageUploadSection.jsx';
import { createServiceApi, uploadServiceImagesApi, updateServiceApi } from '../../api/services.api.js';
import { updateProviderApi } from '../../api/provider.api.js';
import { useCategories } from '../../hooks/useCategories.jsx';
import { Loader2 } from 'lucide-react';

const ServiceForm = ({ service, provider, onSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { categories, loading: categoriesLoading } = useCategories();
  const [city, setCity] = useState('');
  const [stateVal, setStateVal] = useState('');
  const [coords, setCoords] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState('');

  useEffect(() => {
    if (service) {
      setTitle(service.title || '');
      setDescription(service.description || '');
      setPrice(service.price ?? '');
      setSelectedCategory(service.categoryId || '');
      setSelectedSubcategory(service.subcategoryName || '');
    }
    // populate from provider if available and service not provided
    if (!service && provider) {
      setCity(provider.location?.city || '');
      setStateVal(provider.location?.state || '');
      setCoords(provider.location?.geo?.coordinates || null);
    }
  }, [service, provider]);

  const handleUseMyLocation = () => {
    setError(null);
    setLocationStatus('Detecting location...');
    setLocationLoading(true);

    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      setLocationStatus('');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { longitude, latitude } = pos.coords;
          setCoords([longitude, latitude]);

          const response = await fetch(`/api/utils/reverse?lat=${encodeURIComponent(latitude)}&lon=${encodeURIComponent(longitude)}`);
          const json = await response.json();
          const data = json.data || {};

          if (data.address) {
            setCity(data.address.city || data.address.town || '');
            setStateVal(data.address.state || '');
          }

          setLocationStatus('Location detected successfully! ✅');
        } catch (err) {
          console.error(err);
          setError('Failed to get location details');
          setLocationStatus('');
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        console.error(err);
        setError('Failed to get location. Please enable location access.');
        setLocationStatus('');
        setLocationLoading(false);
      }
    );
  };

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

      // If provider exists but has no location, and user provided location here,
      // update provider profile first so search by location will include this provider.
      if (provider && (!provider.location || !provider.location.geo || !provider.location.geo.coordinates)) {
        if (city && stateVal && coords) {
          try {
            await updateProviderApi({
              location: {
                city: city.trim(),
                state: stateVal.trim(),
                geo: { coordinates: coords }
              }
            });
          } catch (provErr) {
            console.error('Failed to update provider location:', provErr);
          }
        }
      }

      const payload = { 
        title: title.trim(), 
        description: description.trim(), 
        price: price ? Number(price) : 0,
        categoryId: selectedCategory,
        subcategoryName: selectedSubcategory
      };

      if (service) {
        const res = await updateServiceApi(service._id, payload);
        if (!res.success) {
          setError(res.message || 'Failed to update service');
          setLoading(false);
          return;
        }

        const updated = res.service;

        if (selectedImages.length > 0) {
          try {
            await uploadServiceImagesApi(updated._id, selectedImages);
          } catch (imgErr) {
            console.error('Image upload failed:', imgErr);
            const msg = imgErr?.response?.data?.message || imgErr?.message || 'Image upload failed';
            setError(`Service updated but image upload failed: ${msg}`);
          }
        }

        onSuccess && onSuccess(updated);
      } else {
        const res = await createServiceApi(payload);
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
      }
    } catch (err) {
      console.error('Failed to create service:', err);
      setError(err.response?.data?.message || err.message || (service ? 'Failed to update service' : 'Failed to create service'));
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

      {/* Location inputs - only needed if provider doesn't already have location */}
      <div className="bg-gray-50 p-3 rounded border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-700">Service Location</p>
          <button
            type="button"
            onClick={handleUseMyLocation}
            disabled={locationLoading}
            className={`text-sm text-green-600 hover:text-green-700 disabled:opacity-50 ${coords ? 'hidden' : ''}`}
          >
            {locationLoading ? 'Detecting...' : 'Use my location'}
          </button>
        </div>

        {locationStatus && (
          <div className="text-sm text-green-700 mb-2">{locationStatus}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
          <input
            placeholder="State"
            value={stateVal}
            onChange={(e) => setStateVal(e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
          />
        </div>

        {(!provider || !provider.location || !provider.location.geo || !provider.location.geo.coordinates) && (
          <p className="text-xs text-gray-500 mt-2">Providing location here will update your provider profile so your services appear in location searches.</p>
        )}
      </div>

      <div className="bg-gray-50 p-2 rounded border border-gray-200">
        <p className="text-xs font-semibold text-gray-700 mb-1">Add Images (Optional)</p>
        <ImageUploadSection onImagesChange={setSelectedImages} maxImages={4} maxFileSize={5} existingImages={service?.images || []} />
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
            {loading ? (service ? 'Updating...' : 'Creating...') : (service ? 'Update Service' : 'Create Service')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;

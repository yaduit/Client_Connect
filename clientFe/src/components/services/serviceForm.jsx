import { useState } from 'react';
import ImageUploadSection from '../providers/imageUploadSection.jsx';
import { createServiceApi, uploadServiceImagesApi } from '../../api/services.api.js';
import { Loader2 } from 'lucide-react';

const ServiceForm = ({ onSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      const res = await createServiceApi({ title: title.trim(), description: description.trim(), price: price ? Number(price) : 0 });
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
          // Surface backend message to user when available
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title <span className="text-red-500">*</span></label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded" rows={4} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Price (optional)</label>
        <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" min="0" step="0.01" className="w-full px-3 py-2 border rounded" />
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <ImageUploadSection onImagesChange={setSelectedImages} maxImages={4} maxFileSize={5} existingImages={[]} />
      </div>

      <div className="flex items-center justify-end gap-3">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded border">Cancel</button>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded bg-emerald-600 text-white">
          {loading ? <><Loader2 className="w-4 h-4 animate-spin inline-block" /> Saving...</> : 'Create Service'}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
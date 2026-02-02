import api from "./axios";

// ============ EXISTING ENDPOINTS ============

export const registerProviderApi = async (data) => {
  const res = await api.post("/providers/register", data);
  return res.data;
};

export const getProviderByIdApi = async (id) => {
  const res = await api.get(`/providers/${id}`);
  return res.data;
};

export const getMyProviderApi = async () => {
  const res = await api.get("/providers/me");
  return res.data;
};

export const toggleProviderStatusApi = async (isActive) => {
  const res = await api.patch("/providers/me/status", { isActive });
  return res.data;
};

export const updateProviderApi = async (data) => {
  const res = await api.patch("/providers/me", data);
  return res.data;
};

export const deactivateProviderApi = async () => {
  const res = await api.put("/providers/deactivate");
  return res.data;
};

export const activateProviderApi = async () => {
  const res = await api.put("/providers/activate");
  return res.data;
};

// ============ NEW IMAGE ENDPOINTS ============

/**
 * Upload service images to Cloudinary
 * @param {File[]} files - Array of image files
 * @returns {Promise} - Updated provider object with new images
 * 
 * Example:
 * const files = [file1, file2, file3];
 * const response = await uploadProviderImagesApi(files);
 */
export const uploadProviderImagesApi = async (files) => {
  // Create FormData for multipart upload
  const formData = new FormData();
  
  // Add files to FormData
  files.forEach((file) => {
    formData.append("images", file);
  });

  // Send to backend
  const res = await api.post("/providers/me/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
};

/**
 * Delete a service image by publicId
 * @param {string} publicId - Cloudinary public_id of the image
 * @returns {Promise} - Updated provider object
 * 
 * Example:
 * await deleteProviderImageApi("marketplace/providers/userId/imagename");
 */
export const deleteProviderImageApi = async (publicId) => {
  const res = await api.delete(`/providers/me/images/${encodeURIComponent(publicId)}`);
  return res.data;
};
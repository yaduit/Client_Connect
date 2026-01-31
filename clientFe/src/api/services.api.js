import api from './axios';

export const createServiceApi = async (data) => {
  const res = await api.post('/services', data);
  return res.data;
};

export const getMyServicesApi = async () => {
  const res = await api.get('/services/me');
  return res.data;
};

export const updateServiceApi = async (id, data) => {
  const res = await api.patch(`/services/${id}`, data);
  return res.data;
};

export const deleteServiceApi = async (id) => {
  const res = await api.delete(`/services/${id}`);
  return res.data;
};

export const uploadServiceImagesApi = async (serviceId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));

  const res = await api.post(`/services/${serviceId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return res.data;
};

export const deleteServiceImageApi = async (serviceId, publicId) => {
  const res = await api.delete(`/services/${serviceId}/images/${publicId}`);
  return res.data;
};
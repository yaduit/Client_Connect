import api from "./axios";

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

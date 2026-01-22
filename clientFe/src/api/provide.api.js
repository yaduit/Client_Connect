import api from "./axios";

export const registerProviderApi = async (data) => {
  const res = await api.post("/providers/register", data);
  return res.data;
};

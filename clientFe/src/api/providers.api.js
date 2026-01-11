import axios from './axios.js'

 export const getProviderByIdApi = async (id) =>{
    const res = await axios.get(`/providers/${id}`);
    return res.data;
 };
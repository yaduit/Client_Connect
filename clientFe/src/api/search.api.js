import api from './axios.js'

export const searchProvidersApi = async(params)=>{
    const res = await api.get('/search/providers',{params});
    return res.data; 
};
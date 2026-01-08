import axios from './axios.js'

export const searchProvidersApi = async(params)=>{
    const res = await axios.get('/search/providers',{params});
    return res.data; 
};
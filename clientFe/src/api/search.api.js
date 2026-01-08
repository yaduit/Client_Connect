import axios from './axios.js'

export const searchProviderApi = async(params)=>{
    const res = await axios.get('/search/providers',{params});
    return res.data; 
};
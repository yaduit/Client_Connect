import api from './axios.js'

export const getCategoriesApi = async () => {
    const res = await api.get('/categories')
    return res.data ;
 };

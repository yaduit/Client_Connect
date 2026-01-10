import axios from './axios.js'

export const getCategoriesApi = async () => {
    const res = await axios.get('/categories')
    return res.data ;
 };

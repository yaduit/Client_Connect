import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
    withCredentials: true,
    timeout: 10000
})

//response interceptor//
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        return Promise.reject(
            error.response?.data || {message: 'Network error'}
        );
    }
);

export default axiosInstance;
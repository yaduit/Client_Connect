import axios from './axios.js'

export const SignupApi = async(payload) => {
    const{data} = await axios.post('/auth/register', payload);
    return data;
};

export const LoginApi = async(payload) => {
    const{data} = await axios.post('/auth/login', payload)
    return data;
};

export const LogoutApi = async() => {
    const {data} = await axios.post('/auth/logout');
    return data;
};
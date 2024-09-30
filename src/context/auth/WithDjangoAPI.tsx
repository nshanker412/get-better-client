import axios, { AxiosError } from 'axios';

export const signInWithEmailAndPasswordAPI = async (email: string, password: string) => {
    return await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/auth/login`, {
        "email":email,
        "password":password,
    });
};
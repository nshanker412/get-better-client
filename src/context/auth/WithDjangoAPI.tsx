import axios, { AxiosError } from 'axios';
import { err } from 'react-native-svg';
import Toast from 'react-native-toast-message';

export const signInWithEmailAndPasswordAPI = async (email: string, password: string) => {
    return await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/auth/login`, {
        "email":email,
        "password":password,
    }).catch(err=>{Toast.show({
        text1: `Login Failed, Please Check Email and Password`,
        type: 'error',
        topOffset: 70
      });});
    
};
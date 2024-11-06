
import axios from 'axios';
import { NotificationTokenApiResponse } from '../Notifications.types';



export const fetchTokens = async (username: string,userToken:string) => {
    const response = await axios.get<NotificationTokenApiResponse>(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/notification-token?search=${username}`,
        {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        }
    );

    return response.data;
}
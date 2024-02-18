
import axios from 'axios';
import { NotificationTokenApiResponse } from '../Notifications.types';



export const fetchTokens = async (username: string) => {
    const response = await axios.get<NotificationTokenApiResponse>(
        `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notificationTokens/fetch/${username}`,
    );

    return response.data;
}
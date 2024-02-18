import { NotificationsResponseV2 } from '@models/notifications';
import axios from 'axios';


export const fetchNotifications = async (
	myUsername: string,
): Promise<NotificationsResponseV2 | void> => {

  try {
    const response = await axios.get<NotificationsResponseV2>(
      `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notifications/fetch/${myUsername}`,
    );
    return response.data;
  } catch (error) {
    console.log('fetchNotificationsError', error);
    throw new Error('Failed to fetch notifications');
  }
	
};
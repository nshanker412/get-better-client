import { NotificationsResponseV2 } from '@models/notifications';
import axios from 'axios';


export const fetchNotifications = async (
	myUsername: string,
): Promise<NotificationsResponseV2 | void> => {

  console.log('fetchNotifications', myUsername);  
  console.log('process.env.EXPO_PUBLIC_SERVER_BASE_URL',  `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notifications/v2/fetch/${myUsername}`);
  try {
    const response = await axios.get<NotificationsResponseV2>(
      `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notifications/v2/fetch/${myUsername}`,
    );
    return response.data;
  } catch (error) {
    console.log('fetchNotificationsError', error);
    console.log('Failed to fetch notifications');
  }
	
};
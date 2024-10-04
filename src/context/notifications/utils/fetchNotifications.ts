import { NotificationsResponseV2 } from '@models/notifications';
import axios from 'axios';


export const fetchNotifications = async (
	myUsername: string,userToken: string
): Promise<NotificationsResponseV2 | void> => {

  console.log('fetchNotifications', myUsername);  
  try {
    const response = await axios.get<NotificationsResponseV2>(
      `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/notifications/all`,{headers:{"Authorization":`Bearer ${userToken}`}},
    );
    return response.data;
  } catch (error) {
    console.log('fetchNotificationsError', error);
    console.log('Failed to fetch notifications');
  }
	
};
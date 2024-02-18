import { Unread } from '@models/notifications';
import axios from 'axios';


export const fetchUnread = async (
	myUsername: string,
): Promise<Unread | void> => {

    const response = await axios.get<Unread>(
		`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notifications/unread/${myUsername}`,
    );
    
    return response.data;
	
};
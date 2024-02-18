import axios from 'axios';


/**
 *  This function is used to update the server with the time the user last saw their notifications
 * @param myUsername 
 */
export const setNotificationsSeen = async (myUsername: string) => {
    const readTimeNow = Math.floor(Date.now() / 1000);

    try {
        await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notifications/unread/set/${myUsername}`, { timestamp: readTimeNow });

    } catch (error) {
        throw new Error(error);
        
    }
}

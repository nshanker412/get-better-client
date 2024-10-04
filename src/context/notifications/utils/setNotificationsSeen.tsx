import axios from 'axios';


/**
 *  This function is used to update the server with the time the user last saw their notifications
 * @param myUsername 
 */
export const setNotificationsSeen = async (myUsername: string,userToken:string) => {
    const readTimeNow = Math.floor(Date.now() / 1000);

    try {
        await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/notifications/update_read`, { timestamp: readTimeNow },{headers:{"Authorization":`Bearer ${userToken}`}});

    } catch (error) {
        console.log(error.message);
        
    }
}

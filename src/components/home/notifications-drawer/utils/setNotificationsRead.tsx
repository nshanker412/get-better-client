import axios from 'axios';



export const setNotificationsRead = async (myUsername: string) => {
    const readTimeNow = Math.floor(Date.now() / 1000);

    try {
        await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notifications/unread/set/${myUsername}`, { timestamp: readTimeNow });

    } catch (error) {
        console.log(error);
        
    }
}

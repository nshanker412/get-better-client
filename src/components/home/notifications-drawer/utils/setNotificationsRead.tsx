import axios from 'axios';



export const setNotificationsRead = async (myUsername: string,userToken:string) => {
    const readTimeNow = Math.floor(Date.now() / 1000);

    try {
        await axios.post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/notifications/update_read`, { timestamp: readTimeNow },{headers:{"Authorization":`Bearer ${userToken}`}});

    } catch (error) {
        console.log(error);
        
    }
}

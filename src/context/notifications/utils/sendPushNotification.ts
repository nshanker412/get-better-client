import { PushNotificationPacket } from '../Notifications.types';
import axios from 'axios';

/**
 * Sends a push notification to a user
 * @param pushPacket 
 * @returns 
 */
export const  sendPushNotification = async (pushPacket: PushNotificationPacket)  => {
    try {
        const response = await axios({
          method: 'post',
          url: 'https://exp.host/--/api/v2/push/send',
          headers: {
            // Authorization: "Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkYyOVc3VkhaV0sifQ.eyJpc3MiOiJMNkMzNUpWSFZDIiwiaWF0IjoxNzMxNDczNzI1fQ.c9Z_o9F0Vvz0WliSDkDGw6gardMdIBLJXot-4ojbnWylaxFB2AVfYKc7XPwgLzxxhaDTEhC6-7ah-l6VS-VhTw",
            // host: "exp.host",
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json'
          },
          data: JSON.stringify(pushPacket)
        });
        
         console.log(response.data)
      } catch (error) {
        console.error('Error sending push notification:', error);
        throw error;
      }
    

  }
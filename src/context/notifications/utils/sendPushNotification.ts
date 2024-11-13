import { PushNotificationPacket } from '../Notifications.types';

/**
 * Sends a push notification to a user
 * @param pushPacket 
 * @returns 
 */
export const  sendPushNotification = async (pushPacket: PushNotificationPacket)  => {
    
    try {
  
        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
      },
      body: JSON.stringify(pushPacket),
    }).then(res=>
        console.log(res)
        
    );
    } catch (error) {   
        console.log('sendPushNotificationError', error);
        console.log('Failed to send push notification');
    }

  }
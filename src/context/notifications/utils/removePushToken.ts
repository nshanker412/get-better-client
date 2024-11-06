
import axios from 'axios';
import Constants from 'expo-constants';
import * as ExpoNotifications from 'expo-notifications';

/**
 * This function is used to remove user push notification tokens from the server
 * @param state 
 * @returns 
 */
export const removePushToken = async (myUsername: string) => {
    try {
        const projectId = '6984b730-74db-4c70-a52b-28bbf178d5b8';
        const token = (await ExpoNotifications?.getExpoPushTokenAsync({ projectId: projectId }))
            ?.data;
        
        await axios
            .delete(
                `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/notification-token`,
                {
                    token: token,
                },
            )
            .then(async (response) => {
                console.log('removeNotificationToken', response.data);
            })
            .catch((error) => {
                console.log('removeNotificationTokenError', error);
                console.log('Failed to remove notification token');
            });
    } catch (e) {
        console.error('Error getting notification token', e);
    }
};
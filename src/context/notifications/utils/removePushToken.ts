
import axios from 'axios';
import Constants from 'expo-constants';
import * as ExpoNotifications from 'expo-notifications';

/**
 * This function is used to remove user push notification tokens from the server
 * @param state 
 * @returns 
 */
export const removePushToken = async (userToken: string) => {
    try {
        await axios
            .delete(
                `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/notification-token/delete_user_token`,
                {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
                }

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

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
        const projectId = Constants.expoConfig.extra.eas.projectId;
        const token = (await ExpoNotifications?.getExpoPushTokenAsync({ projectId: projectId }))
            ?.data;

        await axios
            .post(
                `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notificationToken/remove`,
                {
                    username: myUsername,
                    token: token,
                },
            )
            .then(async (response) => {
                console.log('removeNotificationToken', response.data);
            })
            .catch((error) => {
                console.log('removeNotificationTokenError', error);
                throw new Error('Failed to remove notification token');
            });
    } catch (e) {
        console.error('Error getting notification token', e);
    }
};
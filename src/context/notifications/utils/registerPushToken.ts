import axios from 'axios';
import Constants from 'expo-constants';
import * as ExpoNotifications from 'expo-notifications';

/**
 * This function is used to register for push notifications
 * @param username 
 * @returns 
 */
export const registerPushToken = async (username: string): Promise<string | undefined> => {
		const { status: existingStatus } =
			await ExpoNotifications.getPermissionsAsync();
		let finalStatus = existingStatus;

		if (existingStatus !== 'granted') {
			const { status } =
				await ExpoNotifications.requestPermissionsAsync();
			finalStatus = status;
		}

		if (finalStatus !== 'granted') {
			alert('Please enable notifications in your settings.');
			return;
		}

		const projectId = Constants.expoConfig.extra.eas.projectId;
		const token = (await ExpoNotifications.getExpoPushTokenAsync({projectId: projectId})).data;
	
		await axios
				.post(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notificationToken/save`,
					{
						username: username,
						token: token,
					},
				)
				.then((response) => {
					console.log('saveNotificationToken', response.data);
				})
				.catch((error) => {
                    console.log('saveNotificationTokenError', error);
                    throw new Error('Failed to save notification token');
				});
	

		return token;
    };
    
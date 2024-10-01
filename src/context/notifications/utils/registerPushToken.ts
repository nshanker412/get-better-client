import axios from 'axios';
import Constants from 'expo-constants';
import * as ExpoNotifications from 'expo-notifications';
import {useAuth} from '@context/auth/useAuth';

/**
 * This function is used to register for push notifications
 * @param username 
 * @returns 
 */
export const registerPushToken = async (username: string): Promise<string | undefined> => {
		const { status: existingStatus } =
			await ExpoNotifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		const {userToken}=useAuth();

		if (existingStatus !== 'granted') {
			const { status } =
				await ExpoNotifications.requestPermissionsAsync();
			finalStatus = status;
		}

		if (finalStatus !== 'granted') {
			alert('Please enable notifications in your settings.');
			return;
		}
	
	

	
	// if token is already saved in service, return it
	const projectId = Constants.expoConfig.extra.eas.projectId;
	const token = (await ExpoNotifications.getExpoPushTokenAsync({ projectId: projectId })).data;

	// should be non-blocking and not throw error
	const me = axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me`, {
		headers: {
			Authorization: `Bearer ${userToken}`,
		},
	})
	axios
		.post(
			`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/notification-token`,
			{
				user: me["id"],
				token: token,
			},
			{
				headers: {
					Authorization: `Bearer ${userToken}`,
				},
			}
		)
		.then((response) => {
			console.log('saveNotificationToken', response.data);
		})
		.catch((error) => {
			console.log('saveNotificationTokenError', error.message);
			// console.log('Failed to save notification token');
		});


		return token;
    };
    
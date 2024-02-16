import { useNavigation } from '@react-navigation/native';
import * as ExpoNotifications from 'expo-notifications';
import { useEffect } from 'react';

export default function NotificationHandler() {
	const navigate = useNavigation();

	useEffect(() => {
		const responseListener =
			ExpoNotifications.addNotificationResponseReceivedListener(
				(response) => {
					const path =
						response.notification.request.content.data.path;
					console.log('notification listener path', path);
					if (path) {
						navigate(path);
					}
				},
			);

		return () =>
			ExpoNotifications.removeNotificationSubscription(responseListener);
	}, []);

	return null; // This component does not render anything
}

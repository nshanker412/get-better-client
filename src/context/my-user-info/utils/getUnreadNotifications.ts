/**
 * Function to return a list of the unread notifications
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Todo: store notifications in DB
 */
const getUnreadNotifications = async (notifications: any[]) => {
	//1. get last time the user read the notifications
	const lastReadTimeStorage = await AsyncStorage.getItem(
		'lastNotificationReadTimestamp',
	);

	// timestamp of 12 hours ago
	const twelveHoursAgo = new Date().getTime() - 6 * 60 * 60 * 1000;

	// if not available then take
	const lastReadTime = lastReadTimeStorage
		? lastReadTimeStorage
		: twelveHoursAgo;

	//2. filter the notifications that occured after the last read time
	const unreadNotifications = notifications.filter((notification) => {
		return notification.timestamp > lastReadTime;
	});

	console.log('unreadNotifications', unreadNotifications);

	return unreadNotifications;
};

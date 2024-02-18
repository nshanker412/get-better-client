import * as ExpoNotifications from 'expo-notifications';


/**
 * Schedule a daily notification to remind the user to check in
 */
export const scheduleDailyNotification = async () => {
    // Check if notification already scheduled
    const existingNotifications =
        await ExpoNotifications.getAllScheduledNotificationsAsync();

    // await ExpoNotifications.cancelAllScheduledNotificationsAsync();
    if (existingNotifications.length === 0) {
        // Schedule the notification if none are scheduled
        await ExpoNotifications.scheduleNotificationAsync({
            content: {
                title: 'Get Better',
                body: 'Did you get better today?',
            },
            trigger: {
                hour: 18,
                minute: 0,
                repeats: true,
            },
        });
    }
};
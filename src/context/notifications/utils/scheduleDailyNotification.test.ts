import * as ExpoNotifications from 'expo-notifications';
import { scheduleDailyNotification } from './scheduleDailyNotification';

jest.mock('expo-notifications');

describe('scheduleDailyNotification', () => {
  it('does not schedule notification if already scheduled', async () => {
    const existingNotifications = [{ /* mock notification data */ }];
    ExpoNotifications.getAllScheduledNotificationsAsync.mockResolvedValueOnce(existingNotifications);

    await scheduleDailyNotification();

    expect(ExpoNotifications.getAllScheduledNotificationsAsync).toHaveBeenCalled();
    expect(ExpoNotifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  it('schedules notification if none are scheduled', async () => {
    const existingNotifications = [];
    ExpoNotifications.getAllScheduledNotificationsAsync.mockResolvedValueOnce(existingNotifications);

    await scheduleDailyNotification();

    expect(ExpoNotifications.getAllScheduledNotificationsAsync).toHaveBeenCalled();
    expect(ExpoNotifications.scheduleNotificationAsync).toHaveBeenCalledWith({
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
  });
});
import axios from 'axios';
import * as ExpoNotifications from 'expo-notifications';
import { registerPushToken } from './registerPushToken';

jest.mock('axios');
jest.mock('expo-notifications');



describe('registerPushToken', () => {
  const myUsername = 'eben';

  it('registers push token successfully', async () => {
    const existingStatus = 'granted';
    const finalStatus = 'granted';
    const token = 'mockedToken';

    ExpoNotifications.getPermissionsAsync.mockResolvedValueOnce({ status: existingStatus });
    ExpoNotifications.requestPermissionsAsync.mockResolvedValueOnce({ status: finalStatus });
    ExpoNotifications.getExpoPushTokenAsync.mockResolvedValueOnce({ data: token });
    axios.post.mockResolvedValueOnce({ data: {} });

    const result = await registerPushToken(myUsername);

    expect(ExpoNotifications.getPermissionsAsync).toHaveBeenCalled();
    expect(ExpoNotifications.requestPermissionsAsync).toHaveBeenCalled();
    expect(ExpoNotifications.getExpoPushTokenAsync).toHaveBeenCalledWith({ projectId: 'mockedProjectId' });
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notificationToken/save`,
      {
        username: myUsername,
        token: token,
      },
    );
    expect(result).toEqual(token);
  });

  it('returns undefined when permission is not granted', async () => {
    const existingStatus = 'undetermined';

    ExpoNotifications.getPermissionsAsync.mockResolvedValueOnce({ status: existingStatus });

    const result = await registerPushToken(myUsername);

    expect(ExpoNotifications.getPermissionsAsync).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('throws an error when saving token fails', async () => {
    const existingStatus = 'granted';
    const finalStatus = 'granted';
    const error = new Error('Failed to save notification token');

    ExpoNotifications.getPermissionsAsync.mockResolvedValueOnce({ status: existingStatus });
    ExpoNotifications.requestPermissionsAsync.mockResolvedValueOnce({ status: finalStatus });
    ExpoNotifications.getExpoPushTokenAsync.mockResolvedValueOnce({ data: 'mockedToken' });
    axios.post.mockRejectedValueOnce(error);

    await expect(registerPushToken(myUsername)).rejects.toThrowError(error);

    expect(ExpoNotifications.getPermissionsAsync).toHaveBeenCalled();
    expect(ExpoNotifications.requestPermissionsAsync).toHaveBeenCalled();
    expect(ExpoNotifications.getExpoPushTokenAsync).toHaveBeenCalledWith({ projectId: 'mockedProjectId' });
    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notificationToken/save`,
      {
        username: myUsername,
        token: 'mockedToken',
      },
    );
  });
});

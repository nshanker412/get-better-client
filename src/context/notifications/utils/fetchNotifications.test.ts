import axios from 'axios';
import { fetchNotifications } from './fetchNotifications';

jest.mock('axios');

describe('fetchNotifications', () => {
  const myUsername = 'eben';

  it('fetches notifications successfully', async () => {
    const notificationsResponse = { /* mock response data */ };
    axios.get.mockResolvedValueOnce({ data: notificationsResponse });

    const result = await fetchNotifications(myUsername);

    expect(axios.get).toHaveBeenCalledWith(
      `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notifications/v2/fetch/${myUsername}`
    );
    expect(result).toEqual(notificationsResponse);
  });

  it('throws an error when fetching notifications fails', async () => {
    const error = new Error('Failed to fetch notifications');
    axios.get.mockRejectedValueOnce(error);

    await expect(fetchNotifications(myUsername)).rejects.toThrowError(error);
  });
});
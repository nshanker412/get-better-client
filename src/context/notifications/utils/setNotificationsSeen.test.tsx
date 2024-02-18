import axios from 'axios';
import { setNotificationsSeen } from '/Users/eric/get-better/get-better-client/src/context/notifications/utils/setNotificationsSeen';

jest.mock('axios');

describe('setNotificationsSeen', () => {
  it('should call axios.post with the correct URL and data', async () => {
    const myUsername = 'testUser';
    const readTimeNow = Math.floor(Date.now() / 1000);
    const expectedURL = `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notifications/unread/set/${myUsername}`;
    const expectedData = { timestamp: readTimeNow };

    await setNotificationsSeen(myUsername);

    expect(axios.post).toHaveBeenCalledWith(expectedURL, expectedData);
  });

  it('should throw an error if axios.post throws an error', async () => {
    const myUsername = 'testUser';
    const error = new Error('Network Error');
    axios.post.mockRejectedValue(error);

    await expect(setNotificationsSeen(myUsername)).rejects.toThrow(error);
  });
});
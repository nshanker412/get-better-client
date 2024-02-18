import { renderHook } from '@testing-library/react-hooks';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import useProfileImage from './useProfileImage';

// Create a new instance of axios-mock-adapter for mocking axios requests
const mock = new MockAdapter(axios);

describe('useProfileImage', () => {
  const username = 'eben';
  const fetchSize = 100;
  // Use a mock value for baseURL since process.env variables might not be accessible in test env
    const baseURL = 'http://localhost:13131';

  // Reset axios mock before each test to ensure a clean slate
  beforeEach(() => {
    mock.reset();
  });

    it('fetches and sets profile image successfully', async () => {
        const imageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAABrElEQVRIS+2UwQ3CMAxFQxV0QHc' 

    // Mock the GET request to return a successful response with image data
    mock.onGet(`${baseURL}/post/fetch/${username}/profile/${fetchSize}/${fetchSize}`).reply(200, { image: imageBase64 });

    const { result, waitForNextUpdate } = renderHook(() => useProfileImage(username, fetchSize));

    // Use waitForNextUpdate to wait for the hook to complete the async operation
    await waitForNextUpdate({timeout: 4000});

    // Assert that the profileImage state is correctly set with the mock image data
    expect(result.current.profileImage).toEqual({ uri: `data:image/jpeg;base64,${imageBase64}` });
    expect(result.current.hasProfileImage).toBeTruthy();
  });

  it('handles no profile image set by user (404 response)', async () => {
    // Mock the GET request to simulate a 404 response
    mock.onGet(`${baseURL}/post/fetch/${username}/profile/${fetchSize}/${fetchSize}`).reply(404, 'No image exists at eben_profile');

    const { result, waitForNextUpdate } = renderHook(() => useProfileImage(username, fetchSize));

    // Wait for the hook to react to the 404 response
    await waitForNextUpdate();

    // Assert that the hook correctly handles the absence of a profile image
    expect(result.current.profileImage).toBeNull();
    expect(result.current.hasProfileImage).toBeFalsy();
  });

  it('handles unexpected errors', async () => {
    // Mock the GET request to simulate a network error
    mock.onGet(`${baseURL}/post/fetch/${username}/profile/${fetchSize}/${fetchSize}`).networkError();

    const { result, waitForNextUpdate } = renderHook(() => useProfileImage(username, fetchSize));

    // Wait for the hook to react to the network error
    await waitForNextUpdate();

    // Assert that the hook correctly handles unexpected errors
    expect(result.current.profileImage).toBeNull();
    expect(result.current.hasProfileImage).toBeFalsy();
  });
});

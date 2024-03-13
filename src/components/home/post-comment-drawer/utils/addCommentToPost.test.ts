import axios from 'axios';
import { addCommentToPost } from './addCommentToPost';

jest.mock('axios');

describe('addCommentToPost', () => {
  const originalPoster = 'user1';
  const postID = '123';
  const myUsername = 'user2';
  const comment = 'Great post!';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds a comment to the post successfully', async () => {
    const responseData = { success: true };
    (axios.post as jest.Mock).mockResolvedValueOnce({ data: responseData });

    // Call the function
    await addCommentToPost(originalPoster, postID, myUsername, comment);

    // Assert that axios.post was called with the correct arguments
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/comment`),
      {
        profileUsername: originalPoster,
        postID: postID,
        myUsername,
        content: comment,
      },
    );
  });
    
  it('throws an error when parameters are invalid', async () => {
    const invalidParameters = [
      { originalPoster: '', postID: '123', myUsername: 'user2', comment: 'Great post!' },
      { originalPoster: 'user1', postID: '', myUsername: 'user2', comment: 'Great post!' },
      { originalPoster: 'user1', postID: '123', myUsername: '', comment: 'Great post!' },
      { originalPoster: 'user1', postID: '123', myUsername: 'user2', comment: '' },
    ];

    for (const { originalPoster, postID, myUsername, comment } of invalidParameters) {
      await expect(addCommentToPost(originalPoster, postID, myUsername, comment)).rejects.toThrowError('Error adding comment: Invalid parameters');
    }

    expect(axios.post).not.toHaveBeenCalled();
  });

  it('throws an error when adding comment fails', async () => {
    const errorMessage = 'Failed to add comment to post';
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    await expect(addCommentToPost(originalPoster, postID, myUsername, comment)).rejects.toThrowError(errorMessage);

    expect(axios.post).toHaveBeenCalledWith(
      `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/comment`,
      {
        profileUsername: originalPoster,
        postID: postID,
        myUsername,
        content: comment,
      },
    );
  });
});

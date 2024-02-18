import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { act, renderHook } from '@testing-library/react-hooks';
import { addCommentToPost } from '../utils/addCommentToPost';
import { fetchPostComments } from '../utils/fetchPostComments';
import { useComments } from './useComments';

jest.mock('@context/my-user-info/useMyUserInfo');
jest.mock('../utils/fetchPostComments');
jest.mock('../utils/addCommentToPost');

describe('useComments', () => {
  const postID = '123';
  const originalPoster = 'user1';
  const myUsername = 'user2';
  const comments = [
    { content: 'Great post!', timestamp: 123456789, username: 'user3' },
    { content: 'Awesome!', timestamp: 123456790, username: 'user4' },
  ];

  beforeEach(() => {
    (useMyUserInfo as jest.Mock).mockReturnValue({ username: myUsername });
  });

  it('fetches comments on mount', async () => {
    (fetchPostComments as jest.Mock).mockResolvedValue(comments);

    const { result, waitForNextUpdate } = renderHook(() => useComments(postID, originalPoster));

    expect(result.current.loadingFetchComments).toBe(true);
    await waitForNextUpdate();
    expect(result.current.loadingFetchComments).toBe(false);
    expect(result.current.comments).toEqual(comments);
  });

  it('adds comment to post', async () => {
    (addCommentToPost as jest.Mock).mockResolvedValue(undefined);
    (fetchPostComments as jest.Mock).mockResolvedValue(comments);

    const { result, waitForNextUpdate } = renderHook(() => useComments(postID, originalPoster));

    await act(async () => {
      await result.current.addComment('New comment');
      await waitForNextUpdate();
    });

    expect(result.current.loadingAddComment).toBe(false);
    expect(result.current.comments.length).toBe(comments.length + 1);
  });

  it('handles errors when fetching comments', async () => {
    (fetchPostComments as jest.Mock).mockRejectedValue(new Error('Failed to fetch comments'));

    const { result, waitForNextUpdate } = renderHook(() => useComments(postID, originalPoster));

    await waitForNextUpdate();

    expect(result.current.loadingFetchComments).toBe(false);
    expect(result.current.comments).toEqual([]);
  });

  it('handles errors when adding comment', async () => {
    (addCommentToPost as jest.Mock).mockRejectedValue(new Error('Failed to add comment'));
    (fetchPostComments as jest.Mock).mockResolvedValue(comments);

    const { result, waitForNextUpdate } = renderHook(() => useComments(postID, originalPoster));

    await act(async () => {
      await result.current.addComment('New comment');
      await waitForNextUpdate();
    });

    expect(result.current.loadingAddComment).toBe(false);
    expect(result.current.comments).toEqual(comments);
  });
});

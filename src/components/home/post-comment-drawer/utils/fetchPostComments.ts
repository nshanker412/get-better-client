import { Comment } from '@models/posts';
import axios from 'axios';

/**
 * fetch post comments
 * @param postId
 * 
 * @returns comments
 */
export const fetchPostComments = async (origionalPoster: string, postId: string): Promise<Comment[] | void> => {
    
    if (!postId) {
        throw new Error('Error fetching comments: Invalid parameters');
    }
    
    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/comments`,
            {
                profileUsername: origionalPoster,
                postID: postId,
            },
        );
        return response.data.comments;
    }
    catch (error) {
        console.log('fetchPostCommentsError', error);
        throw new Error('Failed to fetch comments');
    }       
}
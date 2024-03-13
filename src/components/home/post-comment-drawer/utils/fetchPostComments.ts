import { Comment } from '@models/posts';
import axios from 'axios';

/**
 * fetch post comments
 * @param postID
 * 
 * @returns comments
 */
export const fetchPostComments = async (origionalPoster: string, postID: string): Promise<Comment[] | void> => {
    
    if (!postID) {
        console.log('Error fetching comments: Invalid parameters');
    }
    
    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/comments`,
            {
                profileUsername: origionalPoster,
                postID: postID,
            },
        );
        return response.data.comments;
    }
    catch (error) {
        console.log('fetchPostCommentsError', error);
        console.log('Failed to fetch comments');
    }       
}
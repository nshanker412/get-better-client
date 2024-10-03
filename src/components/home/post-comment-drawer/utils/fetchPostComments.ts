import { Comment } from '@models/posts';
import axios from 'axios';

/**
 * fetch post comments
 * @param postID
 * 
 * @returns comments
 */
export const fetchPostComments = async (origionalPoster: string, postID: string,userToken:string): Promise<Comment[] | void> => {
    
    if (!postID) {
        console.log('Error fetching comments: Invalid parameters');
    }
    
    try {

        const response = await axios.get(
			`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/post-comment?search=${postID}`,{ headers: {"Authorization" : `Bearer ${userToken}`}}

		);
        return response.data["results"];
    }
    catch (error) {
        console.log('fetchPostCommentsError', error);
        console.log('Failed to fetch comments');
    }       
}
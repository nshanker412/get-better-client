
import { Post, PostsApiResponse } from '@models/posts';
import axios from 'axios';

/**
 * 
 * @returns {Promise<Post[] >}
 */
export const getFeed = async (myUsername: string | undefined | null): Promise<Post[] | []> => {
    if (!myUsername) return [];
    try {
        const friendsFeed: Post[] | [] = await fetchFriendsPosts(myUsername);
        const publicFeed: Post[] | [] = await fetchPublicPosts(myUsername);
        
       
        const feed = [...friendsFeed, ...publicFeed];

        // TODO - add filtering for duplicates
        return feed;

    } catch (error) {
        console.error('Error fetching feed:', error);
        return [];
    }
}
    


	// fetch all friends post metadata
const fetchFriendsPosts = async (myUsername: string): Promise<Post[] |[]> => {
        
    try {
        const response = await axios.get<PostsApiResponse>(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/feed/fetch/friends/${myUsername}`);
        return response.data.posts;
    } catch (error) {
        console.log('fetchFriendsPostsError', error);
        return [];
    }

	};

/**
 * 
 * @param myUsername 
 * @returns 
 */
const fetchPublicPosts = async (myUsername: string): Promise<Post[] | []> => {

        try {
            const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/feed/fetch/public/${myUsername}`);
            return response.data.posts;
    
        }
        catch (error) {
            console.log('fetchPublicPostsError', error);
            return [];
        }
    }

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


        // Remove duplicates
        // const uniqueFeed: Post[] = Array.from(new Map(feed.map(post => [post.filename, post])).values());

        // console.log('unique feed:', uniqueFeed);

        return feed;

    } catch (error) {
        console.error('Error fetching feed:', error);
        return [];
    }
}
//fetch all friends post metadata
const fetchFriendsPosts = async (userToken: string): Promise<Post[] | []> => {
    try {
        const response = await axios.get<PostsApiResponse>(
            `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/post`,{ headers: {"Authorization" : `Bearer ${userToken}`}}

        );


        return response.data["results"];
    } catch (error) {
        return [];
    }

	};

/**
 * 
 * @param userToken 
 * @returns 
 */
const fetchPublicPosts = async (userToken: string): Promise<Post[] | []> => {
        console.log(userToken)
        try {
            const response = await axios.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/post`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
            );

            return response.data["results"];
        }
        catch (error) {
            console.log('fetchPublicPostsError', error);
            return [];
        }
    }
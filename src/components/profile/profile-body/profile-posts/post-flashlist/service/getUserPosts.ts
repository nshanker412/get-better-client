
import { Post } from "@models/posts";
import axios from "axios";

export const getUserPosts = async (username: string): Promise<Post[] | []> => {
    try {
        const response = await axios.get(
            `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetch/posts/${username}`,
        )
        return response.data.posts;
    } catch (error) {
        console.log('fetchUserPosts', error);
        return [];
    }
}
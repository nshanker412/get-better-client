import axios from 'axios';


/**
 * Add a comment to a post
 */
export const addCommentToPost = async (originalPoster: string, postId: string, myUsername: string, comment: string): Promise<void> => {

    if (!originalPoster || !postId || !myUsername || !comment) {
        throw new Error('Error adding comment: Invalid parameters');
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/comment`,
            {
                profileUsername: originalPoster,
                postID: postId,
                myUsername,
                content: comment,
            },
        );
        console.log('addCommentToPost', response.data);
        return response.data;
    }
    catch (error) {
        console.log('addCommentToPostError', error);
        throw new Error('Failed to add comment to post');
    }

};

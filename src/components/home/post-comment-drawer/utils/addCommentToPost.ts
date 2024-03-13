import axios from 'axios';


/**
 * Add a comment to a post
 */
export const addCommentToPost = async (originalPoster: string, postID: string, myUsername: string, comment: string): Promise<void> => {

    if (!originalPoster || !postID || !myUsername || !comment) {
        console.log('Error adding comment: Invalid parameters');
    }

    try {
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/comment`,
            {
                profileUsername: originalPoster,
                postID: postID,
                myUsername,
                content: comment,
            },
        );
        console.log('addCommentToPost', response.data);
        return response.data;
    }
    catch (error) {
        console.log('addCommentToPostError', error);
        console.log('Failed to add comment to post');
    }

};

import axios from 'axios';


/**
 * Add a comment to a post
 */
export const addCommentToPost = async (originalPoster: string, postID: string, myUsername: string, comment: string,userToken:string): Promise<void> => {

    if (!originalPoster || !postID || !myUsername || !comment) {
        console.log('Error adding comment: Invalid parameters');
    }

    try {
        const resp = await axios.get(
			`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/users?search=${myUsername}`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
			
	  
		  );
        const response = await axios.post(
            `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/post-comment`,
            {
                created_by: resp.data["results"][0]["id"],
                post: postID,
                comment: comment,
            },
            { headers: {"Authorization" : `Bearer ${userToken}`}}

        );
        console.log('addCommentToPost', response.data);
        return response.data;
    }
    catch (error) {
        console.log('addCommentToPostError', error);
        console.log('Failed to add comment to post');
    }

};

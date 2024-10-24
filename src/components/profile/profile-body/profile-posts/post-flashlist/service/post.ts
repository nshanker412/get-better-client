
import axios from 'axios';


export const setPostLiked = async (user: string, id: string, myUsername: string, isLiked: boolean,userToken:string): Promise<void> => {
    console.log(`sending out liked notification ${user}_${id}`)
    
    try {
        const resp = await axios.get(
			`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
			
	  
		  );
        await axios({
            method: "post",
            url: `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/like-post`,
            data: {
                post: id,
                liked_by: resp.data["id"],
                status: isLiked,
            },
            headers: {"Authorization" : `Bearer ${userToken}`},
        })
    } catch (error) {
        console.log('setPostLikedError', error);
    }
    
};


export const setFlagged = async (user: string, id: string, myUsername: string, isFlagged: boolean): Promise<void> => {
    console.log(`sending out flagged notification ${user}_${id}`)
    
    try {
      await axios
            .post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/flag`, {
                profileUsername: user,
                postID: id,
                myUsername,
                status: isFlagged,
            })

    } catch (error) {
        console.log('setFlaggedError', error);
    }
    
};
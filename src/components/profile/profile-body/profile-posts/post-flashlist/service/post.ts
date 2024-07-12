
import axios from 'axios';

export const setPostLiked = async (user: string, id: string, myUsername: string, isLiked: boolean): Promise<void> => {
    console.log(`sending out liked notification ${user}_${id}`)
    
    try {
      await axios
            .post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/like`, {
                profileUsername: user,
                postID: id,
                myUsername,
                status: isLiked,
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
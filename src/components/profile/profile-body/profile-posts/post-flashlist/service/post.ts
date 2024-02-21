import axios from 'axios';

export const setPostLiked = async (user: string, id: string, myUsername: string, isLiked: boolean): Promise<void> => {
    console.log(`${user}_${id}`)
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
    
    // if (isLiked) {

    //     const pushNotifInfo: PushNotificationInfoPacket = {
    //         title: `${myUsername} liked your post.`,
    //         body: `check it out!`,
    //         data: { path: 'profile', params: { profileUsername: postData.user, postId: postID } },
    //     };
    
    //     sendOutPushNotification(postData.user, pushNotifInfo);
    // }
    
};
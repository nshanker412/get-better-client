import axios from 'axios';

// export const fetchPostLikes = async ({}) => {
    

//     await axios
//        .post(
//            `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/likes`,
//            {
//                profileUsername: posterName,
//                postID: postID,
//                myUsername: myUsername,
//            },
//        )
//         .then((response) => {
//            const newLikesCount = response.data.likes;
//            const newDidILike = response.data.liked;
           
//            if (likesCount !== newLikesCount) {
//                setLikesCount(newLikesCount);
//            }
//            if (newDidILike !== liked) {
//                setLiked(newDidILike);
//            }

//        })
//        .catch((error) => {
//            console.log('fetchPostLikesError', error);
//        })
   
// }

export const setPostLiked = async (user: string, id: string, myUsername: string, isLiked: boolean): Promise<void> => {
    
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
    
    // refresh();
};
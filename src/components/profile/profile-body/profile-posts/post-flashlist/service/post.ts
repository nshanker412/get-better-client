
import axios from 'axios';
import { NotificationType, PushNotificationInfoPacket,configureMyNotifications } from '@context/notifications/Notifications.types';
import { useNotifications } from '@context/notifications/useNotifications';


export const setPostLiked = async (user: string, id: string, myUsername: string, isLiked: boolean,userToken:string): Promise<void> => {
    console.log(`sending out liked notification ${user}_${id}`)
    const { sendOutPushNotification } = useNotifications();
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
        configureMyNotifications(resp.data["username"])
        // const pushNotifInfo: PushNotificationInfoPacket = {
        //     title: `${myUsername} liked your post.`,
        //     body: `check it out!`,
        //     data: {
        //         type: NotificationType.LIKED_POST,
        //         path: 'profile',
        //         params:
        //         {
        //             profileUsername: resp.data["username"],
        //             postID: id
        //         }
        //     },
        // };
        const pushNotifInfo: PushNotificationInfoPacket = {
            title: `${myUsername} liked your post.`,
            body: `check it out!`,
            data: {
                type: NotificationType.LIKED_POST,
                path: 'profile',
                params:
                {
                    profileUsername: user,
                    postID: id
                }
            },
        };
        sendOutPushNotification(resp.data["username"], pushNotifInfo);
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
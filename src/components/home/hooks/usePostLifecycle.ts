import { PushNotificationInfoPacket } from "@context/notifications/Notifications.types";
import { useNotifications } from "@context/notifications/useNotifications";
import { PostMetadata } from "@models/posts";
import axios from "axios";
import * as FileSystem from "expo-file-system";
import { useEffect, useState } from "react";


/**
 * Lifecycle maintainer for a single post
 * @param postID
 * 
 */

export interface UsePostLifecycleProps {
    filename: string;
    postID: string;
    metadata: PostMetadata;
    myUsername: string;
}


export interface UsePostLifecycleReturnType {
    loadingMedia: boolean;
    loadingLikesCount: boolean;
    loadingCommentsCount: boolean;
    caption: string;
    likesCount: number | undefined;
    liked: boolean | undefined;
    commentsCount: number | undefined;
    postMedia: string | null;
    error: string;
    refresh: () => Promise<void>;
    setPostLiked: (isLiked: boolean) => Promise<void>;
}


export const usePostLifecycle = ({ filename, postID, metadata, myUsername  }: UsePostLifecycleProps): UsePostLifecycleReturnType => {
    
    // data
    const [caption, setCaption] = useState<string>('');
    const [likesCount, setLikesCount] = useState<number | undefined>();
    const [type, setType] = useState<'image' | 'video' | null>(null);
    const [commentsCount, setCommentsCount] = useState<number|undefined>();
    const [postMedia, setPostMedia] = useState<string | null>(null);
    const [posterName, setPosterName] = useState<string>('');
    const [liked, setLiked] = useState<boolean| undefined>();

    // flow control
    const [error, setError] = useState<string>('');
    const [loadingMedia, setLoadingMedia] = useState<boolean>(false);
    const [loadingLikesCount, setLoadingLikesCount] = useState<boolean>(false);
    const [loadingCommentsCount, setLoadingCommentsCount] = useState<boolean>(false);

    // hooks
    const { sendOutPushNotification} = useNotifications();

    // 1. initialize
    //  1.a. Fetch media
    //  1.b. Fetch post data
    //  1.c. Fetch likes
    useEffect(() => {
        const fetchPostMedia = async () => {
            if (!postID || !metadata.user || !metadata.type || !filename || !myUsername) {
                setError('Invalid post data');
                return;
            }
            setLoadingMedia(true);
            try {
                // If video
                if (metadata.type === 'video') {
                    setPostMedia(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/video/${metadata.user}_${postID}`);
                    setPosterName(`${metadata.user}_${postID}`);
                    setLoadingMedia(false);
                } else {
                    const filePath = `${metadata.user}_${postID}.jpeg`;
                    const fileUri = FileSystem.documentDirectory + filePath;

                    // Check if the media file exists
                    await FileSystem.getInfoAsync(fileUri)
                        .then(({ exists }) => {
                            if (exists) {
                                // Read the file and set the media
                                FileSystem.readAsStringAsync(fileUri, {
                                    encoding: FileSystem.EncodingType.Base64,
                                })
                                    .then((base64String) => {
                                        setPostMedia(base64String);
                                        setLoadingMedia(false);
                                    })
                                    .catch((readFileError) => {
                                        console.log(
                                            'readFileError',
                                            readFileError.message,
                                        );
                                        setLoadingMedia(false);
                                    });
                            } else {
                                axios
                                    .get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/media/${metadata.user}/${postID}`)
                                    .then(async (response) => {
                                        setPostMedia(response.data.media);
                                        setLoadingMedia(false);

                                        // write to file system
                                        await FileSystem.writeAsStringAsync(
                                            fileUri,
                                            response.data.media,
                                            {
                                                encoding:
                                                    FileSystem.EncodingType.Base64,
                                            },
                                        );
                                    })
                                    .catch((error) => {
                                        console.log('fetchPostMediaError', error);
                                        setLoadingMedia(false);
                                    });
                            }
                        })
                        .catch((existsError) => {
                            console.log('existsError', existsError.message);
                            setLoadingMedia(false);
                            setPostMedia(null)
                        });
                }
            } catch (error) {
                console.log('fetchPostMediaError', error);
                setError('Failed to fetch post media');
            } finally {
                setLoadingMedia(false);
                setLikesCount(metadata.likes.length);
                setCommentsCount(metadata.comments.length);
                setCaption(metadata.caption);
                setType(metadata.type);
                setLiked(metadata.likes.some((like) => like.username === myUsername));
            }

        };
        fetchPostMedia();

    }, []);
    


    const setPostLiked = async (isLiked: boolean): Promise<void> =>  {
		await axios
			.post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/like`, {
				profileUsername: posterName,
				postID: postID,
				myUsername: myUsername,
				status: isLiked,
			})
			.then((response) => {
                setLikesCount(response.data.likes.length);
                setLiked(true);

				if (isLiked) {
				
					const pushNotifInfo: PushNotificationInfoPacket = {
						title: `${myUsername} liked your post.`,
						body: `check it out!`,
						data: { path: 'profile', params: { profileUsername: posterName, postId: postID } },
					};
				
					sendOutPushNotification(posterName, pushNotifInfo);
				}
			})
			.catch((error) => {
				console.log('updatePostLikeErrord', error);
			});
	}




    const fetchPostLikes = async () => {
		 axios
			.post(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/likes`,
				{
					profileUsername: name,
					postID: postID,
					myUsername: myUsername,
				},
			)
             .then((response) => {
                console.log('fetchPostLikes', response.data);
                const newLikesCount = response.data.likes;
                const newDidILike = response.data.liked;
                
                if (likesCount !== newLikesCount) {
                    setLikesCount(newLikesCount);
                }
                if (newDidILike !== liked) {
                    setLiked(newDidILike);
                }
   
			})
			.catch((error) => {
				console.log('fetchPostLikesError', error);
            })
        
    }

    const fetchPostComments = async () => {
         axios
            .post(
                `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/comments`,
                {
                    profileUsername: posterName,
                    postID: postID,
                },
            )
            .then((response) => {
                const newCommentCount = response.data.comments.length;
                if (newCommentCount !== commentsCount) {
                    setLiked(response.data.liked);
                }
            })
			.catch((error) => {
				console.log('fetchPostComments', error);
			});
    }
    
    const refresh = async () => {
        try {
            fetchPostComments();
            fetchPostLikes();
        } catch (error) {
            console.log('refreshError', error);
        }
        
    }

    
    return {
        loadingLikesCount,
        loadingCommentsCount,
        loadingMedia,
        likesCount,
        liked,
        caption,
        commentsCount,
        postMedia,
        error,
        refresh,
        setPostLiked,
    };
}
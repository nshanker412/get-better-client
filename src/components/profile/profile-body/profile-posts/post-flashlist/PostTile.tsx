import { LoadingSpinner } from '@components/loading-spinner/LoadingSpinner';
import { Post } from '@models/posts';
import { ResizeMode, Video } from 'expo-av';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { View } from 'react-native';
import { PostOverlay } from './overlay/PostOverlay';


interface PostTileProps {
    post: Post
    myUsername: string
}
interface PostTileRef {
    play: () => void;
    stop: () => void;
    unload: () => void;
  }

/**
 * This component is responsible for displaying a post and play the 
 * media associated with it.
 * 
 * The ref is forwarded to this component so that the parent component
 * can manage the play status of the video.
 */
export const PostTile = forwardRef<PostTileRef, PostTileProps>(({ post, myUsername }, ref) => {
    const [status, setStatus] = useState<any>(null);
    const [paused, setPaused] = useState(false);

    const localRef = useRef(null);
    //  const user = useUser(item.creator).data
    useImperativeHandle(ref, () => ({
        play,
        unload,
        stop
    }))
    useEffect(() => {
        return () => unload();
    }, [])

    /**
     * Plays the video in the component if the ref
     * of the video is not null.
     * 
     * @returns {void} 
     */
    const play = async () => {
        if (localRef.current == null) {
            return;
        }
        if (post.metadata.type === 'image') {

            return;
        }

        // if video is already playing return
        const status = await localRef.current?.getStatusAsync();
        if (status?.isPlaying) {
            return;
        }
        try {
            await localRef.current?.playAsync();
        } catch (e) {
            console.log(e)
        }
    }


    /**
     * Stops the video in the component if the ref
     * of the video is not null.
     * 
     * @returns {void} 
     */
    const stop = async () => {
        if (localRef.current == null) {
            return;
        }
        if (post.metadata.type === 'image') {
            
            return;
        }

        // if video is already stopped return
        const status = await localRef.current?.getStatusAsync();
        if (!status?.isPlaying) {
            return;
        }
        try {
            await localRef.current?.stopAsync();
        } catch (e) {
            console.log(e)
        }
    }


    /**
     * Unloads the video in the component if the ref
     * of the video is not null.
     * 
     * This will make sure unnecessary video instances are
     * not in memory at all times 
     * 
     * @returns {void} 
     */
    const unload = async () => {
        if (localRef.current == null) {
            return;
        }
        if (post.metadata.type === 'image') {
            
            return;
        }

        // if video is already stopped return
        try {
            await localRef.current?.unloadAsync();
        } catch (e) {
            console.log(e)
        }
    }


    const onError = (error) => {
        if (post.metadata.type === 'image') {
            console.log('Image error: ', error)
            return;
        } else {
            console.log('Video error: ', error)
            return 
        }
    }

    const onToggleVideoState = () => {
    
        setPaused(!paused)
  
    }


    const videoUri = `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/video/${post.filename}`;
    const imageUri = `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/v2/image/${post.filename}`


    return (
        <>
            <PostOverlay user={post.metadata.user} postData={post.metadata} myUsername={myUsername} onToggleVideoState={onToggleVideoState}/>
            {post.metadata.type === 'video' && (
                <Video
                ref={localRef}
                    style={{ flex: 1 }}
                
                    resizeMode={ResizeMode.COVER}
                    PosterComponent={() => {
                        return (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <BlurView
                                    intensity={100}
                                    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                                    tint="dark"
                                />
                                <LoadingSpinner />
                            </View>
                        )
                    }
                    }
        
                shouldPlay={!paused}
                isLooping
                    // posterStyle={{ resizeMode: 'cover', height: '100%' }}
                    onPlaybackStatusUpdate={status => setStatus(() => status)}

                source={{
                    uri: videoUri
                }}

            
            />
            )}
            {post.metadata.type ==='image' && (<Image
                ref={localRef}
                recyclingKey={post.filename}
                style={{ flex: 1 }}
                onError={onError}
                source={{
                    uri: imageUri
                }}
                // allowDownscaling={false}
            />
            )}
        
        </>
    )
})

// display name
PostTile.displayName = 'PostTile'
import { Post } from '@models/posts';
import { ResizeMode, Video } from 'expo-av';
import { Image } from 'expo-image';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
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
export const PostTile = forwardRef<PostTileRef, PostTileProps>(({ post, myUsername}, ref) => {

    useEffect(() => {
        console.log('INSIDE POSTTILE', post.filename   )
    }, [post])
     
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






    const videoUri = `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/video/${post.filename}`;
    const imageUri = `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/v2/image/${post.filename}`


    return (
        <>
            <PostOverlay user={post.metadata.user} postData={post.metadata} myUsername={myUsername} />
            
            
            {post.metadata.type ===  'video' && (<Video
                ref={localRef}
                style={{flex: 1}}
                resizeMode={ResizeMode.COVER}
                shouldPlay={false}
                isLooping
                // usePoster
                // posterSource={{ uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                posterStyle={{ resizeMode: 'cover', height: '100%' }}
                source={{
                    uri: videoUri
                }} />
            )}
            {post.metadata.type ==='image' && (<Image
                ref={localRef}
                recyclingKey={post.filename}
                style={{ flex: 1 }}
                onError={onError}
                source={{
                    uri: imageUri
                }}/>
            )}
        
        </>
    )
})

// display name
PostTile.displayName = 'PostTile'
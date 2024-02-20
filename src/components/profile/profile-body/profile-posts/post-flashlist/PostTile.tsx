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

        // if video is already playing return
        const status = await localRef.current.getStatusAsync();
        if (status?.isPlaying) {
            return;
        }
        try {
            await localRef.current.playAsync();
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

        // if video is already stopped return
        const status = await localRef.current.getStatusAsync();
        if (!status?.isPlaying) {
            return;
        }
        try {
            await localRef.current.stopAsync();
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

        // if video is already stopped return
        try {
            await localRef.current.unloadAsync();
        } catch (e) {
            console.log(e)
        }
    }

    const postUri = `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/video/${post.filename}`;


    if (post.metadata.type === 'image') {
        return (
            <>
                <PostOverlay user={post.metadata.user} postData={post.metadata} myUsername={myUsername } />
                <Image
                    ref={localRef}
                    style={{flex: 1}}
                    // posterSource={{ uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                    // posterStyle={{ resizeMode: 'cover', height: '100%' }}
                    source={{
                        uri: postUri
                    }} />
            </>
        )
    }


    return (
        <>
            <PostOverlay user={post.metadata.user} postData={post.metadata} myUsername={myUsername } />
            <Video
                ref={localRef}
                style={{flex: 1}}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={false}
                isLooping
                // usePoster
                // posterSource={{ uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                posterStyle={{ resizeMode: 'cover', height: '100%' }}
                source={{
                    uri: postUri
                }} />
        </>
    )
})

// display name
PostTile.displayName = 'PostTile'
import { LoadingSpinner } from '@components/loading-spinner/LoadingSpinner';
import { FontAwesome6 } from '@expo/vector-icons';
import { Post } from '@models/posts';
import { ResizeMode, Video } from 'expo-av';
import { Image, ImageErrorEventData } from 'expo-image';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from 'react-native-reanimated';
import { PostOverlay } from './overlay/PostOverlay';


const PauseAnimated = forwardRef((props, ref) => {
    const opacity = useSharedValue(0);

    useImperativeHandle(ref, () => ({
        fadeIn() {
            // First, immediately set opacity to 0.5 without any duration
            opacity.value = withSequence(
                withTiming(0.5, { duration: 0 }), // Immediate step to 50% visibility
                withTiming(0, { duration: 1500, easing: Easing.out(Easing.quad) }) // Then ease out to 0% over a second
            );
        },
        fadeOut() {
            // If needed, you can define logic to fade out or reset opacity immediately
            opacity.value = withTiming(0, { duration: 500, easing: Easing.linear });
        },
    }));

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[stylesl.overlay, animatedStyle]}>
            <FontAwesome6 name="pause" size={100} color="black" />
        </Animated.View>
    );
});
PauseAnimated.displayName = 'PauseAnimated';
  
const PlayAnimated = forwardRef((props, ref) => {
    const opacity = useSharedValue(0);

    useImperativeHandle(ref, () => ({
        fadeIn() {
            // First, immediately set opacity to 0.5 without any duration
            opacity.value = withSequence(
                withTiming(0.5, { duration: 0 }), // Immediate step to 50% visibility
                withTiming(0, { duration: 1500, easing: Easing.out(Easing.quad) }) // Then ease out to 0% over a second
            );
        },
        fadeOut() {
            // If needed, you can define logic to fade out or reset opacity immediately
            opacity.value = withTiming(0, { duration: 500, easing: Easing.linear });
        },
    }));

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));

    return (
        <Animated.View style={[stylesl.overlay, animatedStyle]}>
            <FontAwesome6 name="play" size={100} color="black" />
        </Animated.View>
    );
});
PlayAnimated.displayName = 'PlayAnimated';




  
  const stylesl = StyleSheet.create({
    overlay: {
          position: 'absolute',
        zIndex: 10,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
    },
    overlayText: {
      color: 'white',
      fontSize: 24,
    },
  });



interface PostTileProps {
    post: Post;
    myUsername: string;
    isEmbeddedFeed?: boolean;
    isFullscreenPreview?: boolean;
    handlePostPress?: () => void;
}
interface PostTileRef {
    play: () => void;
    pause: () => void;
    stop: () => void;
    unload: () => void;
    mute: () => void;
    unMute: () => void;
  }

/**
 * This component is responsible for displaying a post and play the 
 * media associated with it.
 * 
 * The ref is forwarded to this component so that the parent component
 * can manage the play status of the video.
 */
export const PostTile = forwardRef<PostTileRef, PostTileProps>(({ handlePostPress, post, isFullscreenPreview, myUsername, isEmbeddedFeed }, ref) => {
    const pauseAniRef = useRef(null);
    const playAniRef = useRef(null);
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        play,
        unload,
        pause,
        stop, 
        mute,
        unMute
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
            playAniRef.current?.fadeIn(); // Trigger fade-out when the video is played
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


    const mute = async () => {
        if (localRef.current == null) {
            return;
        }
        if (post.metadata.type === 'image') {
            return;
        }

        try {
            await localRef.current?.setIsMutedAsync(true);
        } catch (e) {
            console.log(e)
        }
    }

    const unMute = async () => {
        if (localRef.current == null) {
            return;
        }
        if (post.metadata.type === 'image') {
            return;
        }

        try {
            await localRef.current?.setIsMutedAsync(false);
        } catch (e) {
            console.log(e)
        }
    }


    const togglePausePlay = async () => {
        if (localRef.current == null) {
            return;
        }
        if (post.metadata.type === 'image') {
            return;
        }
        const status = await localRef.current?.getStatusAsync();
        if (status?.isPlaying) {
            pauseAniRef.current?.fadeIn(); // Trigger fade-in when the video is paused
            await localRef.current?.pauseAsync();
        } else {
            playAniRef.current?.fadeIn(); // Trigger fade-out when the video is played
            await localRef.current?.playAsync();
        }
    }

    const pause = async () => {
        console.log('we in pause boid')
        if (localRef.current == null) {
            return;
        }
        if (post.metadata.type === 'image') {
            return;
        }
        const status = await localRef.current?.getStatusAsync();
        if (status?.isPlaying) {
            return;
        }
        try {
            playAniRef.current?.fadeOut(); // Trigger fade-out when the video is played

            await localRef.current?.pauseAsync();
        } catch (e) {
            console.log(e)
        }
    }

    const onToggleVideoState = () => {
        togglePausePlay();
    }

    const onVideoError = (error: string) => {   
        console.log('Video error: ', error)
        // Sentry.captureException(error)
    }


    const onImageError = (error: ImageErrorEventData) => {   
        console.log('Video error: ', error)
        // Sentry.captureException(error)

    }

    const videoUri = `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/video/${post.filename}`;
    const imageUri = `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/v2/image/${post.filename}`


    return (
        <>
            <PostOverlay
                user={post.metadata.user}
                postData={post.metadata}
                myUsername={myUsername}
                onToggleVideoState={onToggleVideoState}
                handlePostPress={handlePostPress}
                isEmbeddedFeed={isEmbeddedFeed}
                 />
            {post.metadata.type === 'video' && (
        <View style={{ flex: 1, backfaceVisibility: 'visible'}}>
                <Video
                    ref={localRef}
                    style={{ flex: 1 }}
                    resizeMode={ResizeMode.COVER}
                        onError={onVideoError}
                        // shouldPlay={loaded && !paused}
                    isLooping={true}
                    volume={1.0}
                    PosterComponent={() => <LoadingSpinner />}
                    posterStyle={{ width: '100%', height: '100%', backgroundColor: 'transparent', backfaceVisibility: 'visible'}}
                    // onPlaybackStatusUpdate={onPlaybackStatusUpdateRef.current}
                    usePoster={true}
                    source={{
                        uri: videoUri
                    }}
                />

                    <PauseAnimated ref={pauseAniRef} />
                    <PlayAnimated ref={playAniRef} />
          
            </View>
            )}
            {post.metadata.type ==='image' && (<Image
                ref={localRef}
                recyclingKey={post.filename}
                style={{ flex: 1 }}
                onError={onImageError}
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
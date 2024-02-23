import { LoadingSpinner } from '@components/loading-spinner/LoadingSpinner';
import { grayDark } from '@context/theme/colors_neon';
import { Post } from '@models/posts';
import { ResizeMode, Video } from 'expo-av';
import { Image } from 'expo-image';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';
import { PostOverlay } from './overlay/PostOverlay';


const FadeOverlayComponent = forwardRef((props, ref) => {
    const opacity = useSharedValue(0);
  
    useImperativeHandle(ref, () => ({
        fadeIn() {
        opacity.value = withTiming(0.5, { duration: 500, easing: Easing.linear });
      },
      fadeOut() {
        opacity.value = withTiming(0, { duration: 500, easing: Easing.linear });
      },
    }));
  
    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));
  
    return (
      <Animated.View style={[stylesl.overlay, animatedStyle]}>
        <Text style={stylesl.overlayText}>Paused</Text>
      </Animated.View>
    );
});
  FadeOverlayComponent.displayName = 'FadeOverlayComponent';
  
  const stylesl = StyleSheet.create({
    overlay: {
      position: 'absolute',
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

// const PauseAnimated = ({ trigger }) => {
//     const opacity = useSharedValue(0);
  
//     useEffect(() => {
//       if (trigger) {
//         // Trigger the fade animation when the external trigger changes
//         opacity.value = withSequence(
//           withTiming(0.5, { duration: 0, easing: Easing.linear }), // Immediately set to 50% opacity
//           withTiming(0, { duration: 1000, easing: Easing.linear }) // Then go back down to 0% over 1 second
//         );
//       }
//     }, [trigger]); // Depend on the external trigger
  
//     const animatedStyle = useAnimatedStyle(() => {
//       return {
//         opacity: opacity.value,
//       };
//     });
  
//     return (
//       <View style={styles.container}>
//         <Animated.View style={[animatedStyle]}>
//         <FontAwesome6 name="pause" size={40} color="white" />
//         </Animated.View>
//       </View>
//     );
//   };


// const styles = StyleSheet.create({
//   box: {
//     width: 100,
//     height: 100,
//     backgroundColor: 'blue',
//   },
// });




interface PostTileProps {
    post: Post;
    myUsername: string;
    isEmbeddedFeed?: boolean;
    isFullscreenPreview?: boolean;
    handlePostPress?: (post: string) => void;
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
    // const [loaded, setLoaded] = useState(false);

    // const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    //     // if (status.isLoaded ) {
    //     //     // setLoaded(true);
    //     //     console.log('loaded')
    //     // } else if (!status.isLoaded) {
    //     //     // setLoaded(false);
    //     // }
    // }, [])

    const overlayRef = useRef(null);



    const localRef = useRef(null);
    //  const user = useUser(item.creator).data
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
        console.log('we in play boid')
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
            await localRef.current?.pauseAsync();
        } else {
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
            overlayRef.current?.fadeIn(); // Trigger fade-in when the video is paused
            await localRef.current?.pauseAsync();
        } catch (e) {
            console.log(e)
        }
    }


    const onToggleVideoState = () => {
        togglePausePlay();
    }

    const onVideoError = (error) => {   
        console.log('Video error: ', error)
        throw new Error('Video error')
    }


    const onImageError = (error) => {   
        console.log('Video error: ', error)
        throw new Error('Video error')
    }


    // const onPlaybackStatusUpdateRef = useRef(onPlaybackStatusUpdate);


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
        <>
                <Video
                    ref={localRef}
                    style={{ flex: 1 }}
                    resizeMode={ResizeMode.COVER}
                    isMuted={isEmbeddedFeed}
                    onError={onVideoError}
                    // shouldPlay={loaded && !paused}

                    isLooping={true}
                    volume={1.0}
                    PosterComponent={() => <LoadingSpinner />}
                    posterStyle={{ width: '100%', height: '100%', backgroundColor: grayDark.gray7, backfaceVisibility: 'visible'}}
                    // onPlaybackStatusUpdate={onPlaybackStatusUpdateRef.current}
                    usePoster={true}
                    source={{
                        uri: videoUri
                    }}
                />
                <FadeOverlayComponent ref={overlayRef} />
                    </>

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
import { CommentIcon as CI } from '@assets/darkSvg/CommentIcon';
import { StarIcon } from '@assets/darkSvg/StarIcon.js';
import { StarIconFilled } from '@assets/darkSvg/StarIconFilled.js';
import { ConnectedProfileAvatar } from "@components/profile-avatar/ConnectedProfileAvatar";
import { useCommentDrawer } from "@context/comment-drawer/CommentDrawerContext";
import { fonts } from '@context/theme/fonts';
import { PostMetadata } from "@models/posts";
import { Link } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import throttle from 'lodash/throttle';
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import { timeAgo } from '../../../../../../utils/timeAgo';
import { setPostLiked } from "../service/post";

interface PostOverlayProps {
  user: string;
  postData: PostMetadata;
  myUsername: string;
  onToggleVideoState: () => void;
  handlePostPress: () => void;
  isEmbeddedFeed?: boolean;
    }

/**
 * Function that renders a component meant to be overlapped on
 * top of the post with the post info like user's display name and avatar
 * and the post's description
 *
 * @param {Object} user that created the post
 * @param {Object} post object
 */
export const PostOverlay: React.FC<PostOverlayProps> = React.memo(({ user, postData, myUsername, handlePostPress, onToggleVideoState, isEmbeddedFeed }) => {
  const [currentLikeState, setCurrentLikeState] = useState({
    state: postData.likes?.includes(myUsername),
    counter: postData?.likes?.length,
  });

  const styles = usePostOverlayStyles(isEmbeddedFeed);
  
    const doubleTapRef = useRef(null);
  const { onPostChange, openDrawer } = useCommentDrawer();
  
  const handleOpenCommentDrawer = useCallback(() => {
    onPostChange(`${user}_${postData.timestamp}`);
    openDrawer();
  }, [onPostChange, openDrawer, user, postData.timestamp]);


  const handleUpdateLike = useCallback(
    throttle((currentLikeStateInst) => {
      setCurrentLikeState({
        state: !currentLikeStateInst.state,
        counter: currentLikeStateInst.counter + (currentLikeStateInst.state ? -1 : 1),
      });
      setPostLiked(user, `${postData.timestamp}`, myUsername, currentLikeStateInst.state);
    }, 500),
    [] 
  );

	const onDoubleTapEvent = async (event): Promise<void>  => {
		if (event.nativeEvent.state === State.ACTIVE) {
			// Double tap was detected
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      console.log('onDoubleTapEvent')

			// image wasn't already liked
			if (!currentLikeState.state) {
        handleUpdateLike(currentLikeState);
			}
		}
	};

  const onSingleTapEvent =  (event)  => {
    if (event.nativeEvent.state === State.ACTIVE) {
      // handlePostPress();

      if (isEmbeddedFeed) {
        handlePostPress();
      } else {
        onToggleVideoState();
      }
    }
  };
  
  return (
    <TapGestureHandler
    onHandlerStateChange={onDoubleTapEvent}
    numberOfTaps={2}
    ref={doubleTapRef}>
    <TapGestureHandler
      onHandlerStateChange={
        onSingleTapEvent
      }
      numberOfTaps={1}
       waitFor={doubleTapRef}
      >
      <View
					style={{
            height: isEmbeddedFeed ? 200 : Dimensions.get('window').height,
            width: Dimensions.get('window').width,
            zIndex: 1,
            position: 'absolute',
					}}>
					<View style={styles.postHeader}>
            {!isEmbeddedFeed && (<ConnectedProfileAvatar
              key={postData.user}
              username={postData.user}
              fetchSize={300}
              size={40}
            />)}
						<View style={styles.postHeaderInfoContainer}>
              {!isEmbeddedFeed && (<Link
                to={{
                  screen: 'profile',
                  params: { profileUsername: postData.user },
                }}>
                
                <Text style={styles.username}>
                  {postData.user}
                </Text>
              </Link>
              )}
							<Text style={styles.timestamp}>
								{timeAgo(postData.timestamp)}
							</Text>

						</View>
          </View>
          <BlurView
            intensity={50}
            blurReductionFactor={0.5}
            style={{ width: "100%", borderRadius: 20, overflow: 'hidden' }}
            tint='dark'
          />
       <View style={{flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", height: "100%", paddingBottom: isEmbeddedFeed ? 10: 100, paddingLeft: isEmbeddedFeed ? 5: 10, paddingRight: 10, gap: 5}}>   
       {eval(postData?.challenge) && (<ChallengeMedalIcon isEmbeddedFeed={isEmbeddedFeed} />)}

            
            <StarIconView 
            likes={currentLikeState.counter}
            isLiked={currentLikeState.state}
              onLikePress={() => handleUpdateLike(currentLikeState)}
              isEmbeddedFeed={isEmbeddedFeed} 
          />
          <CommentIcon
            commentCount={postData?.comments?.length ?? 0}
            openCommentDrawer={handleOpenCommentDrawer} 
            isEmbeddedFeed={isEmbeddedFeed} 
            />
            
          </View>
 

          <View style={{ position: 'absolute', right: 0, bottom: 100}}>
            
            </View>
        </View>
        
       
      </TapGestureHandler>
    </TapGestureHandler>
  );
}, (prevProps, nextProps) => {
  return prevProps?.postData?.likes?.length === nextProps?.postData?.likes?.length &&
    prevProps?.postData?.comments?.length === nextProps?.postData?.comments?.length &&
    prevProps?.postData?.timestamp === nextProps?.postData?.timestamp &&
    prevProps?.postData?.user === nextProps?.postData?.user &&
    prevProps?.postData?.challenge === nextProps?.postData?.challenge;
} );
  
PostOverlay.displayName = 'PostOverlay';


const usePostOverlayStyles = (isEmbeddedFeed: boolean) => {

const styles = useMemo(() => StyleSheet.create({
  postHeader: {

    // height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'absolute',
    width: 'auto',
    height: isEmbeddedFeed ? 40: 50, // todo - wrap uname incase some boi has long name
    top: isEmbeddedFeed ? 0 : 100,
    left: 0,
    padding: 10,
    zIndex: 1,
    gap: 10,
  },

  postHeaderInfoContainer: {
    // backgroundColor: 'rgba(0, 0, 0, 0.05)',
    // borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'space-around',
    alignItems: 'flex-start',
    marginLeft: -5,
    paddingTop: 2,
    paddingBottom: 2,
  },
  container: {
      // height: Dimensions.get('window').height,  
    // width: Dimensions.get('window').width,
    width: '100%',
    height: '100%',
        position: 'absolute',
        zIndex: 1,
        bottom: 0,
        paddingLeft: 20,
        paddingBottom: isEmbeddedFeed ? 10: 80,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    displayName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16
    },
    description: {
        marginTop: 10,
        color: 'white',
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: 'white',
        marginBottom: 30
    },
    leftContainer: {
      alignItems: 'center',
      // paddingTop: 150,
    },
    actionButton: {
        paddingBottom: 16
    },
    actionButtonText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 4
  },
  username: {
    color: 'white',
    fontFamily: fonts.inter.bold,
    fontSize: 16,
    // fontWeight: '700',
    textAlign: 'left',
    backgroundColor: 'transparent',
    textShadowColor:'rgba(0, 0, 0, 0.55)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2
  },
  timestamp: {
    // fontFamily: theme.text.body.medium.fontFamily,
    fontFamily: fonts.inter.medium,
    fontSize: 11,
    // color: 	'#9A9A9A',
    textShadowColor: 'rgba(0, 0, 0, 0.55)',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 2,
    color: 'white',
    textAlign: 'left',
  },
}), [isEmbeddedFeed]);
  
return styles;
}

const CommentIcon: React.FC<{ commentCount: number; openCommentDrawer: () => void; isEmbeddedFeed: boolean}> = ({ commentCount, openCommentDrawer, isEmbeddedFeed }) => {

  const styles = StyleSheet.create({
    iconShadow: {
      shadowColor: '#000000',
      shadowOffset: { width: -3, height: 3 },
      shadowOpacity: 0.65,
      shadowRadius: 3,
    },
    actionButtonText: {
      textShadowColor: 'rgba(0, 0, 0, 0.55)',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: 3,
      fontFamily: fonts.inter.bold,
      color: 'white',
      textAlign: 'center',
      marginTop: isEmbeddedFeed ? 2:4,
      fontSize: isEmbeddedFeed ? 12 : 16,
},
  });

  const size = isEmbeddedFeed ? 20 : 45;

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        openCommentDrawer();
      }}>
      <SvgXml
        style={styles.iconShadow}
        width={size}
        height={size}
        xml={CI}
      />
      <Text style={styles.actionButtonText}>
        {commentCount}
      </Text>
    </TouchableOpacity>
  );
};

const StarIconView: React.FC<{ likes: number; isLiked: boolean; onLikePress: () => void;isEmbeddedFeed: boolean }> = ({ likes, isLiked, onLikePress, isEmbeddedFeed }) => {
  
  
  const styles = StyleSheet.create({
    iconShadow: {
      shadowColor: '#000000',
      shadowOffset: { width: -3, height: 3 },
      shadowOpacity: 0.65,
      shadowRadius: 3,
    },
    actionButtonText: {
      textShadowColor: 'rgba(0, 0, 0, 0.55)',
      textShadowOffset: { width: -1, height: 0 },
      textShadowRadius: 3,
      fontFamily: fonts.inter.bold,
      color: 'white',
      textAlign: 'center',
      marginTop: isEmbeddedFeed ? 2:4,
      fontSize: isEmbeddedFeed ? 12 : 16,

},
  });


  const size = isEmbeddedFeed ? 20 : 45;
  
  return (
    <TouchableOpacity
      onPress={onLikePress}>
  
      <SvgXml
          style={styles.iconShadow}

        width={size}
        height={size}
        xml={isLiked ? StarIconFilled : StarIcon}
        />
    

      <Text style={styles.actionButtonText}>
        {likes}
        </Text>
    </TouchableOpacity>
  );
};

const ChallengeMedalIcon: React.FC<{ isEmbeddedFeed: boolean }> = ({ isEmbeddedFeed }) => {

  // const size = isEmbeddedFeed ? 20 : 45;
const size = isEmbeddedFeed ? 20 : 45;
  return (
    <Image
      style={{width: size, height: size}}
      source={require('../../../../../../img/medal.png')}/>
  );
}



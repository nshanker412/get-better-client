import { CommentIcon as CI } from '@assets/darkSvg/CommentIcon';
import { StarIcon } from '@assets/darkSvg/StarIcon.js';
import { StarIconFilled } from '@assets/darkSvg/StarIconFilled.js';
import { ConnectedProfileAvatar } from "@components/profile-avatar/ConnectedProfileAvatar";
import { useCommentDrawer } from "@context/comment-drawer/CommentDrawerContext";
import { PostMetadata } from "@models/posts";
import * as Haptics from 'expo-haptics';
import throttle from 'lodash/throttle';
import React, { useCallback, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import { setPostLiked } from "../service/post";


interface PostOverlayProps {
    user: string;
    postData: PostMetadata;
  myUsername: string;
  onToggleVideoState: () => void;
    }

/**
 * Function that renders a component meant to be overlapped on
 * top of the post with the post info like user's display name and avatar
 * and the post's description
 *
 * @param {Object} user that created the post
 * @param {Object} post object
 */
export const PostOverlay: React.FC<PostOverlayProps> = React.memo(({ user, postData, myUsername, onToggleVideoState }) => {
  console.log('postData', postData)
  const [currentLikeState, setCurrentLikeState] = useState({
    state: false,
    counter: postData?.likes?.length,
  });

  const doubleTapRef = useRef(null);


  const { openDrawer} = useCommentDrawer();
     

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

	const onSingleTapEvent =async  (event):  Promise<void>  => {
    if (event.nativeEvent.state === State.ACTIVE) {
			// Toggle play/pause
			onToggleVideoState();
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
    <View style={styles.container}>
      <View>
        <Text style={styles.displayName}>{user}</Text>
        <Text style={styles.description}>{postData.caption}</Text>
      </View>

      <View style={styles.leftContainer}>
        <ConnectedProfileAvatar
          key={`${user}-avatar`}
                username={user}
                size={40}
            />

      <StarIconView 
          likes={currentLikeState.counter}
          isLiked={currentLikeState.state}
          onLikePress={() => handleUpdateLike(currentLikeState)}
        />
        <CommentIcon
          commentCount={postData?.comments?.length ?? 0}
          openCommentDrawer={openDrawer} />

        
          
      </View>
        </View>
      </TapGestureHandler>
    </TapGestureHandler>
  );
}, (prevProps, nextProps) => {
  return prevProps.postData === nextProps.postData;
} );
  
PostOverlay.displayName = 'PostOverlay';

const styles = StyleSheet.create({
  container: {
      height: Dimensions.get('window').height,  
        width: Dimensions.get('window').width,
        position: 'absolute',
        zIndex: 999,
        bottom: 0,
        paddingLeft: 20,
        paddingBottom: 80,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
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
        alignItems: 'center'
    },
    actionButton: {
        paddingBottom: 16
    },
    actionButtonText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 4
    }
})





const CommentIcon: React.FC<{ commentCount: number; openCommentDrawer: () => void; }> = ({ commentCount, openCommentDrawer }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        openCommentDrawer();
      }}>
      <SvgXml
        // style={feedPostStyles.iconStyle} // Uncomment and use if you have specific styles
        width={40}
        height={40}
        xml={CI}
      />
      <Text style={styles.actionButtonText}>
        {commentCount}
      </Text>
    </TouchableOpacity>
  );
};

const StarIconView: React.FC<{ likes: number; isLiked: boolean; onLikePress: () => void; }> = ({ likes, isLiked, onLikePress }) => {
  return (
    <TouchableOpacity
      onPress={onLikePress}>
      <SvgXml
        width={40}
        height={40}
        xml={isLiked ? StarIconFilled : StarIcon}
      />
      <Text style={styles.actionButtonText}>
        {likes}
      </Text>
    </TouchableOpacity>
  );
};

const ChallengeMedalIcon = () => {
  return (
    <Image
    style={{width: 50, height: 50}}
    source={require('../../../../../../img/medal.png')}/>
  );
}



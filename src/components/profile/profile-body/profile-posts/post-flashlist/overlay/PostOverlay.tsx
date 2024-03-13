import { CommentIcon as CI } from '@assets/darkSvg/CommentIcon';
import { StarIcon } from '@assets/darkSvg/StarIcon.js';
import { StarIconFilled } from '@assets/darkSvg/StarIconFilled.js';
import { ConnectedProfileAvatar } from "@components/profile-avatar/ConnectedProfileAvatar";
import { PlanItem } from '@components/profile/profile-body/plan-list/plan-item/PlanItem';
import { PlanType } from '@components/profile/profile-body/plan-list/plan-item/PlanItem.types';
import { useCommentDrawer } from "@context/comment-drawer/CommentDrawerContext";
import { NotificationType, PushNotificationInfoPacket } from '@context/notifications/Notifications.types';
import { useNotifications } from '@context/notifications/useNotifications';
import { fonts } from '@context/theme/fonts';
import { Entypo } from '@expo/vector-icons';
import { PostMetadata } from "@models/posts";
import { Link, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import throttle from 'lodash/throttle';
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FloatingAction, IFloatingActionProps } from 'react-native-floating-action';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import { timeAgo } from '../../../../../../utils/timeAgo';
import { setPostLiked } from "../service/post";


interface PostOverlayProps {
  user: string;
  filename: string;
  postData: PostMetadata;
  myUsername: string;
  onToggleVideoState: () => void;
  handlePostPress: (() => void) | undefined,
  isEmbeddedFeed?: boolean;
}


interface PlanTileType {
  id: string;
	planType: PlanType;
	title: string;
}


// fn to generate list of icons for floating action button
const genPlanIconList = (linkedPlans: PlanTileType[]) => {
  if (!linkedPlans || linkedPlans?.length <= 0) {
    return [];
  }

  const planIconList: IFloatingActionProps[] = linkedPlans?.map((plan, index) => {
    return {
      key: index,
      id: index, 
      text: plan.title,
      icon: <PlanItem planType={plan.planType} size={30}  />,
      name: `${plan.id}`,
      textStyle: { fontFamily: fonts.inter.light },
      color: "black",
      textBackground: "black",
      textColor: "white",
      textStyles: { fontFamily: fonts.inter.medium, backgroundColor: "transparent" },
      opacity: 0.5,
    } as IFloatingActionProps;
  });

  return planIconList;
}

/**
 * Function that renders a component meant to be overlapped on
 * top of the post with the post info like user's display name and avatar
 * and the post's description
 *
 * @param {Object} user that created the post
 * @param {Object} post object
 */
const _PostOverlay: React.FC<PostOverlayProps> = ({ user, filename, postData, myUsername, handlePostPress, onToggleVideoState, isEmbeddedFeed }) => {
  const { sendOutPushNotification } = useNotifications(); 

  // console.log("currentpostdata", postData)
  const [currentLikeState, setCurrentLikeState] = useState({
    state: postData.likes?.includes(myUsername),
    counter: postData?.likes?.length,
  });

  const [linkedActionFab, setLinkedActionFab] = useState([]);
  const navigation = useNavigation();

  const onPressAction = (name: string) => {
    console.log(`selected button: ${name}`);
    onPressPlan(name);
  }

  const onPressPlan = (planId: string) => {
    navigation.navigate('profilePlanV2', {
      planID: planId,
      profileUsername: user
    });
  };

  useEffect(() => {
    const fetchLinkedPlans = async () => {
      if (postData.linkedPlans) {
      
        try {

          // filter out plans that dont have a character at the first position
        

          const fetchPromises = postData?.linkedPlans?.map(async (plan, index) => {
            try {

              const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/v2/plan/fetch/${plan}`);
              const data: PlanTileType = {
                id: resp.data.plan.id,
                planType: resp.data.plan.data.planCategory,
                title: resp.data.plan.planName,
              };
              console.log('data', data)
              return data;
        
            
            } catch (error) {
              console.log('Error fetching linked plan', error);
            }

          });
  
          const linkedPlanData = await Promise.all(fetchPromises);
  
          // const linkedPlanData: PlanTileType[] = responses.map((response, index) => ({
          //   id: response?.data?.plan?.id,
          //   planType: response?.data?.plan?.data?.planCategory,
          //   title: response?.data?.plan?.planName,
          // }));
  
          console.log('linkedPlanData', linkedPlanData);
  
          if (linkedPlanData !== null && linkedPlanData?.length > 0) {
            const newActions = genPlanIconList(linkedPlanData);
            setLinkedActionFab(newActions);
          } else {
            console.log('No linked plans');
            setLinkedActionFab([]);
          }
        } catch (error) {
          // console.log('Error fetching linked plans', error);
        }
      }
    }
  
    fetchLinkedPlans();
  }, [user, postData?.timestamp, postData?.linkedPlans]);
  
  

  const styles = usePostOverlayStyles(isEmbeddedFeed);
  
  const doubleTapRef = useRef(null);
  const { onPostChange, openDrawer } = useCommentDrawer();
  
  const handleOpenCommentDrawer = useCallback(() => {
    onPostChange(`${user}_${postData.timestamp}`);
    openDrawer();
  }, [onPostChange, openDrawer, user, postData.timestamp]);


  const handleUpdateLike = useCallback(
    throttle((currentLikeStateInst) => {
      try {
        const postID = `${postData.timestamp}`;
        const newLikeState = !currentLikeStateInst.state;
        setCurrentLikeState({
          state: newLikeState,
          counter: currentLikeStateInst.counter + (newLikeState ? 1 : -1),
        });
        setPostLiked(user, postID, myUsername, newLikeState);
        if (newLikeState) {

          const pushNotifInfo: PushNotificationInfoPacket = {
            title: `${myUsername} liked your post.`,
            body: `check it out!`,
            data: {
              type: NotificationType.LIKED_POST,
              path: 'profile',
              params: {
                profileUsername: postData.user,
                postID: postID
              }
            },
          };
    
          sendOutPushNotification(postData?.user, pushNotifInfo);
        }
      } catch (error) {
          console.log('setPostLikedError', error);
        }
  
    }, 500),
    []
  );

  const onDoubleTapEvent = async (event): Promise<void> => {
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

  const onSingleTapEvent = (event) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      // handlePostPress();

      if (isEmbeddedFeed && handlePostPress) {
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
            {!isEmbeddedFeed && (
              <ConnectedProfileAvatar
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
          <View style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", height: "100%", paddingBottom: isEmbeddedFeed ? 10 : 100, paddingLeft: isEmbeddedFeed ? 5 : 10, paddingRight: 10, gap: 5 }}>
            {eval(postData?.challenge) && (<ChallengeMedalIcon isEmbeddedFeed={!!isEmbeddedFeed} />)}
            <View style={{ position: "absolute", bottom: 80, right: 0, width: Dimensions.get("window").width }}>
              {linkedActionFab?.length > 0 && <FloatingAction
                actions={linkedActionFab}
                showBackground={true}
                color={"black"}
                
                style={{ padding: 10, backgroundColor: "transparent" }}
                onPressItem={onPressAction}
                floatingIcon={
                  <Entypo name="dots-three-vertical" size={30} color="white" />
                }
              />}
            </View>
            <StarIconView
              likes={currentLikeState.counter}
              isLiked={currentLikeState.state}
              onLikePress={() => handleUpdateLike(currentLikeState)}
              isEmbeddedFeed={!!isEmbeddedFeed}
            />
            <CommentIcon
              commentCount={postData?.comments?.length ?? 0}
              openCommentDrawer={handleOpenCommentDrawer}
              isEmbeddedFeed={!!isEmbeddedFeed}
            />
          </View>
          <View style={{ position: 'absolute', right: 0, bottom: 100 }}>
          </View>
        </View>
      </TapGestureHandler>
    </TapGestureHandler>
  );
};
  


const usePostOverlayStyles = (isEmbeddedFeed: boolean) => {

const styles = useMemo(() => StyleSheet.create({
  postHeader: {
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: -5,
    paddingTop: 2,
    paddingBottom: 2,
  },
  container: {
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
    backgroundColor: 'transparent',
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
      backgroundColor: 'transparent',
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
      backgroundColor: 'transparent',

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
      backgroundColor: 'transparent',
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
      backgroundColor: 'transparent',
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




export const PostOverlay = React.memo(_PostOverlay);
PostOverlay.displayName = 'PostOverlay';

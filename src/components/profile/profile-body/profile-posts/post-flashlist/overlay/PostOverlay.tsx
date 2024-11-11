import { CommentIcon as CI } from '@assets/darkSvg/CommentIcon';
import { StarIcon } from '@assets/darkSvg/StarIcon.js';
import { StarIconFilled } from '@assets/darkSvg/StarIconFilled.js';
import { GBIcon } from '@components/custom-icons/GBIcon';
import { ConnectedProfileAvatar } from "@components/profile-avatar/ConnectedProfileAvatar";
import { PlanItem } from '@components/profile/profile-body/plan-list/plan-item/PlanItem';
import { PlanType } from '@components/profile/profile-body/plan-list/plan-item/PlanItem.types';
import { useCommentDrawer } from "@context/comment-drawer/CommentDrawerContext";
import { NotificationType, PushNotificationInfoPacket } from '@context/notifications/Notifications.types';
import { useNotifications } from '@context/notifications/useNotifications';
import { grayDark } from '@context/theme/colors_neon';
import { fonts } from '@context/theme/fonts';
import { PostMetadata } from "@models/posts";
import { Link, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import throttle from 'lodash/throttle';
import LottieView from 'lottie-react-native';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { FloatingAction, IFloatingActionProps } from 'react-native-floating-action';
import { State, TapGestureHandler } from 'react-native-gesture-handler';
import { SvgXml } from 'react-native-svg';
import { timeAgo } from '../../../../../../utils/timeAgo';
import { setPostLiked, setFlagged } from "../service/post";
import { FlagFilled } from '@assets/darkSvg/FlagFilled';
import { FlagBlank } from '@assets/darkSvg/Flag';
import { useAuth } from '@context/auth/useAuth';
import { ReportModal } from '@components/reports/ReportModal';


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
const _PostOverlay: React.FC<PostOverlayProps> = ({  user, filename, postData, myUsername, handlePostPress, onToggleVideoState, isEmbeddedFeed }) => {
  const { sendOutPushNotification } = useNotifications(); 
  const {userToken} =useAuth();
  const animationRef = useRef<StarIconViewHandles>(null);
  // console.log("currentpostdata", postData)
  
  const [currentLikeState, setCurrentLikeState] = useState({
    state: postData.likes?.includes(myUsername),
    counter: postData?.likes?.length,
  });
  const [currentFlagState, setCurrentFlagState] = useState({
    state: postData.likes?.includes(myUsername),
    counter: postData?.likes?.length,
  });

  const [linkedActionFab, setLinkedActionFab] = useState([]);
  const navigation = useNavigation();
  const [isChallengeModalOpen,setIsChallengeModalOpen] = useState(false)




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


    const handleUpdateLike = useCallback(
        throttle((currentLikeStateInst) => {
          try {
            const postID = `${postData["id"]}`;
            const newLikeState = !currentLikeStateInst.state;

            
            setCurrentLikeState({
              state: newLikeState,
              counter: currentLikeStateInst.counter + (newLikeState ? 1 : -1),
            });
            setPostLiked(user, postID, myUsername, newLikeState, userToken);
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

      const handleUpdateFlag = useCallback(
        throttle((currentFlagStateInt) => {
          console.log(currentFlagStateInt)
          try {
            const postID = `${postData["id"]}`;
            const newFlagState = !currentFlagStateInt.state;
            setCurrentFlagState({
              state: newFlagState,
              counter: currentFlagStateInt.counter + (newFlagState ? 1 : -1),
            });
            setFlagged(user, postID, myUsername, newFlagState);
            if (newFlagState) {
    
              const pushNotifInfo: PushNotificationInfoPacket = {
                title: `${myUsername} Flagged your post.`,
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
  useEffect(() => {
    
    const fetchLinkedPlans = async () => {
      if (postData.linkedPlans) {
        
        try {

          // filter out plans that dont have a character at the first position
        

          const fetchPromises = postData?.linkedPlans?.map(async (plan, index) => {
            
            try {
              const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/plan/${plan}`,{ headers: {"Authorization" : `Bearer ${userToken}`}}

              );
              const data: PlanTileType = {
                id: resp.data.id,
                planType: resp.data.data.planCategory,
                title: resp.data.planName,
              };
              
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
  
          // console.log('linkedPlanData', linkedPlanData);
  
          if (linkedPlanData !== null && linkedPlanData?.length > 0) {
            const newActions = genPlanIconList(linkedPlanData);
            setLinkedActionFab(newActions);
          } else {
            // console.log('No linked plans');
            setLinkedActionFab([]);
          }
        } catch (error) {
          // console.log('Error fetching linked plans', error);
        }
      }
    }
  
    fetchLinkedPlans();
    setCurrentLikeState({
      state: postData.likes?.includes(myUsername)??false,
      counter: postData?.likes?.length,
    })
  }, [user, postData?.id, postData?.linkedPlans]);
  



  const styles = usePostOverlayStyles(isEmbeddedFeed);
  
  const doubleTapRef = useRef(null);
  const { onPostChange, openDrawer } = useCommentDrawer();
  
  const handleOpenCommentDrawer = useCallback(() => {
    onPostChange(`${user}_${postData["id"]}`);
    openDrawer();
  }, [onPostChange, openDrawer, user, postData["id"]]);

  const onCloseModalPress = () => {
    setIsChallengeModalOpen(false);
  };
  
  const onReportPress = () => {
    setIsChallengeModalOpen(true);
  };


  const onDoubleTapEvent = async (event): Promise<void> => {
    if (event.nativeEvent.state === State.ACTIVE) {
      // Double tap was detected
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      console.log('onDoubleTapEvent')

      // image wasn't already liked
      if (!currentLikeState.state) {
        handleUpdateLike(currentLikeState);
        animationRef?.current?.play();

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
            <View style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-start", height: "10%", paddingBottom: isEmbeddedFeed ? 30 : 30, paddingLeft: isEmbeddedFeed ? 80 : 0 , paddingRight: isEmbeddedFeed ? 2 : 4 }}>
            {!isEmbeddedFeed && (
              <ReportIcon
              openReport={onReportPress}
              isEmbeddedFeed={!!isEmbeddedFeed}
            />
            )}
              <ReportModal
                isVisible={isChallengeModalOpen}
                postTitle={postData.caption!}
                postID={postData.id!}
                onClosePress={onCloseModalPress}
              />
            </View>
          </View>
          
          <BlurView
            intensity={50}
            blurReductionFactor={0.5}
            style={{ width: "100%", borderRadius: 20, overflow: 'hidden' }}
            tint='dark'
          />
          <View style={{ flexDirection: "column", alignItems: "flex-start", justifyContent: "flex-end", height: "100%", paddingBottom: isEmbeddedFeed ? 10 : 100, paddingLeft: isEmbeddedFeed ? 5 : 10, paddingRight:  isEmbeddedFeed ? 2 : 4, gap: 5 }}>
            {eval(postData?.challenge) && (<ChallengeMedalIcon isEmbeddedFeed={!!isEmbeddedFeed} />)}
            <View style={{ position: "absolute", bottom: 80, right: 0, width: Dimensions.get("window").width }}>
              {linkedActionFab?.length > 0 &&
                (
                <FloatingAction
                  actions={linkedActionFab}
                  showBackground={true}
                  color={"black"}
                  overlayColor={"transparent"}
                  style={{ padding: 10, backgroundColor: "transparent" }}
                  onPressItem={onPressAction}
                  floatingIcon={
                    <GBIcon
                      size={40}
                    />
                }
                  />
                )
              }
            </View>
      

            <StarIconView
              ref={animationRef}
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
          
            {postData?.caption && !isEmbeddedFeed && (
              <View
              style={{
                position: "absolute",
                  bottom: 100,
                  marginLeft: 60,
                  minHeight: 50,
                maxHeight: 100,
                width: Dimensions.get("window").width - 160,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                  padding: 10,
                  gap: 10,
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderRadius: 10,
                display: 'flex',
              }}>
              <Text style={{ fontFamily: fonts.inter.medium, color: grayDark.gray12, fontSize: 16 }}>
                {postData?.caption}
              </Text>
            </View>
            )}
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
      color: grayDark.gray12,
      fontSize: 16,
      fontFamily: fonts.inter.medium,
      shadowColor: 'rgba(0, 0, 0, 0.55)',
      shadowOffset: { width: -1, height: 1 },
      shadowRadius: 2,
      backgroundColor: 'transparent',
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


const ReportIcon: React.FC<{ openReport: () => void; isEmbeddedFeed: boolean}> = ({ openReport, isEmbeddedFeed }) => {

  const styles = StyleSheet.create({
    iconShadow: {
      shadowColor: '#000000',
      shadowOffset: { width: -3, height: 3 },
      shadowOpacity: 0.65,
      shadowRadius: 3,
      backgroundColor: 'transparent',
      zIndex: 2,
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

  const size = isEmbeddedFeed ? 20 : 30;

  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        openReport();
      }}>
      <SvgXml
        style={styles.iconShadow}
        width={size}
        height={size}
        strokeWidth={1}
        xml={FlagBlank}
      />

     
    </TouchableOpacity>
  );
};


const CommentIcon: React.FC<{ commentCount: number; openCommentDrawer: () => void; isEmbeddedFeed: boolean}> = ({ commentCount, openCommentDrawer, isEmbeddedFeed }) => {

  const styles = StyleSheet.create({
    iconShadow: {
      shadowColor: '#000000',
      shadowOffset: { width: -3, height: 3 },
      shadowOpacity: 0.65,
      shadowRadius: 3,
      backgroundColor: 'transparent',
      zIndex: 2,
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
        strokeWidth={1}
        xml={CI}
      />

      <Text style={styles.actionButtonText}>
        {commentCount}
      </Text>
    </TouchableOpacity>
  );
};

const useLikeButtonStyle = (isEmbeddedFeed: boolean) => {

  const iconSize = isEmbeddedFeed ? 20 : 45;
  const animationSize = isEmbeddedFeed ? 35: 80;
  const animationInset = (animationSize - iconSize) / 2;


  const styles = StyleSheet.create({
    animationContainer: {
      width: animationSize,
      height: animationSize,
      position: 'absolute',
      bottom: animationInset,
      right: animationInset,
      left:-(animationInset), 
      top: -(animationInset),
      zIndex: 2,
    },
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
      marginTop: isEmbeddedFeed ? 2 : 4,
      fontSize: isEmbeddedFeed ? 12 : 16,
      backgroundColor: 'transparent',
    },
    starAnimation: {
      
      width: animationSize,
      height: animationSize,  
    },
  });

  
  return styles;
}

interface StarIconViewProps  {
  likes: number;
  isLiked: boolean;
  onLikePress: () => void;
  isEmbeddedFeed: boolean;
}

interface StarIconViewHandles {
  play: () => void;
}


const StarIconView = forwardRef<StarIconViewHandles,  StarIconViewProps>(({likes, isLiked, onLikePress, isEmbeddedFeed}, ref) => {
  const animation = useRef<LottieView>(null);


  const styles = useLikeButtonStyle(isEmbeddedFeed);

  useImperativeHandle(ref, () => ({
    play: () => {
      console.log('play in lottie')
      animation?.current?.play();
    },
  }));

  const onLikePressCallback = useCallback(() => {
    onLikePress(); 
    if (!isLiked) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      animation?.current?.play(); // Assuming play() is the method to start the animation
    }
  }, [isLiked, onLikePress]);


  
 
  const size = isEmbeddedFeed ? 20 : 45;
  
  return (
    <TouchableOpacity
      onPress={onLikePressCallback}>
      <SvgXml
        style={styles.iconShadow}
        width={size}
        height={size}
        xml={isLiked ? StarIconFilled : StarIcon}
      />
      <View style={styles.animationContainer}>
      <LottieView
        ref={animation}
        style={styles.starAnimation}
        source={require('@assets/lottie/starExplode.json')}
        autoPlay={false}
        loop={false}
      />
      </View>
      <Text style={styles.actionButtonText}>
        {likes}
        </Text>
      </TouchableOpacity>
  );
});
StarIconView.displayName = 'StarIconView';

interface FlagIconViewProps  {
  flags: number;
  isFlagged: boolean;
  onFlagPress: () => void;
  isEmbeddedFeed: boolean;
}

interface FlagIconViewHandles {
  play: () => void;
}

const FlagIconView = forwardRef<FlagIconViewHandles,  FlagIconViewProps>(({flags, isFlagged, onFlagPress, isEmbeddedFeed}, ref) => {
  const animation = useRef<LottieView>(null);


  const styles = useLikeButtonStyle(isEmbeddedFeed);

  useImperativeHandle(ref, () => ({
    play: () => {
      console.log('play in lottie')
      animation?.current?.play();
    },
  }));

  const onFlagPressCallback = useCallback(() => {
    onFlagPress(); 
    if (!isFlagged) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      animation?.current?.play(); // Assuming play() is the method to start the animation
    }
  }, [isFlagged, onFlagPress]);


  
 
  const size = isEmbeddedFeed ? 20 : 45;
  
  return (
    <TouchableOpacity
      onPress={onFlagPressCallback}>
      <SvgXml
        style={styles.iconShadow}
        width={size}
        height={size}
        xml={isFlagged ? FlagFilled : FlagBlank }
        />
      <View style={styles.animationContainer}>
      <LottieView
        ref={animation}
        style={styles.starAnimation}
        source={require('@assets/lottie/starExplode.json')}
        autoPlay={false}
        loop={false}
        />
      </View>
      <Text style={styles.actionButtonText}>
        {flags}
        </Text>
      </TouchableOpacity>
  );
});
FlagIconView.displayName = 'FlagIconView';

const ChallengeMedalIcon: React.FC<{ isEmbeddedFeed: boolean }> = ({ isEmbeddedFeed }) => {

const size = isEmbeddedFeed ? 20 : 45;
  return (
    <Image
      style={{width: size, height: size}}
      source={require('../../../../../../img/medal.png')}/>
  );
}




export const PostOverlay = React.memo(_PostOverlay);
PostOverlay.displayName = 'PostOverlay';

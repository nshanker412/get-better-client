import { CommentIcon as CI } from '@assets/darkSvg/CommentIcon';
import { StarIcon } from '@assets/darkSvg/StarIcon.js';
import { StarIconFilled } from '@assets/darkSvg/StarIconFilled.js';
import { ConnectedProfileAvatar } from "@components/profile-avatar/ConnectedProfileAvatar";
import { PlanItem } from '@components/profile/profile-body/plan-list/plan-item/PlanItem';
import { PlanType } from '@components/profile/profile-body/plan-list/plan-item/PlanItem.types';
import { useCommentDrawer } from "@context/comment-drawer/CommentDrawerContext";
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
import { FloatingAction } from 'react-native-floating-action';
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


interface PlanTileType {
  id: string;
	planType: PlanType;
	title: string;
}




// fn to generate list of icons for floating action button
const genPlanIconList = (allPlans: any[], linkedPlans: string[]|undefined) => {
  if (!linkedPlans || linkedPlans?.length == 0 || !allPlans || allPlans.length === 0) {
    return [];
  }

  console.log('linkedPlans', linkedPlans, linkedPlans?.length);


  // filter out the plans that dontn have matching id

  let included = []

  for (let i = 0; i < allPlans.length; i++) {
    if (linkedPlans.includes(allPlans[i].id)) {
      included.push(allPlans[i]);
    }
  }

  //1 - filter out plans that are not linked

  const planIconList = included.map((plan, index) => {
    
    console.log('leftover', plan);
    return {
      id: index, 
      text: plan.title,
      icon: <PlanItem planType={plan.planType} />,
      name: plan.id,
      textStyle: { fontFamily: fonts.inter.light },
      color: "black",
      opacity: 0.5,
      position: 1,
    };
  });

  return planIconList;
}




// const acts = [

// 	{
// 	  text: "Plan",
// 		//   icon: require("./images/ic_language_white.png"),
// 		name: "bt_link_post",
// 		textStyle: {fontFamily: fonts.inter.light},
//     color: "black",
//     opacity: 0.5,
// 		icon: <FontAwesome5 name="link" size={24} color="white" />,
// 	  position: 1
// 	},
// 	{
// 	  text: "Location",
// 		icon: <FontAwesome5 name="map-marked-alt" size={24} color="white" />,
// 		name: "bt_room",
//     textStyle: { fontFamily: fonts.inter.light },
//     color: "black",
// 	  position: 2
// 	},
//   ];

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

  const [linkedActionFab, setLinkedActionFab] = useState();
  const navigation = useNavigation();

  const onPressAction = (name: string) => {
    console.log(`selected button: ${name}`);
    onPressPlan(name);
  }

  const onPressPlan = (planId: string) => {
    navigation.navigate('profilePlan', {
      planID: planId, profileUsername: user 
    });
  };
  // jump to other tab then into a nested screen in that stack


  // const goToProfilePlan = (planID:string) => {
  //   navigation.dispatch((state) => {
  //     //update navigation state as you want.
  //     const routes = [
  //       //current state
  //       ...state.routes, 
  //       //add 2 new route to state.
  //       { name: 'profile', params: {profileUsername: user} }, //you can also add params 
  //       {name: 'plan', params: {planID: planID, profileUsername: user}}
  //     ];
  
  //     return CommonActions.reset({
  //       ...state,
  //       routes,
  //       index: routes.length - 1,
  //     });
  //   });
  // }
  


  // const onPressPlan = (planId: string) => {
  //   navigation.navigate('profile', {profileUsername: user });
  // };
  

  useEffect(() => {
    const fetchLinkedPlans = async () => {
      if (!postData?.linkedPlans) {
        return;
      }
      try {
        console.log('POST METADATA', postData);
        console.log('fetchLinkedPlans', postData?.linkedPlans);
        const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/plans/fetch/${user}`);
        const allPlans: PlanTileType[] = response.data?.plans?.map((plan: PlanTileType) => ({
          id: `${plan?.timestamp}`,
          title: plan?.title,
          planType: plan?.planType,
        }));
        console.log('allPlans', allPlans);
        
        if (allPlans.length > 0) {
          const newActions = genPlanIconList(allPlans, postData?.linkedPlans);


          setLinkedActionFab(newActions);
        }
      } catch (error) {
        console.error('Error fetching linked plans', error);
      }
    };

    fetchLinkedPlans();
  }, [user, postData?.timestamp,  postData?.linkedPlans]);

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
              <View style={{position: "absolute", bottom: 80, right: 0, width: Dimensions.get("window").width}}>
              {linkedActionFab && <FloatingAction
                actions={linkedActionFab}

                showBackground={false}
                color={"rgba(0, 0, 0, 0.5)"}
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
    prevProps?.postData?.challenge === nextProps?.postData?.challenge &&
    prevProps?.postData?.linkedPlans === nextProps?.postData?.linkedPlans;
} );
  
PostOverlay.displayName = 'PostOverlay';


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



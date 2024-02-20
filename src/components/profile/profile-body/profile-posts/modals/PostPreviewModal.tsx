import { useThemeContext } from '@context/theme/useThemeContext';
import { AntDesign } from '@expo/vector-icons';
import { Post } from '@models/posts';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FeedPost } from '../../../../home/FeedPost';
import { Modal } from '../../../../primitives/action-modal/ActionModal';
import { DeletePostModal } from './DeletePostModal';

import { Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';



// // 1. Define the handler
// function usePageScrollHandler(handlers, dependencies) {
//   const { context, doDependenciesDiffer } = useHandler(handlers, dependencies);
//   const subscribeForEvents = ['onPageScroll'];

//   return useEvent(
//     (event) => {
//       'worklet';
//       const { onPageScroll } = handlers;
//       if (onPageScroll && event.eventName.endsWith('onPageScroll')) {
//         onPageScroll(event, context);
//       }
//     },
//     subscribeForEvents,
//     doDependenciesDiffer
//   );
// }

// // 2. Attach the event handler
// const AnimatedPagerView = Animated.createAnimatedComponent(PagerView);

// const pageScrollHandler = usePageScrollHandler({
//   onPageScroll: (e) => {
//     'worklet';
//     offset.value = e.offset;
//     console.log(e.offset, e.position);
//   },
// });

// <AnimatedPagerView onPageScroll={pageScrollHandler} />;

export interface PostPreviewModalProps {
  posts: Post[];
  isVisible: boolean;
  index: number;
  isMyProfile: boolean;
  myUsername: string;
  onClosePress: (close: boolean) => void;
}

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({
  posts,
  isVisible,
  isMyProfile,
  index: initialIndex,
  myUsername,
  onClosePress,
}) => {
  if (posts === null || initialIndex < 0) return null;
  if (initialIndex >= posts?.length) return null;
  const window = Dimensions.get('window');

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const { theme } = useThemeContext();
  const [index, setIndex] = useState<number>(initialIndex);

  const onDeletePressCb = async () => {
    setDeleteModalVisible(true);
  };

  const onDeleteModalClose = (isPostDeleted: boolean) => {
    setDeleteModalVisible(false);
    if (isPostDeleted) {
      onClosePress(true);
    }
  };

  // const translateY = useSharedValue(0); 

  // const animatedStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ translateY: translateY.value }],
  //   };
  // });

  // useEffect(() => {
  //   translateY.value = withSpring(0, { damping: 20, stiffness: 100 });
  // }, [ translateY]);

  const onChangePostWrapper = useCallback((direction: 'prev' | 'next', index: number) => {
    if (direction === 'prev') {
      if (index === 0) {
        onClosePress(false);
      } else {
        setIndex(index - 1);
      }
    }
    if (direction === 'next') {
      if (index === posts.length - 1) {
        onClosePress(false);
      } else {
        setIndex(index + 1);
      }
    }
  }, [onClosePress, posts]);

  const scrollViewRef = React.useRef<ScrollView>(null);



  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
		// media loading handling
		const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / window.height);
    setIndex(index);
		// setCurrentScrollIndex(index);
		// currentScrollIndexRef.current = index;

		// fetch public handling
		const contentHeight = event.nativeEvent.contentSize.height;
		const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

		// Check if the user has scrolled to the bottom
		if (index === posts.length - 1) {
  
      onClosePress(false);
    }

  };
  
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: window.height * index, animated: false });
    }
  }, [index, scrollViewRef, window.height]);


 

  return (
     
      <Modal isVisible={isVisible} style={{width: Dimensions.get("screen").width}} hasBackdrop onBackdropPress={() => onClosePress(false)}>
        <View
          style={{
            // position: 'absolute',
            // width: 50,
            // height: 50,
            // right: 0,
            // top: '10%',
            // marginRight: -30,
            // zIndex: 100,
          }}>
          <TouchableOpacity onPress={() => onClosePress(false)}>
            <AntDesign name='closecircle' size={24} color='black' />
          </TouchableOpacity>
        </View>
        {isMyProfile && (
          <View
            style={{
              // position: 'absolute',
              // width: 50,
              // height: 50,
              // right: 0,
              // top: '20%',
              // marginRight: -30,
              // zIndex: 100,
            }}>
            <TouchableOpacity onLongPress={onDeletePressCb}>
              <AntDesign name='delete' size={24} color='white' />
            </TouchableOpacity>
          </View>
        )}
                  <Host>

                
          <View style={{ height: window.height , width:window.width  }}>
					<ScrollView
						ref={scrollViewRef}
						id='post-preview-scroll-view'
            contentContainerStyle={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'}}
						snapToAlignment={'start'}
            pagingEnabled
            
						onMomentumScrollEnd={() => {
							Haptics.impactAsync(
								Haptics.ImpactFeedbackStyle.Medium,
							);
						}}
						onScroll={handleScroll}
              scrollEventThrottle={20}
          


          >
            <>
            {posts?.map((post, _index) => {
                 return( <FeedPost
                    key={`${post.filename}-post-preview`}
                    filename={post.filename}
                    index={_index}
                    loadMedia={true}
                   pauseVideo={true}
                    profileUsername={post.metadata.user}
                    postID={`${post.metadata.timestamp}`}
                    postData={post.metadata}
                    myUsername={myUsername}
                 />
                 )
            }
            )}
            </>
          </ScrollView>
        </View>
      </Host>
      <>
      <DeletePostModal isVisible={deleteModalVisible} onClosePress={onDeleteModalClose} deletePostId={`${posts[index].filename}`} />
</>
          </Modal>
    
  );
};


import { useThemeContext } from '@context/theme/useThemeContext';
import { AntDesign } from '@expo/vector-icons';
import { Post } from '@models/posts';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';
import { runOnJS } from 'react-native-reanimated';
import { FeedPost } from '../../../../home/FeedPost';
import { Modal } from '../../../../primitives/action-modal/ActionModal';
import { DeletePostModal } from './DeletePostModal';


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

  const flingUp = Gesture.Fling()
    .direction(Directions.UP)
    .onStart(() => { runOnJS(onChangePostWrapper)('next', index) })

  const flingDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onStart(() => runOnJS(onChangePostWrapper)('prev', index))
  

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [index]);

  const allFlings = Gesture.Exclusive(flingUp, flingDown);



  return (
    <GestureHandlerRootView>
      <Modal isVisible={isVisible}  hasBackdrop onBackdropPress={() => onClosePress(false)}>
        <View
          style={{
            // position: 'absolute',
            // width: 50,
            // height: 50,
            // right: 0,
            // top: '10%',
            // marginRight: -30,
            zIndex: 100,
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
              zIndex: 100,
            }}>
            <TouchableOpacity onLongPress={onDeletePressCb}>
              <AntDesign name='delete' size={24} color='white' />
            </TouchableOpacity>
          </View>
        )}
                <Host>
          <GestureDetector gesture={allFlings}>
                  <FeedPost
                    key={`${posts[index].filename}-post-preview`}
                    filename={posts[index].filename}
                    index={index}
                    loadMedia={true}
                    pauseVideo={false}
                    profileUsername={posts[index].metadata.user}
                    postID={`${posts[index].metadata.timestamp}`}
                    postData={posts[index].metadata}
                    myUsername={myUsername}
              />
          </GestureDetector>
                </Host>
      </Modal>
      <DeletePostModal isVisible={deleteModalVisible} onClosePress={onDeleteModalClose} deletePostId={`${posts[index].filename}`} />
    </GestureHandlerRootView>
  );
};


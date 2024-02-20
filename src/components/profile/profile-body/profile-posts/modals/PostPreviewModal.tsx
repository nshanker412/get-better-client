import { useThemeContext } from '@context/theme/useThemeContext';
import { AntDesign } from '@expo/vector-icons';
import { Post } from '@models/posts';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView
} from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { Modal } from '../../../../primitives/action-modal/ActionModal';
import { DeletePostModal } from './DeletePostModal';
export interface PostPreviewModalProps {
  isVisible: boolean;
  index: number;
  post: Post;
  isMyProfile: boolean;
  myUsername: string;
  onChangePost: (direction: 'prev' | 'next') => void;
  onClosePress: (close: boolean) => void;
  children: React.ReactNode;
}

 const PostPreviewModal: React.FC<PostPreviewModalProps> = ({
  isVisible,
  post,
  myUsername,
  isMyProfile,
  index,
  onClosePress,
   onChangePost,
  children,
}) => {
  if (!post) return null;

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const { theme } = useThemeContext();

  const postId = `${post?.metadata?.timestamp}`;
  const profileUsername = post?.metadata?.user;
  const postData = post?.metadata;

  const onDeletePressCb = async () => {
    setDeleteModalVisible(true);
  };

  const onDeleteModalClose = (isPostDeleted: boolean) => {
    setDeleteModalVisible(false);
    if (isPostDeleted) {
      onClosePress(true);
    }
  };

  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 20, stiffness: 100 });
  }, [post, translateY]);

  const onChangePostWrapper = (direction) => {
    onChangePost(direction);
  };

  const flingUp = Gesture.Fling()
    .direction(Directions.UP)
    .onStart(() => {
      // translateY.value = withSpring(-500, { damping: 20, stiffness: 100 });
    onChangePostWrapper('next')
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    })


  const flingDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onStart(() => {
      // translateY.value = withSpring(500, { damping: 20, stiffness: 100 });
      onChangePostWrapper('prev');
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    })
  

  useEffect(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [index]);

  const allFlings = Gesture.Exclusive(flingUp, flingDown);

  return (
    <GestureHandlerRootView>
      <Modal isVisible={isVisible} hasBackdrop onBackdropPress={() => onClosePress(false)}>
        <View
          style={{
            position: 'absolute',
            width: 50,
            height: 50,
            right: 0,
            top: '10%',
            marginRight: -30,
            zIndex: 100,
          }}>
          <TouchableOpacity onPress={() => onClosePress(false)}>
            <AntDesign name='closecircle' size={24} color='black' />
          </TouchableOpacity>
        </View>
        {isMyProfile && (
          <View
            style={{
              position: 'absolute',
              width: 50,
              height: 50,
              right: 0,
              top: '20%',
              marginRight: -30,
              zIndex: 100,
            }}>
            <TouchableOpacity onLongPress={onDeletePressCb}>
              <AntDesign name='delete' size={24} color='white' />
            </TouchableOpacity>
          </View>
        )}
        <Modal.Container containerStyle={{ backgroundColor: theme.innerContainer.backgroundColor, width: '100%', height: '100%' }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <GestureDetector gesture={allFlings}>
              <Animated.View>
                <Host>
                  {children}
              </Host>
              </Animated.View>
          </GestureDetector>
          </View>
        </Modal.Container>
      </Modal>
      <DeletePostModal isVisible={deleteModalVisible} onClosePress={onDeleteModalClose} deletePostId={postId} />
    </GestureHandlerRootView>
  );
};


// Wrap your component with React.memo and define the comparison function
const MemoizedPostPreviewModal = React.memo(PostPreviewModal, (prevProps, nextProps) => {
  return (
    prevProps.isVisible === nextProps.isVisible &&
    prevProps.index === nextProps.index &&
    prevProps.isMyProfile === nextProps.isMyProfile &&
    prevProps.myUsername === nextProps.myUsername &&
    prevProps.onChangePost === nextProps.onChangePost &&
    prevProps.onClosePress === nextProps.onClosePress
  );
});

export default MemoizedPostPreviewModal;
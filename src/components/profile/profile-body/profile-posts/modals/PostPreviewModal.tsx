import { AntDesign } from '@expo/vector-icons';
import { Post } from '@models/posts';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { DeletePostModal } from './DeletePostModal';

import { Dimensions } from 'react-native';
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


import { PostTile } from '../post-flashlist/PostTile';


import { useCommentDrawer } from '@context/comment-drawer/CommentDrawerContext';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { ViewToken } from 'react-native';
import { Portal } from 'react-native-portalize';
import { ConnectedPostCommentDrawer } from '../../../../home/post-comment-drawer/ConnectedPostCommentDrawer';

// interface PostTileRef {
//     play: () => void;
//     stop: () => void;
//     unload: () => void;
//   }

import { useRef } from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
/**
 * Component that renders a list of posts meant to be 
 * used for the feed screen.
 * 
 * On start make fetch for posts then use a flatList 
 * to display/control the posts.
 */
export function PreviewFeedScreen({ posts, currentPost, isMyFeed, isFullscreen, onClosePress, onFetchPosts }: { isMyFeed: boolean;  posts: Post[]; currentPost: string; onClosePress: (close: boolean) => void, onFetchPosts: ()=> Promise<void>, isFullscreen: boolean }) {
    const mediaRefs = useRef([]);
    const { username: myUsername } = useMyUserInfo()
    const profileFeedRef = useRef(null)
    const currentPostFilenameRef = useRef<string>(currentPost)
  const { onPostChange } = useCommentDrawer()


  const [refreshing, setRefreshing] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);



  const onDeletePressCb = async () => {
    setDeleteModalVisible(true);
  };

  const onDeleteModalClose = (isPostDeleted: boolean) => {
    setDeleteModalVisible(false);
    if (isPostDeleted) {
      onClosePress(true);
    }
  };

    /**
     * Called any time a new post is shown when a user scrolls
     * the FlatList, when this happens we should start playing 
     * the post that is viewable and stop all the others
     */
    const onViewableItemsChanged = useCallback(({ changed }: { changed: ViewToken[] }) => {
        changed.forEach(({ item, isViewable }) => {
            if (isViewable) {
                console.log('currentPostFilenameRef', currentPostFilenameRef.current)
                currentPostFilenameRef.current = item.filename
            }
      

        });
    }, [onPostChange]);


  
    const handlePostPress = (postID: string) => {
      // Check if the clicked element is one of the children

      // find/set the index and open the fullscreen feedlist
      // const index = posts.(post => post.filename === postID);

      mediaRefs.current
 
      if (flashlistRef.current && flashlistRef.current.contains(event.target)) {
        // You can access the clicked element using event.target
        console.log('Child element clicked:', event.target);
      }
    };
  

    const onViewableItemsChangedRef = useRef(onViewableItemsChanged);
    // const feedItemHeight = Dimensions.get('window').height;


    const renderItem: ListRenderItem<Post> = ({ item }) => {
        return (
            <View style={{ height: 200, width: "100%",  backgroundColor: 'black' }}>
            <PostTile handlePostPress={handlePostPress}  isEmbeddedFeed={ !isFullscreen} post={item} myUsername={myUsername ?? ''} ref={PostTileRef => (mediaRefs.current[item.filename] = PostTileRef)}
                />
            </View>
        );
    };


  
  const onRefreshFeed = async () => {
    if (isFullscreen) {
      onClosePress(false);
    } else {
       setRefreshing(true);
       await onFetchPosts();
      setRefreshing(false);

    }
  }

  return (
    <View style={{ width: "100%", height: "100%"}} > 
      <Host>
        <TouchableWithoutFeedback onPress={handlePostPress} ref = {profileFeedRef}/>
        {isFullscreen && (<TouchableOpacity onPress={() => onClosePress(false)}>
          <AntDesign name='closecircle' size={24} color='black' />
        </TouchableOpacity>
        )}
        {isMyFeed && (
          <TouchableOpacity onLongPress={onDeletePressCb}>
            <AntDesign name='delete' size={24} color='white' />
          </TouchableOpacity>
        )}

          <View style={{ flex: 1, height: 600, minHeight: 600, width: Dimensions.get("screen").width}} >
              <FlashList
                id='preview-feed-flash-list'
                ref={profileFeedRef}
                data={posts}
                numColumns={1}
                estimatedItemSize={200}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 0
                }}
                renderItem={renderItem}
            // pagingEnabled
              numColumns={2}
                scrollEventThrottle={20}
                snapToAlignment='start'
                keyExtractor={item => item.filename}
                decelerationRate={'normal'}

                
                onViewableItemsChanged={onViewableItemsChangedRef.current}
                onMomentumScrollEnd={() => {
                  Haptics.impactAsync(
                    Haptics.ImpactFeedbackStyle.Medium,
                  );
                }}
                onScrollEndDrag={() => {
                  Haptics.impactAsync(
                    Haptics.ImpactFeedbackStyle.Medium,
                  );
                }}
                onScrollToTop={() => onClosePress(false)}
                refreshing={refreshing}

                
                onRefresh={onRefreshFeed}
              />

                <Portal>
            {isFullscreen && <ConnectedPostCommentDrawer />}
          </Portal>
          
          {isMyFeed && (<Portal>
            <DeletePostModal isVisible={deleteModalVisible} onClosePress={onDeleteModalClose} deletePostId={`${posts[index].filename}`} />

          </Portal>)}
        </View>
      
          </Host>
          </View>
    )
}

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

  // const onChangePostWrapper = useCallback((direction: 'prev' | 'next', index: number) => {
  //   if (direction === 'prev') {
  //     if (index === 0) {
  //       onClosePress(false);
  //     } else {
  //       setIndex(index - 1);
  //     }
  //   }
  //   if (direction === 'next') {
  //     if (index === posts.length - 1) {
  //       onClosePress(false);
  //     } else {
  //       setIndex(index + 1);
  //     }
  //   }
  // }, [onClosePress, posts]);

  // const scrollViewRef = React.useRef<ScrollView>(null);



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
  
  // useEffect(() => {
  //   if (scrollViewRef.current) {
  //     scrollViewRef.current.scrollTo({ x: 0, y: window.height * index, animated: false });
  //   }
  // }, [index, scrollViewRef, window.height]);


 

  return (
    <>
     
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

                
          <View style={{ flex: 1, height: "100%" , width:"100%"  }}>
        <PreviewFeedScreen posts={posts} currentIndex={index} onClosePress={onClosePress} />  
        </View>
      
          <DeletePostModal isVisible={deleteModalVisible} onClosePress={onDeleteModalClose} deletePostId={`${posts[index].filename}`} />
 
</>
  );
};


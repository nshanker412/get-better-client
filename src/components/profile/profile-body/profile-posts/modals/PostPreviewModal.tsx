import { AntDesign } from '@expo/vector-icons';
import { Post } from '@models/posts';
import { useScrollToTop } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, RefreshControl, TouchableOpacity, View } from 'react-native';
import { Host } from 'react-native-portalize';
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
/**
 * Component that renders a list of posts meant to be 
 * used for the feed screen.
 * 
 * On start make fetch for posts then use a flatList 
 * to display/control the posts.
 */
export function PreviewFeedScreen({ posts, currentPost, isMyFeed, isFullscreen, onClosePress, onFetchPosts }: { isMyFeed: boolean; posts: Post[]; currentPost: number | undefined; onClosePress: (close: boolean) => void, onFetchPosts: () => Promise<void>, isFullscreen: boolean }) {
  const mediaRefs = useRef([]);
  const { username: myUsername } = useMyUserInfo()
  const profileFeedRef = useRef(null)
  const currentPostFilenameRef = useRef<string>(currentPost ? posts[currentPost]?.filename : '')
  const { onPostChange } = useCommentDrawer()
  const [isFullscreenPreview, setFullscreenPreview] = useState( false);
  const [currentIndex, setCurrentIndex] = useState<number | undefined> ( undefined);
  // const [viewState, setViewState] = useState(isFullscreen ? fullViewStyle : embeddedViewStyle)
  const [refreshing, setRefreshing] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  useScrollToTop(profileFeedRef);


  useEffect(() => {
    if (isFullscreen) {
      setCurrentIndex(currentPost);
      setFullscreenPreview(true);
    }
  }, [isFullscreen, currentPost]);


  const embeddedViewStyle = {
    flex: 1,
    height: 600,
    minHeight: 600,
    width: Dimensions.get("screen").width,
  };

  const fullViewStyle = {
    flex: 1,
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
  }


  const onDeletePressCb = async () => {
    setDeleteModalVisible(true);
  };

  const onDeleteModalClose = (isPostDeleted: boolean) => {
    setDeleteModalVisible(false);
    if (isPostDeleted) {
      setFullscreenPreview(false);
      onClosePress(true);
      onRefreshFeed();
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
            console.log('isViewable', item?.filename, isViewable)
    
            if (mediaRefs?.current[item?.filename]) {
              mediaRefs.current[item?.filename]?.play();
            } 
          }
          else
          {
            if (mediaRefs?.current[item?.filename]) {
              mediaRefs?.current[item?.filename]?.stop();
            }
          }
        });
    }, [onPostChange]);
  
  
  const handlePostPress = (index: number) => {      
    if (!isFullscreenPreview) {
        setCurrentIndex(index);
        setFullscreenPreview(true);
    
    } else {
      // playOrPause(filename);
      setFullscreenPreview(false);
    }
  };
  
    const onViewableItemsChangedRef = useRef(onViewableItemsChanged);
  
    const renderItem: ListRenderItem<Post> = ({ item, index }) => {
        return (
            <View style={{ height: isFullscreenPreview? Dimensions.get("screen").height : 200, width: "100%",  backgroundColor: 'black' }}>
            <PostTile isFullscreenPreview={isFullscreenPreview} handlePostPress={() => handlePostPress(index)}  isEmbeddedFeed={ !isFullscreenPreview} post={item} myUsername={myUsername ?? ''} ref={PostTileRef => (mediaRefs.current[item.filename] = PostTileRef)} />
            </View>
        );
    };
  
  const onRefreshFeed = async () => {
    if (isFullscreenPreview) {
      onClosePress(false);
    } else {
       setRefreshing(true);
       await onFetchPosts();
      setRefreshing(false);
    }
  }



  const onScroll = useCallback((event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const { contentSize, layoutMeasurement } = event.nativeEvent;

    // Update state on first scroll, if necessary
    if (contentHeight !== contentSize.height) {
      setContentHeight(contentSize.height);
    }
    if (scrollViewHeight !== layoutMeasurement.height) {
      setScrollViewHeight(layoutMeasurement.height);
    }

    // Top boundary check
    if (offsetY <= -40) {
      console.log('Reached the top of the list');
      // Trigger any function you want here
      onClosePress(false);
      setFullscreenPreview(false);


    }

    // Bottom boundary check
    if (offsetY + layoutMeasurement.height  >= contentSize.height +80 ) {
      console.log('Reached the bottom of the list');
      onClosePress(false);
      setFullscreenPreview(false);



      // Trigger any function you want here
    }
  }, [contentHeight, scrollViewHeight]);

  // Use onContentSizeChange to get the total height of the FlashList content
  const onContentSizeChange = useCallback((contentWidth, contentHeight) => {
    setContentHeight(contentHeight);
  }, []);

  return (
    <View style={{ width: "100%", height: "100%"}} >
        {isFullscreenPreview ? (
          <Portal>
          <Host>
            <View style={{ position: "absolute" , zIndex: 100, right: 10, top: 80}}>
            <TouchableOpacity onPress={() => setFullscreenPreview(false)}>
            <AntDesign name='closecircle' size={24} color='black' />
          </TouchableOpacity>
            </View>

            {isMyFeed && (
            <TouchableOpacity onLongPress={onDeletePressCb} style={{ position: "absolute" , zIndex: 100, right: 10, top: 140}}>
              <AntDesign name='delete' size={24} color='white' />
                  </TouchableOpacity>
        )}

            <View style={fullViewStyle} >
              <FlashList
                id='preview-feed-flash-list-fullscreen'
                ref={profileFeedRef}
                data={posts}
                estimatedItemSize={Dimensions.get("screen").height}
                initialScrollIndex={currentIndex}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 10
                }}
                onScroll={onScroll}
                onContentSizeChange={onContentSizeChange}
                renderItem={renderItem}
                numColumns={ 1 }
                scrollEventThrottle={20}
                snapToAlignment='start'
                pagingEnabled={true}
                keyExtractor={item => item.filename}
                decelerationRate={'normal'}
          

                onViewableItemsChanged={onViewableItemsChangedRef.current}
                onMomentumScrollEnd={() => {
                  Haptics.impactAsync(
                    Haptics.ImpactFeedbackStyle.Medium,
                  );
                }}
  
                onScrollToTop={() => onClosePress(false)}          
            />         
        
              <Portal>
                {isFullscreenPreview && <ConnectedPostCommentDrawer />}
              </Portal>
            
              {isMyFeed && (<Portal>
                <DeletePostModal isVisible={deleteModalVisible} onClosePress={onDeleteModalClose} deletePostId={`${currentPostFilenameRef.current}`} />

              </Portal>)}
            </View>
            </Host>
            </Portal>

        ) : (
          <Host>


            <View style={embeddedViewStyle} >
              <FlashList
                id='preview-feed-flash-list-embedded'
                ref={profileFeedRef}
                data={posts}
                estimatedItemSize={200}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews
                ListFooterComponent={<View style={{ height: 200, width: "100%" }}></View>}
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 5
                }}
                renderItem={renderItem}
                numColumns={isFullscreenPreview ? 1 : 2}
                scrollEventThrottle={20}
                // snapToAlignment='start'
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

                
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefreshFeed}
                    colors={['white']}
                    tintColor={'white'}
                  />}
              />

              <Portal>
                {isFullscreenPreview && <ConnectedPostCommentDrawer />}
              </Portal>
          
              {isMyFeed && (<Portal>
                <DeletePostModal isVisible={deleteModalVisible} onClosePress={onDeleteModalClose} deletePostId={`${currentPostFilenameRef.current}`} />

              </Portal>)}
            </View>
                      </Host>

        )}
      
          </View>
    )
}

// export interface PostPreviewModalProps {
//   posts: Post[];
//   isVisible: boolean;
//   index: number;
//   isMyProfile: boolean;
//   myUsername: string;
//   onClosePress: (close: boolean) => void;
// }

// export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({
//   posts,
//   isVisible,
//   isMyProfile,
//   index: initialIndex,
//   myUsername,
//   onClosePress,
// }) => {
//   if (posts === null || initialIndex < 0) return null;
//   if (initialIndex >= posts?.length) return null;
//   const window = Dimensions.get('window');

//   const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
//   const { theme } = useThemeContext();
//   const [index, setIndex] = useState<number>(initialIndex);

//   const onDeletePressCb = async () => {
//     setDeleteModalVisible(true);
//   };

//   const onDeleteModalClose = (isPostDeleted: boolean) => {
//     setDeleteModalVisible(false);
//     if (isPostDeleted) {
//       onClosePress(true);
//     }
//   };

//   // const translateY = useSharedValue(0); 

//   // const animatedStyle = useAnimatedStyle(() => {
//   //   return {
//   //     transform: [{ translateY: translateY.value }],
//   //   };
//   // });

//   // useEffect(() => {
//   //   translateY.value = withSpring(0, { damping: 20, stiffness: 100 });
//   // }, [ translateY]);

//   // const onChangePostWrapper = useCallback((direction: 'prev' | 'next', index: number) => {
//   //   if (direction === 'prev') {
//   //     if (index === 0) {
//   //       onClosePress(false);
//   //     } else {
//   //       setIndex(index - 1);
//   //     }
//   //   }
//   //   if (direction === 'next') {
//   //     if (index === posts.length - 1) {
//   //       onClosePress(false);
//   //     } else {
//   //       setIndex(index + 1);
//   //     }
//   //   }
//   // }, [onClosePress, posts]);

//   // const scrollViewRef = React.useRef<ScrollView>(null);



//   const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
// 		// media loading handling
// 		const yOffset = event.nativeEvent.contentOffset.y;
//     const index = Math.round(yOffset / window.height);
//     setIndex(index);
// 		// setCurrentScrollIndex(index);
// 		// currentScrollIndexRef.current = index;

// 		// fetch public handling
// 		const contentHeight = event.nativeEvent.contentSize.height;
// 		const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

// 		// Check if the user has scrolled to the bottom
// 		if (index === posts.length - 1) {
  
//       onClosePress(false);
//     }

//   };
  
//   // useEffect(() => {
//   //   if (scrollViewRef.current) {
//   //     scrollViewRef.current.scrollTo({ x: 0, y: window.height * index, animated: false });
//   //   }
//   // }, [index, scrollViewRef, window.height]);


 

//   return (
//     <>
     
//         <View
//           style={{
//             // position: 'absolute',
//             // width: 50,
//             // height: 50,
//             // right: 0,
//             // top: '10%',
//             // marginRight: -30,
//             // zIndex: 100,
//           }}>
//           <TouchableOpacity onPress={() => onClosePress(false)}>
//             <AntDesign name='closecircle' size={24} color='black' />
//           </TouchableOpacity>
//         </View>
//         {isMyProfile && (
//           <View
//             style={{
//               // position: 'absolute',
//               // width: 50,
//               // height: 50,
//               // right: 0,
//               // top: '20%',
//               // marginRight: -30,
//               // zIndex: 100,
//             }}>
//             <TouchableOpacity onLongPress={onDeletePressCb}>
//               <AntDesign name='delete' size={24} color='white' />
//             </TouchableOpacity>
//           </View>
//         )}

                
//           <View style={{ flex: 1, height: "100%" , width:"100%"  }}>
//         <PreviewFeedScreen posts={posts} currentIndex={index} onClosePress={onClosePress} />  
//         </View>
      
//           <DeletePostModal isVisible={deleteModalVisible} onClosePress={onDeleteModalClose} deletePostId={`${posts[index].filename}`} />
 
// </>
//   );
// };


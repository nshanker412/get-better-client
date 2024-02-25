import { useCommentDrawer } from '@context/comment-drawer/CommentDrawerContext';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { AntDesign } from '@expo/vector-icons';
import { Post } from '@models/posts';
import { useScrollToTop } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, RefreshControl, TouchableOpacity, View, ViewToken } from 'react-native';
import { Host, Portal } from 'react-native-portalize';
import { ConnectedPostCommentDrawer } from '../../../../home/post-comment-drawer/ConnectedPostCommentDrawer';
import { PostTile } from '../post-flashlist/PostTile';
import { DeletePostModal } from './DeletePostModal';

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
  const currentPostFilenameRef = useRef<string>(currentPost !== undefined ? posts[currentPost]?.filename : '')
  const { onPostChange } = useCommentDrawer()
  const [isFullscreenPreview, setFullscreenPreview] = useState( false);
  const [currentIndex, setCurrentIndex] = useState<number | undefined> ( undefined);
  const [refreshing, setRefreshing] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);

  useScrollToTop(profileFeedRef);

  useEffect(() => {
    if (isFullscreen && currentPost !== undefined) {
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
        if (!isFullscreenPreview) {
          mediaRefs.current[item?.filename]?.mute();
        }
          if (isViewable) {
            console.log('isViewable', item?.filename, isViewable)
            currentPostFilenameRef.current = `${item?.metadata?.timestamp}`;
            console.log("CurrentPostFilenameRef, ", currentPostFilenameRef.current )
            
    
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
  
    const onViewableItemsChangedRef = useRef(onViewableItemsChanged);

  
  
  const handlePostPress = (index: number) => {      
    if (!isFullscreenPreview) {
        setCurrentIndex(index);
        setFullscreenPreview(true);
    
    } else {
      // playOrPause(filename);
      setFullscreenPreview(false);
    }
  };
  
  
    const renderItem: ListRenderItem<Post> = ({ item, index }) => {
        return (
          <View
            style={{
              height: isFullscreenPreview ? Dimensions.get("screen").height : 200,
              width: "100%",
              backgroundColor: 'black'
            }}>
            <PostTile
                isFullscreenPreview={isFullscreenPreview}
                handlePostPress={() => handlePostPress(index)}
                isEmbeddedFeed={!isFullscreenPreview}
                post={item} myUsername={myUsername ?? ''}
                ref={PostTileRef => (mediaRefs.current[item.filename] = PostTileRef)} />
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
                <DeletePostModal isVisible={deleteModalVisible} onClosePress={onDeleteModalClose} deletePostId={currentPostFilenameRef.current} />

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


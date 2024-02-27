import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, View } from 'react-native'
import { PostTile } from './PostTile'


import { useCommentDrawer } from '@context/comment-drawer/CommentDrawerContext'
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo'
import { useNotifications } from '@context/notifications/useNotifications'
import { Post } from '@models/posts'
import { useScrollToTop } from '@react-navigation/native'
import { FlashList, ListRenderItem } from '@shopify/flash-list'
import * as Haptics from 'expo-haptics'
import { ViewToken } from 'react-native'
import { RefreshControl } from 'react-native-gesture-handler'
import { Host, Portal } from 'react-native-portalize'
import { Header } from '../../../../header/Header'
import { ConnectedNotificationsBell } from '../../../../home/notifications-drawer/bell/ConnectedNotificationsBell'
import { ConnectedPostCommentDrawer } from '../../../../home/post-comment-drawer/ConnectedPostCommentDrawer'
import { getFeed } from './service/getFeed'

/**
 * Component that renders a list of posts meant to be 
 * used for the feed screen.
 * 
 * On start make fetch for posts then use a flatList 
 * to display/control the posts.
 */
export default function FeedScreen() {
    const [posts, setPosts] = useState<Post[] | []>([])
    const [refreshing, setRefreshing] = useState(false)
    const mediaRefs = useRef([]);
    const { username: myUsername } = useMyUserInfo()
    const feedRef = useRef(null)
    const currentPostFilenameRef = useRef<string>('')
    const {refreshNotifications } = useNotifications()
    const {onPostChange} = useCommentDrawer()


    useScrollToTop(feedRef);

    useEffect(() => {        
        const fetchFeed = async () => {
            await getFeed(myUsername).then(setPosts)
        }
        fetchFeed()
    }, [])


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
                //shits delayed 1 post, autoplay posts and mute posts that are "currently visible"

                mediaRefs?.current[item?.filename]?.stop();
            }
        });
    }, [onPostChange]);

    const onViewableItemsChangedRef = useRef(onViewableItemsChanged);
    const feedItemHeight = Dimensions.get('window').height;


    const renderItem: ListRenderItem<Post> = ({ item }) => {
        return (
            <View style={{ height: feedItemHeight, backgroundColor: 'black' }}>
                <PostTile  post={item} myUsername={myUsername ?? ''} ref={PostTileRef => (mediaRefs.current[item.filename] = PostTileRef)}
                />
            </View>
        );
    };

    const onRefreshCallback = async () => {   
        setRefreshing(true);
        await getFeed(myUsername).then(setPosts)
        refreshNotifications(myUsername)
        setRefreshing(false);
    }

    return (
        <Host>
            <Portal>
                <>
                    <Header />
                    <View style={{position:"absolute", right:15, top:56, alignItems:"flex-end", justifyContent:"center", zIndex: 1}}>
                        <ConnectedNotificationsBell />
                    </View>
                </>
                </Portal>
        
        <View style={{ flex: 1, width: "100%", height:"100%" }}>
            <FlashList
                id='home-feed-flash-list'
                ref={feedRef}
                data={posts}
                estimatedItemSize={feedItemHeight}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                    viewabilityConfig={{
                        waitForInteraction: false,
                        viewAreaCoveragePercentThreshold:90
                  }}
                renderItem={renderItem}
                pagingEnabled
                scrollEventThrottle={100}
                snapToAlignment='start'
                keyExtractor={item => item.filename}
                decelerationRate={'normal'}
                onViewableItemsChanged={onViewableItemsChangedRef.current}
                onMomentumScrollEnd={() => {
                    Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Medium,
                    );
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefreshCallback}
                        colors={['white']}
                        tintColor={'white'}
                    />
                }  
            />

            <Portal>
                
            <ConnectedPostCommentDrawer/>

            </Portal>
            </View>
            </Host>
    )
}
import React, { createRef, useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, View, ViewToken } from 'react-native'
import { PostTile } from './PostTile'

import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo'
import { useNotifications } from '@context/notifications/useNotifications'
import { Post } from '@models/posts'
import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import * as Haptics from 'expo-haptics'
import { RefreshControl } from 'react-native-gesture-handler'
import { Host, Portal } from 'react-native-portalize'
import { Header } from '../../../../header/Header'
import { ConnectedNotificationsBell } from '../../../../home/notifications-drawer/bell/ConnectedNotificationsBell'
import { ConnectedPostCommentDrawer } from '../../../../home/post-comment-drawer/ConnectedPostCommentDrawer'
import { PostTileRef } from './PostTile'
import { getFeed } from './service/getFeed'

/**
 * Component that renders a list of posts meant to be 
 * used for the feed screen.
 * 
 * On start make fetch for posts then use a flatList 
 * to display/control the posts.
 */
export default function FeedScreen() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const { username: myUsername } = useMyUserInfo();
    const { refreshNotifications } = useNotifications();
    const feedRef = useRef<FlashList<Post>>(null);
    const postTileRefs = useRef<{ [key: string]: React.RefObject<PostTileRef> }>({});
    const visibleItemKeys = useRef(new Set<string>());

    const postSize = Dimensions.get('window').height - 100;

    useScrollToTop(feedRef);

    useEffect(() => {
        const fetchFeed = async () => {
            const newPosts = await getFeed(myUsername);
            setPosts(newPosts);

            // Update refs for the new posts
            const updatedRefs = {};
            newPosts.forEach(post => {
                updatedRefs[post.filename] = postTileRefs.current[post.filename] || createRef<PostTileRef>();
            });
            postTileRefs.current = updatedRefs;
        };
        fetchFeed();
    }, [myUsername]);

    useEffect(() => {
        // When posts are fetched or updated...
        const newRefs = posts.reduce((acc, post) => {
            acc[post.filename] = acc[post.filename] || createRef<PostTileRef>();
            return acc;
        }, {} as { [filename: string]: React.RefObject<PostTileRef> });
    
        postTileRefs.current = newRefs;
    }, [posts]);

    const onViewableItemsChanged = ({ viewableItems, changed }: { viewableItems: ViewToken[], changed: ViewToken[] }) => {
        const newViewableSet = new Set(viewableItems.map(({ item }) => item.filename));

        console.log('viewable items:', newViewableSet);
    
        // Pause any previously viewable items that are no longer viewable
        visibleItemKeys.current.forEach((key) => {
            if (!newViewableSet.has(key)) {
                console.log('pausing', key)
                postTileRefs.current[key]?.current?.stop();
            }
        });
    
        // Update the currently viewable items set
        visibleItemKeys.current = newViewableSet;
    
        // Play newly viewable items
        viewableItems.forEach(({ item }) => {
            if (item.metadata.type === 'video') {
                postTileRefs.current[item.filename]?.current?.play();
            }
        });
    };

    const renderItem = useCallback(({ item }) => (
        <View style={{ height: Dimensions.get('window').height, backgroundColor: 'black' }}>
            <PostTile
                isEmbeddedFeed={false}
                post={item}
                myUsername={myUsername ?? ''}
                ref={postTileRefs.current[item.filename]}
            />
        </View>
    ), [myUsername]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        const newPosts = await getFeed(myUsername);
        setPosts(newPosts);
        refreshNotifications(myUsername!);
        setRefreshing(false);
    }, [myUsername, refreshNotifications]);

    return (
        <Host>
            <Portal>
                <Header />
                <View style={{ position: "absolute", right: 15, top: 56, alignItems: "flex-end", justifyContent: "center", zIndex: 1 }}>
                    <ConnectedNotificationsBell />
                </View>
            </Portal>
            <View style={{ flex: 1, width: "100%", height: "100%" }}>
            <FlashList
                id='home-feed-flash-list'
                ref={feedRef}
                data={posts}
                estimatedItemSize={postSize}
                showsVerticalScrollIndicator={false}
                viewabilityConfig={{
                        waitForInteraction: false,
                        viewAreaCoveragePercentThreshold:80
                  }}
                renderItem={renderItem}
                pagingEnabled
                scrollEventThrottle={15}
                snapToAlignment='start'
                keyExtractor={item => item.filename}
                onViewableItemsChanged={onViewableItemsChanged}
                onMomentumScrollEnd={() => {
                    Haptics.impactAsync(
                        Haptics.ImpactFeedbackStyle.Medium,
                    );
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['white']}
                        tintColor={'white'}
                    />
                }

            />
                <Portal>
                    <ConnectedPostCommentDrawer />
                </Portal>
            </View>
        </Host>
    );

}

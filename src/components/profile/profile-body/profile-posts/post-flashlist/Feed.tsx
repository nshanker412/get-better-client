import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, View } from 'react-native'
import { PostTile } from './PostTile'


import { useCommentDrawer } from '@context/comment-drawer/CommentDrawerContext'
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo'
import { Post } from '@models/posts'
import { useScrollToTop } from '@react-navigation/native'
import { FlashList, ListRenderItem } from '@shopify/flash-list'
import * as Haptics from 'expo-haptics'
import { ViewToken } from 'react-native'
import { RefreshControl } from 'react-native-gesture-handler'
import { ConnectedPostCommentDrawer } from '../../../../home/post-comment-drawer/ConnectedPostCommentDrawer'
import { getFeed } from './service/getFeed'

// interface PostTileRef {
//     play: () => void;
//     stop: () => void;
//     unload: () => void;
//   }


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
            }
            const cell = mediaRefs.current[item.filename];
            if (cell ) {
                // if (isViewable) {
                //     cell?.play();
                // } else {
                //     cell?.stop();
                // }
            }
        });
    }, [onPostChange]);

    const onViewableItemsChangedRef = useRef(onViewableItemsChanged);
    const feedItemHeight = Dimensions.get('window').height;


    const renderItem: ListRenderItem<Post> = ({ item }) => {
        return (
            <View style={{ height: feedItemHeight, backgroundColor: 'black' }}>
                <PostTile post={item} myUsername={myUsername ?? ''} ref={PostTileRef => (mediaRefs.current[item.filename] = PostTileRef)}
                />
            </View>
        );
    };

    const onRefreshCallback = async () => {   
        setRefreshing(true);
         await getFeed(myUsername).then(setPosts)
        setRefreshing(false);
    }

    return (
        <View style={{ flex: 1 }}>
            <FlashList
                id='home-feed-flash-list'
                ref={feedRef}
                data={posts}
                estimatedItemSize={feedItemHeight}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 0
                }}
                renderItem={renderItem}
                pagingEnabled
                scrollEventThrottle={50}
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

            <ConnectedPostCommentDrawer/>
            </View>
    )
}
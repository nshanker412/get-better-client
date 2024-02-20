import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, FlatList, ListRenderItem, View } from 'react-native'
import { PostTile } from './PostTile'

import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo'
import { Post } from '@models/posts'
import { ViewToken } from 'react-native'
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
    const [posts, setPosts] = useState<Post[] | []> ([])
    const mediaRefs = useRef([]);
    const {username: myUsername} = useMyUserInfo()

    useEffect(() => {
        console.log('fetching feed')
        // if (false) {
        //     getUserPosts(myUsername).then(setPosts)
        // } else {
        
            getFeed(myUsername).then(setPosts)
        // }
    }, [])

    useEffect(() => {
        console.log('FEED POSTS LENGEH', posts.length   )
    }, [posts])


    /**
     * Called any time a new post is shown when a user scrolls
     * the FlatList, when this happens we should start playing 
     * the post that is viewable and stop all the others
     */
    const onViewableItemsChanged = useCallback(({ changed }: { changed: ViewToken[] }) => {
        changed.forEach(({ item, isViewable }) => {

            const cell = mediaRefs.current[item.filename];
            if (cell) {
                if (isViewable) {
                    cell.play();
                } else {
                    cell.stop();
                }
            }
        });
    }, []);

    const onViewableItemsChangedRef = useRef(onViewableItemsChanged);


    const feedItemHeight = Dimensions.get('window').height;

    // const renderItem: ListRenderItem<Post> = ({ item }) => {
    //     return (
    //         <View style={{ height: feedItemHeight, backgroundColor: 'black' }}>
    //             <PostTile post={item} myUsername={myUsername ?? ''} ref={PostTileRef => (mediaRefs.current[item.filename] = PostTileRef)}
    //             />
    //         </View>
    //     );
    // };


    const renderItem: ListRenderItem<Post> = ({ item }) => {
        return (
            <View style={{ height: feedItemHeight, backgroundColor: 'black' }}>
                <PostTile post={item} myUsername={myUsername ?? ''} ref={PostTileRef => (mediaRefs.current[item.filename] = PostTileRef)}
                />
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={posts}
                windowSize={4}
                initialNumToRender={1}
                maxToRenderPerBatch={2}
                removeClippedSubviews
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 0
                }}
                renderItem={renderItem}
                pagingEnabled
                keyExtractor={item => item.filename}
                decelerationRate={'normal'}
                onViewableItemsChanged={onViewableItemsChangedRef.current}
            />
        </View>
    )
}
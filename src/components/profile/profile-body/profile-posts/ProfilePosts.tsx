import { Post } from '@models/posts';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { ProfilePostsProps } from './ProfilePosts.types';
import { PreviewFeedScreen } from './modals/PostPreviewModal';

//helper to take in a postID and check if it exists in the posts array
// if it does, set the previewPostId to the index of the post
// else return -1 
const findIdxByID = (postId: string, posts: Post[]) => {
    const postIDint = parseInt(postId);
    const index = posts.findIndex((post) => (post.metadata.timestamp as number) === postIDint);
    return index;
}



export const ProfilePosts: React.FC<ProfilePostsProps> = ({
    posts,
    isMyProfile,
    fetchUserPosts,
}) => {
    const route = useRoute();
    const navigation = useNavigation();
    const [previewPostId, setPreviewPostId] = useState<number | undefined>(undefined);
    
    // check if linked from notification
    useEffect(() => {
        if (!posts.length) return;

        const linkedPostID = route?.params?.linkPostID;
        if (linkedPostID) {
            console.log('it exists' , linkedPostID);
            const idx = findIdxByID(linkedPostID, posts);
            console.log('idx', idx);
            if (idx < 0) {
                Toast.show({
                    type: 'info',
                    text1: 'Post not found',
                    text2: 'This post may have been deleted',
                    topOffset: 100,
                });
                navigation.setParams({ linkPostID: undefined });

            } else {
                setPreviewPostId(idx);
            }
            }
        }, [ posts,  route]);


    const onClosePreviewPress = (wasPostDeleted: boolean) => {
         navigation.setParams({ linkPostID: undefined });
        if (wasPostDeleted) {
             fetchUserPosts();
        }
        setPreviewPostId(undefined);
    };

    const onFetchUserPosts = async () => {
        await fetchUserPosts();
    }

    return (
            <PreviewFeedScreen
                posts={posts}
                isFullscreen={!!previewPostId}
                onClosePress={onClosePreviewPress}
                currentPost={previewPostId}
                onFetchPosts={onFetchUserPosts}
                isMyFeed={isMyProfile}
            />

    );
};

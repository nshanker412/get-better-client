import { Post } from '@models/posts';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { ProfilePostsProps } from './ProfilePosts.types';
import { PreviewFeedScreen } from './modals/PostPreviewModal';

//helper to take in a postID and check if it exists in the posts array
// if it does, set the previewPostId to the index of the post
// else return -1 
const findIdxByID = (postID: string, posts: Post[]) => {
    const postIDint = parseInt(postID);
    console.log('postIDint', postIDint)

    console.log('posts', posts)

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
    const [linkPostID, setLinkPostID] = useState<string | undefined>(undefined);

    useEffect(() => {

        setLinkPostID(route?.params?.linkPostID);

        console.log("ROUTE IN PROFILE POSTS", route);
    }, [route]);


    // check if linked from notification
    useEffect(() => {
        if (!posts.length) return;


        console.log('inprofile', linkPostID);

        if (linkPostID !== undefined) {
            console.log('it exists' , linkPostID);
            const idx = findIdxByID(linkPostID, posts);
            console.log('idx', idx);
            if (idx < 0) {
                Toast.show({
                    type: 'info',
                    text1: 'Post not found',
                    text2: 'This post may have been deleted',
                    topOffset: 100,
                });
                // navigation.setParams({ linkPostID: undefined });

            } else {
                setPreviewPostId(idx);
            }
            }
        }, [ posts,  isMyProfile, linkPostID]);


    const onClosePreviewPress = (wasPostDeleted: boolean) => {
        //  navigation.setParams({ linkPostID: undefined });
        if (wasPostDeleted) {
             fetchUserPosts();
        }

        setPreviewPostId(undefined);
    };

    const onFetchUserPosts = async () => {
        await fetchUserPosts();
    }

    useEffect(() => {
        console.log('linkid preview changes', previewPostId);
    }, [previewPostId]);

    return (
            <PreviewFeedScreen
                posts={posts}
                isFullscreen={previewPostId !== undefined}
                onClosePress={onClosePreviewPress}
                currentPost={previewPostId } 
                onFetchPosts={onFetchUserPosts}
                isMyFeed={isMyProfile}
            />

    );
};

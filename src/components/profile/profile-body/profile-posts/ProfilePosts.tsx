import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { Post } from '@models/posts';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { ProfilePostsProps } from './ProfilePosts.types';
import { PreviewFeedScreen } from './modals/PostPreviewModal';



export const ProfilePosts: React.FC<ProfilePostsProps> = ({
    posts,
    currentScrollIndex,
    isMyProfile,
    fetchUserPosts,
}) => {
    const route = useRoute();
    const navigation = useNavigation();
    const { username: myUsername } = useMyUserInfo();

    const [previewModalVisible, setPreviewModalVisible] = useState<boolean>(false);
    const [postPreview, setPostPreview] = useState<Post>();
    const [previewPostId, setPreviewPostId] = useState < string | undefined>(undefined);

    const togglePreview = (postId: string) => {
        setPreviewPostId(postId);

        const selectedPost = posts[index];
        if (selectedPost) {
            console.log('previewPost', selectedPost);
            setPostPreview(selectedPost);
            setPreviewModalVisible(true);
        }
    };

    const onCheckLinkPost = useCallback((linkPostID: number) => {
        const index = posts.findIndex(item => item.metadata.timestamp == linkPostID);

        // find postid infilenames
        const postID = posts[index]?.metadata?.postID;
        // see if any posts match with the linkPostID
        if (index !== -1) {
            togglePreview(postId);
        } else {
            Toast.show({
                type: 'info',
                text1: 'Post not found',
                text2: 'This post may have been deleted',
                topOffset: 100,
            });
            navigation.setParams({ linkPostID: undefined });
            //TODO: update server to unlink notifications from deleted post
        }
    }, [navigation, posts]);

    useEffect(() => {
        const linkedPostID = route?.params?.linkPostID;
        console.log('linkedPostID', linkedPostID);

        if (linkedPostID) {
            onCheckLinkPost(linkedPostID);
        }
    }, [ onCheckLinkPost]);

    const onClosePreviewPress = (wasPostDeleted: boolean) => {
        console.log('onClosePreviewPress', wasPostDeleted);
        navigation.setParams({ linkPostID: undefined });
        if (wasPostDeleted) {
            fetchUserPosts();
        }
        setPostPreview(undefined);
        setPreviewModalVisible(false);
        setPreviewPostId(undefined);
    };

    const onFetchUserPosts = async () => {
        await fetchUserPosts();
    }

    return (
            <PreviewFeedScreen
                posts={posts}
                isFullscreen={previewModalVisible}
                onClosePress={onClosePreviewPress}
                currentPost={previewPostId}
                onFetchPosts={onFetchUserPosts}
            />

    );
};

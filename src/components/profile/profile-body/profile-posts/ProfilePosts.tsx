import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { Post } from '@models/posts';
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { TouchableHighlight } from 'react-native';
import Toast from 'react-native-toast-message';
import { ProfilePost } from '../../ProfilePost';
import { ProfilePostsProps } from './ProfilePosts.types';
import { PostPreviewModal } from './modals/PostPreviewModal';



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
    const [index, setIndex] = useState<number>(0);

    const togglePreview = (index: number) => {
        setIndex(index);

        const selectedPost = posts[index];
        if (selectedPost) {
            console.log('previewPost', selectedPost);
            setPostPreview(selectedPost);
            setPreviewModalVisible(true);
        }
    };

    const onCheckLinkPost = useCallback((linkPostID: number) => {

        const index = posts.findIndex(item => item.metadata.timestamp == linkPostID);
        console.log('index', index);
        if (index !== -1) {
            togglePreview(index);
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
        setIndex(undefined);
    };

    return (
        <>
            {posts.map((post, index) => (
                <TouchableHighlight
                    style={{ display: 'flex', width: '100%', height: 200 }}
                    key={index}
                    onPress={() => togglePreview(index)}
                >
                    <ProfilePost
                        key={index}
                        preview={[]}
                        index={index}
                        loadMedia={
                            index < currentScrollIndex +4
                        }
                        profileUsername={post.metadata.user}
                        postID={post.metadata.timestamp}
                        postData={post.metadata}
                        storePost={true}
                        pauseVideo={index !== currentScrollIndex}
                        setPreview={() => togglePreview(index)}
                        muted={true}
                        isMyProfile={isMyProfile}
                        fetchUserPosts={fetchUserPosts}
                    />
                </TouchableHighlight>
            ))}
            <PostPreviewModal
                posts={posts}
                isVisible={previewModalVisible}
                onClosePress={onClosePreviewPress}
                index={index || 0} // Provide a default value for index
                isMyProfile={isMyProfile}
                myUsername={myUsername!}
            />

        </>
    );
};

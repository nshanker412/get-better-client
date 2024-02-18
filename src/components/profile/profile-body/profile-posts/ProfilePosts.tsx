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

	// if came from a link, find that post and open it, otherwise

	const { username: myUsername } = useMyUserInfo();

	const [previewModalVisible, setPreviewModalVisible] =
		useState<boolean>(false); // Set initial state to false
	const [postPreview, setPostPreview] = useState<Post>();
	const [index, setIndex] = useState<number | undefined>(0);

	const togglePreview = (index: number) => {
		console.log('togglePreview', index);	
		setIndex(index);

		posts.find((item, i) => {
			if (i === index) {
				console.log('previewPost', item);
				setPostPreview(item);
			}
		});

		setPreviewModalVisible(true);
	};

	/**
	 * Set the initial post to open if it came from a link
	 */

	const onCheckLinkPost = useCallback((linkPostID: number) => {

		console.log('onCheckLinkPost', linkPostID);

		posts.find((item, i) => {
			if (item.metadata.timestamp === linkPostID) {
				togglePreview(i);
				return 
			}
		}
		);

		
				Toast.show({
					type: 'info',
					text1: 'Post not found',
					text2: 'This post may have been deleted',
					topOffset: 100,
				});
				navigation.setParams({ linkPostID: undefined })
				//TODO: update server to unlink notifications from deleted post

			
	}, [route, posts]);


	useEffect(() => {
		const linkedPostID = route?.params?.linkPostID;
		console.log('linkedPostID', linkedPostID);

		if (linkedPostID) {
			onCheckLinkPost(linkedPostID);
				
		}
	}, [ onCheckLinkPost]);

	const onClosePreviewPress = (wasPostDeleted: boolean) => {
		console.log('onClosePreviewPress', wasPostDeleted);
		navigation.setParams({ linkPostID: undefined })
		if (wasPostDeleted) {
			fetchUserPosts();
		}
		setPostPreview(undefined);
		setPreviewModalVisible(false);
		setIndex(undefined);


	};

	const onChangePost = (direction: 'prev' | 'next') => {
		if ('prev' == direction && index === 0) {
			console.log('want previous but index is 0');
			onClosePreviewPress(false);
		}
		if ('next' == direction && index === posts.length - 1) {
			console.log('want next but already at last');

			onClosePreviewPress(false);
		}
		const currentIndex = posts.findIndex(
			(post) => post.filename == postPreview?.filename,
		);
		const newIndex =
			direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
		setIndex(newIndex);
		setPostPreview(posts[newIndex]);
	};
	return (
		<>
			{posts.map((post, index) => {
				return (
					<TouchableHighlight
						style={{ display: 'flex', width: '100%', height: 200 }}
						key={index}
						onPress={() => togglePreview(index)}>
						<ProfilePost
							key={index}
							preview={[]}
							index={index}
							loadMedia={
								index === currentScrollIndex ||
								index === currentScrollIndex + 1 ||
								index === currentScrollIndex + 2
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
				);
			})}

			<PostPreviewModal
				isVisible={previewModalVisible}
				onClosePress={onClosePreviewPress}
				onChangePost={onChangePost}
				post={postPreview}
				index={index}
				isMyProfile={isMyProfile}
				myUsername={myUsername!}
			/>
		</>
	);
};


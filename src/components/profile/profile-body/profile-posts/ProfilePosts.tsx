import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { TouchableHighlight } from 'react-native';
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

	// if came from a link, find that post and open it, otherwise

	const { username: myUsername } = useMyUserInfo();

	const [previewModalVisible, setPreviewModalVisible] =
		useState<boolean>(false); // Set initial state to false
	const [postPreview, setPostPreview] = useState<any>();
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
	useEffect(() => {
		const linkedPostID = route?.params?.linkPostID;

		if (linkedPostID) {
			console.log('came from a linked post', linkedPostID);
			const foundPost = posts.find(
				(item) => item['metadata'].timestamp === linkedPostID,
			);
			if (foundPost) {
				console.log('foundPost', foundPost);
				togglePreview(posts.indexOf(foundPost));
			}
		}
	}, [route]);

	const onClosePreviewPress = (wasPostDeleted: boolean) => {
		if (wasPostDeleted) {
			fetchUserPosts();
		}
		setPostPreview(undefined);
		setPreviewModalVisible(false);
		setIndex(undefined);
	};

	const onChangePost = (direction: 'prev' | 'next') => {
		if ('prev' === direction && index === 0) {
			console.log('want previous but index is 0');
			onClosePreviewPress(false);
		}
		if ('next' === direction && index === posts.length - 1) {
			console.log('want next but already at last');

			onClosePreviewPress(false);
		}
		const currentIndex = posts.findIndex(
			(item) => item['filename'] === postPreview['filename'],
		);
		const newIndex =
			direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
		setIndex(newIndex);
		setPostPreview(posts[newIndex]);
	};
	return (
		<>
			{posts.map((item, index) => {
				const splitIndex = item['filename'].lastIndexOf('_');
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
							profileUsername={item['filename'].substring(
								0,
								splitIndex,
							)}
							postID={item['filename'].substring(splitIndex + 1)}
							postData={item['metadata']}
							storePost={true}
							pauseVideo={index !== currentScrollIndex}
							setPreview={() => togglePreview(index)}
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

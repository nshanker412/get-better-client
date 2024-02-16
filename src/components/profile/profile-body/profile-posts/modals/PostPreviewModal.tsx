import { useThemeContext } from '@context/theme/useThemeContext';
import { AntDesign } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
	Directions,
	Gesture,
	GestureDetector,
	GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { Host } from 'react-native-portalize';
import { FeedPost } from '../../../../home/FeedPost';
import { Modal } from '../../../../primitives/action-modal/ActionModal';
import { DeletePostModal } from './DeletePostModal';

export interface PostPreviewModalProps {
	isVisible: boolean;
	index: number;
	post: any;
	isMyProfile: boolean;
	myUsername: string;
	onChangePost: (direction: 'prev' | 'next') => void;
	onClosePress: (close: boolean) => void;
}

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({
	isVisible,
	post,
	myUsername,
	isMyProfile,
	index,
	onClosePress,
	onChangePost,
}) => {
	if (!post) return null;

	const [deleteModalVisible, setDeleteModalVisible] =
		useState<boolean>(false);
	const { theme } = useThemeContext();

	const postId = post?.metadata?.timestamp;
	const profileUsername = post?.metadata?.user;
	const postData = post?.metadata;

	const onDeletePressCb = async () => {
		console.log('onDeletePressCb', postId);
		console.log('setting deleteModalVisible to true');
		setDeleteModalVisible(true);
	};

	const onDeleteModalClose = (isPostDeleted: boolean) => {
		setDeleteModalVisible(false);
		if (isPostDeleted) {
			onClosePress(true);
		}
	};

	const flingUp = Gesture.Fling();
	flingUp.direction(Directions.UP);
	flingUp.onStart(() => {
		console.log('flingUp', 'next');
		onChangePost('next');
	});
	flingUp.onEnd(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
	});

	const flingDown = Gesture.Fling();
	flingDown.direction(Directions.DOWN);
	flingDown.onStart(() => {
		console.log('flingdown', 'next');

		onChangePost('prev');
	});
	flingDown.onEnd(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
	});

	const flingClose = Gesture.Fling();
	flingDown.direction(Directions.RIGHT | Directions.LEFT);
	flingClose.onEnd(() => {
		onClosePress(false);
	});
	const allFlings = Gesture.Exclusive(flingUp, flingDown, flingClose);

	return (
		<GestureHandlerRootView>
			<Modal
				isVisible={isVisible}
				hasBackdrop
				animateOut='fadeOut'
				onBackdropPress={onClosePress}>
				<View
					style={{
						position: 'absolute',
						width: 50,
						height: 50,
						right: 0,
						top: '10%',
						marginRight: -30,
						zIndex: 100,
					}}>
					<TouchableOpacity onPress={onClosePress}>
						<AntDesign
							name='closecircle'
							size={24}
							color='black'
						/>
					</TouchableOpacity>
				</View>
				{isMyProfile && (
					<View
						style={{
							position: 'absolute',
							width: 50,
							height: 50,
							right: 0,
							top: '20%',
							marginRight: -30,
							zIndex: 100,
						}}>
						<TouchableOpacity onLongPress={onDeletePressCb}>
							<AntDesign
								name='delete'
								size={24}
								color='white'
							/>
						</TouchableOpacity>
					</View>
				)}
				<Modal.Container
					containerStyle={{
						backgroundColor: theme.innerContainer.backgroundColor,
					}}>
					<Host>
						<GestureDetector gesture={allFlings}>
							<FeedPost
								key={index}
								index={index}
								loadMedia={true}
								profileUsername={profileUsername}
								postID={postId}
								postData={postData}
								myUsername={myUsername}
								storePost={true}
								pauseVideo={false}
							/>
						</GestureDetector>
					</Host>
				</Modal.Container>
				<DeletePostModal
					isVisible={deleteModalVisible}
					onClosePress={onDeleteModalClose}
					deletePostId={postId}
				/>
			</Modal>
		</GestureHandlerRootView>
	);
};

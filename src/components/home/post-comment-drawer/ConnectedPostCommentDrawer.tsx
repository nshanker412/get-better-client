import { useCommentDrawer } from '@context/comment-drawer/CommentDrawerContext';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, {
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import Toast from 'react-native-toast-message';
import { PostCommentDrawer } from './PostCommentDrawer';
import { usePostCommentDrawerStyles } from './PostCommentDrawer.styles';

export const ConnectedPostCommentDrawer: React.FC = () => {
	const [currentComment, setCurrentComment] = useState<string>('');
	const [writingComment, setWritingComment] = useState<boolean>(false);
	const modalizeRef = useRef<Modalize>(null);
		const {
			loading,
			isOpen,
			comments,
			addComment,
			closeDrawer,
	} = useCommentDrawer();

		// const {sendOutPushNotification} = useNotifications();
		const { username: myUsername } = useMyUserInfo();
	const postCommentDrawerStyles = usePostCommentDrawerStyles();
	
	const [submittingComment, setSubmittingComment] = useState(false);

	
	useEffect(() => {
		if(isOpen){
			modalizeRef.current?.open();
		} else {
			modalizeRef.current?.close();
		
		}
	}, [isOpen]);


	useEffect(() => {
		return () => {
			modalizeRef.current?.close();
		}
	}, []);



		// useImperativeHandle(
		// 	ref,
		// 	() => ({
		// 		openModal: () => {
		// 			modalizeRef.current?.open();
		// 		},
		// 		closeModal: () => {
		// 			modalizeRef.current?.close();
		// 		},
		// 	}),
		// 	[],
	// );
	

	
	
		const onFocusTextInput = useCallback(
			(isFocused) => {
				if (isFocused) {
					setWritingComment(true);
				} else {
					if (!loading && currentComment === '') {
						setWritingComment(false);
					}
				}
			},
			[loading, currentComment],
		);



		/**
		 *  Notifications are sent out after the comment is added to the post
		 *  as non blocking operation
		 */

		// const onAddComment = async () => {
		// 	// 1. Submit the comment
		// 	try {
		// 		await addComment(currentComment);
		// 	} catch (error) {
		// 		console.error('Comment post failed:', error);
		// 		throw new Error(error);
		// 	} finally {
		// 		setWritingComment(false);
		// 		setCurrentComment('');
		// 	}

		// 	// 2. nonblocking Send out push notifications
		// 	try {
		// 		const pushNotifInfo: PushNotificationInfoPacket = {
		// 			title: `${myUsername} liked your post.`,
		// 			body: `check it out!`,
		// 			data: { path: 'profile', params: { profileUsername: profileUsername, postId: postID } },
		// 		};
				
		// 		sendOutPushNotification(profileUsername, pushNotifInfo);
		// 	} catch (error) {
		// 		console.error('Notification send failed:', error);
		// 	}

		// }

		const onSubmitComment = useCallback(async () => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

			console.log('submitting comment: ', currentComment);
			if (currentComment !== '') {
				setSubmittingComment(true);
				try {
					await addComment(currentComment);
					setCurrentComment('');
				} catch (error) {
					console.error('Comment post failed:', error);
					Toast.show({
						type: 'error',
						position: 'bottom',
						text1: 'Failed to post comment',
						visibilityTime: 3000,
					
					})
				} finally {
					setSubmittingComment(false);
				}
			}
		}, [currentComment, addComment]);



		return (
			<Modalize
				ref={modalizeRef}
				snapPoint={600}
				panGestureEnabled={true}
				modalStyle={postCommentDrawerStyles.modalContent}
				onClose={closeDrawer}
				HeaderComponent={
					<View style={postCommentDrawerStyles.headerContainer}>
						<View
							style={
								postCommentDrawerStyles.headerInnerContainer
							}>
							<Text style={postCommentDrawerStyles.headerText}>
								Comments
							</Text>
						</View>
					</View>
				}
				openAnimationConfig={{
					timing: { duration: 400 },
					spring: { speed: 9, bounciness: 2 },
				}}
				closeOnOverlayTap={true}>
				<BlurView
					tint='dark'
					intensity={10}
					style={{ ...StyleSheet.absoluteFillObject }}
				/>

				<View style={postCommentDrawerStyles.commentInputContainer}>
					<View
						style={
							postCommentDrawerStyles.commentInputInnerContainer
						}>
						<View
							style={
								writingComment
									? postCommentDrawerStyles.inputContainerGrow
									: postCommentDrawerStyles.inputContainer
							}>
							<TextInput
								style={postCommentDrawerStyles.input}
								placeholder='Write a comment...'
								placeholderTextColor={
									postCommentDrawerStyles.placeholderText
										.color
								}
								multiline={true}
								value={currentComment}
								onChangeText={setCurrentComment}
								onFocus={() => onFocusTextInput(true)}
								onBlur={() => onFocusTextInput(false)}
								keyboardAppearance='dark'
							/>
							<TouchableOpacity
								style={
									postCommentDrawerStyles.submitCommentButton
								}
								onPress={onSubmitComment}
								disabled={submittingComment}>
								<View
									style={
										postCommentDrawerStyles.submitCommentButtonInnerContainer
									}>
									<Ionicons
										name='send'
										size={20}
										color={
											loading
												? 'grey'
												: 'white'
										}
									/>
								</View>
							</TouchableOpacity>
						</View>
					</View>
					<>
						<PostCommentDrawer
							comments={comments}
							commentsLoading={loading}
						/>
					</>
				</View>
			</Modalize>
		);
	};

ConnectedPostCommentDrawer.displayName = 'ConnectedPostCommentDrawer';

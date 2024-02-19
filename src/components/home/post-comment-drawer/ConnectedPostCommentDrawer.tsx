import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { PushNotificationInfoPacket } from '@context/notifications/Notifications.types';
import { useNotifications } from '@context/notifications/useNotifications';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { Modalize } from 'react-native-modalize';
import { PostCommentDrawer } from './PostCommentDrawer';
import { usePostCommentDrawerStyles } from './PostCommentDrawer.styles';
import {
	CommentDrawerRef,
	ConnectedPostCommentDrawerProps,
} from './PostCommentDrawer.types';
import { useComments } from './hooks/useComments';

export const ConnectedPostCommentDrawer: React.ForwardRefExoticComponent<
	ConnectedPostCommentDrawerProps & React.RefAttributes<CommentDrawerRef>
> = forwardRef<CommentDrawerRef, ConnectedPostCommentDrawerProps>(
	({ postID, profileUsername }, ref) => {
		const [currentComment, setCurrentComment] = useState<string>('');
		const [writingComment, setWritingComment] = useState<boolean>(false);
		
		const { loadingAddComment, loadingFetchComments, comments, addComment } = useComments(postID, profileUsername);
		const {sendOutPushNotification} = useNotifications();
		const { username: myUsername } = useMyUserInfo();
		const postCommentDrawerStyles = usePostCommentDrawerStyles();
		const modalizeRef = useRef(null);


		useImperativeHandle(
			ref,
			() => ({
				openModal: () => {
					modalizeRef.current?.open();
				},
				closeModal: () => {
					modalizeRef.current?.close();
				},
			}),
			[],
		);

		const onFocusTextInput = useCallback(
			(isFocused) => {
				if (isFocused) {
					setWritingComment(true);
				} else {
					if (!loadingAddComment && currentComment === '') {
						setWritingComment(false);
					}
				}
			},
			[loadingAddComment, currentComment],
		);



		/**
		 *  Notifications are sent out after the comment is added to the post
		 *  as non blocking operation
		 */

		const onAddComment = async () => {
			// 1. Submit the comment
			try {
				await addComment(currentComment);
			} catch (error) {
				console.error('Comment post failed:', error);
				throw new Error(error);
			} finally {
				setWritingComment(false);
				setCurrentComment('');
			}

			// 2. nonblocking Send out push notifications
			try {
				const pushNotifInfo: PushNotificationInfoPacket = {
					title: `${myUsername} liked your post.`,
					body: `check it out!`,
					data: { path: 'profile', params: { profileUsername: profileUsername, postId: postID } },
				};
				
				sendOutPushNotification(profileUsername, pushNotifInfo);
			} catch (error) {
				console.error('Notification send failed:', error);
			}
		}

		const onSubmitComment = useCallback(async () => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

			console.log('submitting comment: ', currentComment);
			if (currentComment !== '') {
				await onAddComment();
			}
		}, [currentComment, onAddComment]);



		return (
			<Modalize
				ref={modalizeRef}
				snapPoint={600}
				panGestureEnabled={true}
				modalStyle={postCommentDrawerStyles.modalContent}
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
								disabled={loadingAddComment}>
								<View
									style={
										postCommentDrawerStyles.submitCommentButtonInnerContainer
									}>
									<Ionicons
										name='send'
										size={20}
										color={
											loadingAddComment
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
							commentsLoading={loadingFetchComments}
						/>
					</>
				</View>
			</Modalize>
		);
	},
);

ConnectedPostCommentDrawer.displayName = 'ConnectedPostCommentDrawer';

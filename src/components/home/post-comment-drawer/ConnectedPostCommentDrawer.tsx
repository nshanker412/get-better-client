import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
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
import Toast from 'react-native-toast-message';
import { PostCommentDrawer } from './PostCommentDrawer';
import { usePostCommentDrawerStyles } from './PostCommentDrawer.styles';
import {
	CommentDrawerRef,
	ConnectedPostCommentDrawerProps,
} from './PostCommentDrawer.types';

export const ConnectedPostCommentDrawer: React.ForwardRefExoticComponent<
	ConnectedPostCommentDrawerProps & React.RefAttributes<CommentDrawerRef>
> = forwardRef<CommentDrawerRef, ConnectedPostCommentDrawerProps>(
	({ postID, comments, profileUsername }, ref) => {
		const [currentComment, setCurrentComment] = useState<string>('');
		const [commentsLoading, setCommentsLoading] = useState<boolean>(false);

		const { username: myUsername } = useMyUserInfo();
		const postCommentDrawerStyles = usePostCommentDrawerStyles();
		const modalizeRef = useRef(null);
		const [writingComment, setWritingComment] = useState<boolean>(false);
		const [isSubmittingComment, setSubmittingComment] =
			useState<boolean>(false);

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
					if (!isSubmittingComment && currentComment === '') {
						setWritingComment(false);
					}
				}
			},
			[isSubmittingComment, currentComment],
		);

		const submitComment = async () => {
			try {
				setSubmittingComment(true);

				const commentResponse = await axios.post(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/comment`,
					{
						profileUsername,
						postID,
						myUsername,
						content: currentComment,
					},
				);
				/**
				 * if no error, then throw success toast
				 */
				Toast.show({
					text1: 'Comment posted successfully!',
					type: 'success',
				});

				return commentResponse;
			} catch (error) {
				Toast.show({
					text1: 'Failed to post comment. Please try again.',
					text2: 'Please try again.',
					type: 'error',
				});
				throw new Error('Failed to post comment. Please try again.'); // Throw an error for the user
			}
		};

		const fetchAndSendNotifications = async (commentResponse) => {
			try {
				const notificationResponse = await axios.get(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notificationTokens/fetch/${profileUsername}`,
				);
				console.log(
					'fetchUserNotificationTokens',
					notificationResponse.data,
				);

				const notifications = notificationResponse.data['tokens'].map(
					(token) => ({
						to: token,
						sound: 'default',
						title: `${myUsername} commented on your post.`,
						body: currentComment,
						data: {
							path: `/profile/post/${profileUsername}/${postID}`,
						},
					}),
				);

				const pushSendResponse = await axios.post(
					'https://exp.host/--/api/v2/push/send',
					notifications,
					{
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json',
						},
					},
				);

				console.log(
					'Notifications sent successfully',
					pushSendResponse.data,
				);
			} catch (error) {
				console.error(
					'Error during notification fetching/sending:',
					error,
				);
				// Log the error, but don't throw an error to the user
			}
		};

		/**
		 * TODO - Bifurcate the comment submission and notification sending logic
		 *    into separate functions. This will allow us to only notify the
		 *    user if the comment submission was unsuccessful.
		 */

		const onAddComment = useCallback(async () => {
			setCommentsLoading(true);

			try {
				const commentResponse = await submitComment();
				await fetchAndSendNotifications(commentResponse);

				setCurrentComment('');
			} catch (error) {
				console.error('Comment post failed:', error);
			} finally {
				setCommentsLoading(false);
				setWritingComment(false);
				setSubmittingComment(false);
			}
		}, [currentComment, myUsername, postID, profileUsername]);

		const onSubmitComment = useCallback(() => {
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

			setCommentsLoading(true);
			console.log('submitting comment: ', currentComment);
			if (currentComment !== '') {
				onAddComment();
			}
		}, [currentComment, onAddComment]);

		// useEffect(() => {
		// 	if (comments) {
		// 		comments.forEach((comment) => {
		// 			fetchCommentProfileImage(comment.username);
		// 		});
		// 	}
		// }, [comments]);

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
								disabled={isSubmittingComment}>
								<View
									style={
										postCommentDrawerStyles.submitCommentButtonInnerContainer
									}>
									<Ionicons
										name='send'
										size={20}
										color={
											isSubmittingComment
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
							commentsLoading={commentsLoading}
						/>
					</>
				</View>
			</Modalize>
		);
	},
);

ConnectedPostCommentDrawer.displayName = 'ConnectedPostCommentDrawer';

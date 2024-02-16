import { BLUR_HASH } from '@constants/constants';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { Link, useIsFocused } from '@react-navigation/native';
import axios from 'axios';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Keyboard, StyleSheet, Text, View } from 'react-native';
import {
	ScrollView,
	State,
	TapGestureHandler,
	TextInput,
	TouchableOpacity,
} from 'react-native-gesture-handler';
import { sanitize } from '../../utils/sanitize';
import { LoadingSpinner } from '../loading-spinner/LoadingSpinner';

export const  ProfilePost: React.FC = (props) => {
	const {
		index,
		loadMedia,
		profileUsername,
		postID,
		postData,
		storePost,
		setPreview,
		pauseVideo,
	} = props;
	
	const [liked, setLiked] = useState(false);
	const [likes, setLikes] = useState(null);
	const [commentsOpen, setCommentsOpen] = useState(false);
	const [comments, setComments] = useState([]);
	const [currentComment, setCurrentComment] = useState('');
	const [commentsLoading, setCommentsLoading] = useState(false);
	const [media, setMedia] = useState(null);
	const [loadingMedia, setLoadingMedia] = useState(false);
	const [profileImage, setProfileImage] = useState(null);
	const [commentProfileImages, setCommentProfileImages] = useState({});
	const [isPlaying, setIsPlaying] = useState(true);
	const [preview] = useState(true);
	const { isFocused } = useIsFocused();

	const { username: myUsername } = useMyUserInfo();

	const doubleTapRef = useRef();

	function timeAgo(epoch) {
		const now = new Date();
		const postTime = new Date(epoch * 1000);
		const diffInSeconds = Math.floor((now - postTime) / 1000);

		const minute = 60;
		const hour = minute * 60;
		const day = hour * 24;

		if (diffInSeconds < minute) {
			return `${diffInSeconds} seconds ago`;
		} else if (diffInSeconds < hour) {
			return `${Math.floor(diffInSeconds / minute)} minute${
				Math.floor(diffInSeconds / minute) > 1 ? 's' : ''
			} ago`;
		} else if (diffInSeconds < day) {
			return `${Math.floor(diffInSeconds / hour)} hour${
				Math.floor(diffInSeconds / hour) > 1 ? 's' : ''
			} ago`;
		} else {
			return `${Math.floor(diffInSeconds / day)} day${
				Math.floor(diffInSeconds / day) > 1 ? 's' : ''
			} ago`;
		}
	}

	function updatePostLiked(status) {
		axios
			.post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/like`, {
				profileUsername: profileUsername,
				postID: postID,
				myUsername: myUsername,
				status: status,
			})
			.then((response) => {
				console.log('updatePostLiked', response.data);
				setLikes(response.data.likes);
				// fetch user's notification tokens
				if (status) {
					axios
						.get(
							`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notificationTokens/fetch/${profileUsername}`,
						)
						.then((response) => {
							console.log(
								'fetchUserNotificationTokens',
								response.data,
							);

							// create notification objects
							const notifications = response.data['tokens'].map(
								(token) => ({
									to: token,
									sound: 'default',
									title: `${myUsername} liked your post.`,
									body: `check it out!`,
									data: {
										path: {
											screen: 'profilePost',
											params: {
												profileUsername:
													profileUsername,
												postID: postID,
											},
										},
									},
								}),
							);

							// send notifications
							axios
								.post(
									'https://exp.host/--/api/v2/push/send',
									notifications,
									{
										headers: {
											Accept: 'application/json',
											'Content-Type': 'application/json',
										},
									},
								)
								.then((response) => {
									console.log(response.data);
								})
								.catch((error) => {
									console.error(error);
								});
						})
						.catch((error) => {
							console.log(
								'fetchUserNotificationTokensError',
								error,
							);
						});
				}
			})
			.catch((error) => {
				console.log('updatePostLikeErrord', error);
			});
	}

	const onDoubleTapEvent = (event) => {
		if (event.nativeEvent.state === State.ACTIVE) {
			// Double tap was detected
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

			// image wasn't already liked
			if (!liked) {
				updatePostLiked(true);
				setLiked((prevLiked) => {
					return !prevLiked;
				});
			}
		}
	};

	const onSingleTapEvent = (event) => {
		if (setPreview) {
			setPreview(index);
		}
		if (event.nativeEvent.state === State.ACTIVE) {
			// Toggle play/pause
			setIsPlaying(!isPlaying);
		}
	};

	function addComment() {
		setCommentsLoading(true);
		axios
			.post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/comment`, {
				profileUsername: profileUsername,
				postID: postID,
				myUsername: myUsername,
				content: currentComment,
			})
			.then((response) => {
				console.log('addComment', response.data);
				setComments(response.data.comments);
				axios
					.get(
						`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notificationTokens/fetch/${profileUsername}`,
					)
					.then((response) => {
						console.log(
							'fetchUserNotificationTokens',
							response.data,
						);

						// create notification objects
						const notifications = response.data['tokens'].map(
							(token) => ({
								to: token,
								sound: 'default',
								title: `${myUsername} commented on your post.`,
								body: currentComment,
								data: {
									path: {
										screen: 'profilePost',
										params: {
											profileUsername: profileUsername,
											postID: postID,
										},
									},
								},
							}),
						);

						// send notifications
						axios
							.post(
								'https://exp.host/--/api/v2/push/send',
								notifications,
								{
									headers: {
										Accept: 'application/json',
										'Content-Type': 'application/json',
									},
								},
							)
							.then((response) => {
								setCurrentComment('');
								setCommentsLoading(false);
							})
							.catch((error) => {
								console.error(error);
							});
					})
					.catch((error) => {
						console.log('fetchUserNotificationTokensError', error);
					});
			})
			.catch((error) => {
				console.log('addCommentError', error);
			});
	}

	useEffect(() => {
		if (postID) {
			setLiked(false);
			setLikes(null);
			setComments([]);
			fetchPostLikes();
			fetchPostComments();
		}
	}, [postID]);

	function fetchPostLikes() {
		axios
			.post(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/likes`,
				{
					profileUsername: profileUsername,
					postID: postID,
					myUsername: myUsername,
				},
			)
			.then((response) => {
				setLikes(response.data.likes);
				setLiked(response.data.liked);
			})
			.catch((error) => {
				console.log('fetchPostLikesError', error);
			});
	}

	function fetchPostComments() {
		setCommentsLoading(true);
		axios
			.post(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/comments`,
				{
					profileUsername: profileUsername,
					postID: postID,
				},
			)
			.then((response) => {
				setComments(response.data.comments);
				setCommentsLoading(false);
			})
			.catch((error) => {
				console.log('fetchPostCommentsError', error);
			});
	}

	useEffect(() => {
		// only load if props loaded, scroll is on or above post, and the image hasn't already been loaded
		if (postID && loadMedia && !media) {
			fetchPostMedia();
		}
	}, [postID, loadMedia]);

	function fetchPostMedia() {
		setLoadingMedia(true);

		// If video
		if (postData.type && postData.type === 'video') {
			url = `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/video/${profileUsername}_${postID}`;
			setMedia(url);
			setLoadingMedia(false);
		} else {
			let url = '';
			const filePath = `${profileUsername}_${postID}.jpeg`;
			const fileUri = FileSystem.documentDirectory + filePath;

			// Check if the media file exists
			FileSystem.getInfoAsync(fileUri)
				.then(({ exists }) => {
					if (exists) {
						// Read the file and set the media
						FileSystem.readAsStringAsync(fileUri, {
							encoding: FileSystem.EncodingType.Base64,
						})
							.then((base64String) => {
								setMedia(base64String);
								setLoadingMedia(false);
							})
							.catch((readFileError) => {
								console.log(
									'readFileError',
									readFileError.message,
								);
								setLoadingMedia(false);
							});
					} else {
						url = `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/media/${profileUsername}/${postID}`;
						axios
							.get(url)
							.then(async (response) => {
								setMedia(response.data.media);
								setLoadingMedia(false);

								// write to file system
								await FileSystem.writeAsStringAsync(
									fileUri,
									response.data.media,
									{
										encoding:
											FileSystem.EncodingType.Base64,
									},
								);
							})
							.catch((error) => {
								console.log('fetchPostMediaError', error);
								setLoadingMedia(false);
							});
					}
				})
				.catch((existsError) => {
					console.log('existsError', existsError.message);
					setLoadingMedia(false);
				});
		}
	}

	useEffect(() => {
		if (media && postData.type && postData.type === 'video') {
			console.log('media', media);
		}
	}, [media]);

	useEffect(() => {
		if (postID && !profileImage) {
			fetchPostProfileImage();
		}
	}, [postID]);

	// maybe change this to new endpoint?
	function fetchPostProfileImage() {
		const filePath = `${profileUsername}_profile.jpeg`;
		const fileUri = FileSystem.documentDirectory + filePath;

		FileSystem.getInfoAsync(fileUri).then(({ exists }) => {
			if (exists) {
				// Read the file and set the media
				FileSystem.readAsStringAsync(fileUri, {
					encoding: FileSystem.EncodingType.Base64,
				})
					.then((base64String) => {
						setProfileImage(base64String);
					})
					.catch((readFileError) => {
						console.log('readFileError', readFileError.message);
					});
			} else {
				axios
					.get(
						`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/${profileUsername}/profile/300/300`,
					)
					.then(async (response) => {
						setProfileImage(response.data.image);

						// write to file system
						await FileSystem.writeAsStringAsync(
							fileUri,
							response.data.image,
							{
								encoding: FileSystem.EncodingType.Base64,
							},
						);
					})
					.catch((error) => {
						console.log('fetchPostMediaError', error);
					});
			}
		});
	}

	// fetch profile picture of a comment
	function fetchCommentProfileImage(username) {
		const filePath = `${username}_profile.jpeg`;
		const fileUri = FileSystem.documentDirectory + filePath;

		FileSystem.getInfoAsync(fileUri).then(({ exists }) => {
			if (exists) {
				// Read the file and set the media
				FileSystem.readAsStringAsync(fileUri, {
					encoding: FileSystem.EncodingType.Base64,
				})
					.then((base64String) => {
						setCommentProfileImages((prevImages) => ({
							...prevImages,
							[username]: base64String,
						}));
					})
					.catch((readFileError) => {
						console.log('readFileError', readFileError.message);
					});
			} else {
				axios
					.get(
						`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/${profileUsername}/profile/100/100`,
					)
					.then(async (response) => {
						// write to file system
						await FileSystem.writeAsStringAsync(
							fileUri,
							response.data.image,
							{
								encoding: FileSystem.EncodingType.Base64,
							},
						);
						setCommentProfileImages((prevImages) => ({
							...prevImages,
							[username]: response.data.image,
						}));
					})
					.catch((error) => {
						console.log('fetchPostMediaError', error);
					});
			}
		});
	}

	useEffect(() => {
		if (commentsOpen && comments) {
			comments.forEach((comment) => {
				console.log(comment);
				fetchCommentProfileImage(comment.username);
			});
		}
	}, [commentsOpen, comments]);

	return preview ? (
		<>
			<View style={styles.userPreviewContainer}>
				<View style={styles.postImageContainer}>
					{postData.type && postData.type === 'video' ? (
						<>
							{media && (
								<View
									style={{
										width: '100%',
										height: '100%',
										backgroundColor: 'grey',
									}}>
									<Video
										placeholder={BLUR_HASH}
										transition={300}
										source={{ uri: media }}
										rate={1.0}
										volume={1.0}
										isMuted={false}
										style={{
											width: '100%',
											height: '100%',
											resizeMode: 'cover',
										}}
										shouldPlay={
											(isPlaying && !pauseVideo) ||
											isFocused
										}
										isLooping
										resizeMode='cover'
									/>
								</View>
							)}
							{loadingMedia && (
								<View style={styles.mediaLoadingContainer}>
									<LoadingSpinner />
								</View>
							)}
						</>
					) : (
						<>
							<Image
								placeholder={BLUR_HASH}
								transition={300}
								style={{
									width: '100%',
									height: '100%',
								}}
								contentFit='cover'
								source={{
									uri: `data:image/jpeg;base64,${media}`,
								}}
							/>
							{loadingMedia && (
								<View style={styles.mediaLoadingContainer}>
									<LoadingSpinner />
								</View>
							)}
						</>
					)}
				</View>
			</View>
		</>
	) : (
		<>
			<View style={styles.userPostContainer}>
				<View
					style={{
						height: Dimensions.get('window').height,
					}}>
					<View style={styles.postHeader}>
						<Link
							underlayColor='transparent'
							to={{
								screen: 'profile',
								params: { profileUsername: profileUsername },
							}}>
							<Image
								style={styles.profileImage}
								transition={500}
								placeholder={BLUR_HASH}
								source={{
									uri: `data:image/jpeg;base64,${profileImage}`,
								}}
							/>
						</Link>
						<View style={styles.postHeaderInfoContainer}>
							<Link
								underlayColor='transparent'
								to={{
									screen: 'profile',
									params: { profileUsername: postData.user },
								}}>
								<Text style={styles.username}>
									{postData.user}
								</Text>
							</Link>
							<Text style={styles.timestamp}>
								{timeAgo(postData.timestamp)}
							</Text>
						</View>
					</View>
					<View style={styles.postImageContainer}>
						{postData.type && postData.type === 'video' ? (
							<>
								{media && (
									<TapGestureHandler
										onHandlerStateChange={onDoubleTapEvent}
										numberOfTaps={2}
										ref={doubleTapRef}>
										<TapGestureHandler
											onHandlerStateChange={
												onSingleTapEvent
											}
											numberOfTaps={1}
											waitFor={doubleTapRef}>
											<View
												style={{
													width: Dimensions.get(
														'window',
													).width,
													height: '100%',
													backgroundColor: 'grey',
												}}>
												<Video
													source={{ uri: media }}
													rate={1.0}
													volume={1.0}
													isMuted={false}
													style={{
														width: Dimensions.get(
															'window',
														).width,
														height: '100%',
														resizeMode: 'cover',
													}}
													shouldPlay={
														isPlaying && !pauseVideo
													}
													isLooping
													resizeMode='cover'
												/>
											</View>
										</TapGestureHandler>
									</TapGestureHandler>
								)}
								{loadingMedia && (
									<View style={styles.mediaLoadingContainer}>
										<LoadingSpinner />
									</View>
								)}
							</>
						) : (
							<>
								<TapGestureHandler
									onHandlerStateChange={onDoubleTapEvent}
									numberOfTaps={2}>
									<Image
										placeholder={BLUR_HASH}
										transition={300}
										style={{
											width: Dimensions.get('window')
												.width,
											height: '100%',
											resizeMode: 'cover',
										}}
										source={{
											uri: `data:image/jpeg;base64,${media}`,
										}}
									/>
								</TapGestureHandler>
								{loadingMedia && (
									<View style={styles.mediaLoadingContainer}>
										<LoadingSpinner />
									</View>
								)}
							</>
						)}
					</View>
					<View style={styles.postFooter}>
						<View style={styles.postDataContainer}>
							<View style={styles.postDataInnerRow}>
								<TouchableOpacity
									onPress={() => {
										Haptics.impactAsync(
											Haptics.ImpactFeedbackStyle.Medium,
										);
										setLiked((prevLiked) => {
											updatePostLiked(!prevLiked);
											return !prevLiked;
										});
									}}>
									<Image
										style={styles.icon}
										source={
											liked
												? require('../../img/starFilled.png')
												: require('../../img/star.png')
										}></Image>
								</TouchableOpacity>
								<Text style={styles.username}>{likes}</Text>
							</View>
							<View style={styles.postDataRow}>
								<View style={styles.postDataInnerRow}>
									<TouchableOpacity
										onPress={() => {
											Haptics.impactAsync(
												Haptics.ImpactFeedbackStyle
													.Medium,
											);
											setCommentsOpen(true);
											fetchPostComments();
											// openComments();
										}}>
										<Image
											style={styles.icon}
											source={require('../../img/commentWhite.png')}></Image>
									</TouchableOpacity>
									<Text style={styles.username}>
										{comments.length}
									</Text>
								</View>
								{eval(postData.challenge) && (
									<TouchableOpacity
										onPress={() => {
											Haptics.impactAsync(
												Haptics.ImpactFeedbackStyle
													.Medium,
											);
										}}>
										<Image
											style={styles.gbIcon}
											source={require('../../img/medal.png')}></Image>
									</TouchableOpacity>
								)}
							</View>
							{postData.caption.length > 0 && (
								<View style={styles.postDataRow}>
									<Text style={styles.caption}>
										{sanitize(postData.caption)}
									</Text>
								</View>
							)}
						</View>
					</View>
				</View>
				{commentsOpen && (
					<View style={[styles.commentsContainer]}>
						<View style={styles.commentsHeader}>
							<TouchableOpacity
								style={styles.closeIconContainer}
								onPress={() => {
									Haptics.impactAsync(
										Haptics.ImpactFeedbackStyle.Medium,
									);
									setCommentsOpen(false);
									// closeComments();
									setCurrentComment('');
								}}>
								<Image
									style={styles.closeIcon}
									source={require('../../img/retake.png')}></Image>
							</TouchableOpacity>
							<View style={styles.inputContainer}>
								<TextInput
									style={styles.input}
									placeholder='Write a comment...'
									placeholderTextColor='#000000'
									multiline={true}
									value={currentComment}
									onChangeText={setCurrentComment}
								/>
								<TouchableOpacity
									style={styles.submitCommentButton}
									onPress={() => {
										Keyboard.dismiss();
										if (currentComment !== '') {
											addComment();
										}
									}}>
									<Text style={styles.submitCommentText}>
										Submit
									</Text>
								</TouchableOpacity>
							</View>
						</View>
						<ScrollView
							contentContainerStyle={styles.commentsScroll}>
							{!commentsLoading ? (
								comments.length > 0 ? (
									comments.map((item, index) => {
										return (
											<View
												style={
													index !==
													comments.length - 1
														? styles.commentContainer
														: styles.lastComment
												}
												key={index}>
												<Link
													underlayColor='transparent'
													to={{
														screen: 'profile',
														params: {
															profileUsername:
																item.username,
														},
													}}>
													<Image
														style={
															styles.profileImageComments
														}
														source={
															commentProfileImages[
																item.username
															]
																? {
																		uri: `data:image/jpeg;base64,${
																			commentProfileImages[
																				item
																					.username
																			]
																		}`,
																  }
																: require('../../img/exampleProfile.png')
														}></Image>
												</Link>
												<View
													style={
														styles.commentInfoContainer
													}>
													<View
														style={
															styles.commentInfoInnerContainer
														}>
														<Link
															underlayColor='transparent'
															to={{
																screen: 'profile',
																params: {
																	profileUsername:
																		item.username,
																},
															}}>
															<Text
																style={
																	styles.commentUser
																}>
																{item.username}
															</Text>
														</Link>
														<Text
															style={
																styles.timestamp
															}>
															{timeAgo(
																item.timestamp,
															)}
														</Text>
													</View>
													<View
														style={
															styles.commentContentContainer
														}>
														<Text
															style={
																styles.commentContent
															}>
															{item.content}
														</Text>
													</View>
												</View>
											</View>
										);
									})
								) : (
									<View style={styles.noCommentsContainer}>
										<Text style={styles.noCommentsText}>
											No comments yet. Be the first!
										</Text>
									</View>
								)
							) : (
								<View style={styles.loadingContainer}>
									<LoadingSpinner />
								</View>
							)}
						</ScrollView>
					</View>
				)}
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	userPreviewContainer: {
		height: 200,
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},

	userPostContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		// marginBottom: 50
	},

	backArrowContainer: {
		position: 'absolute',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		top: 50,
		left: 10,
		width: '100%',
		zIndex: 1000,
	},

	backArrow: {
		width: 30,
		height: 30,
	},

	postHeader: {
		position: 'absolute',
		width: '100%',
		top: 100,
		left: 15,
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		gap: 10,
		zIndex: 1,
	},

	profileImage: {
		width: 40,
		height: 40,
		borderRadius: 17.5,
		marginRight: 10,
	},

	postHeaderInfoContainer: {
		display: 'flex',
		flexDirection: 'column',
		gap: 2.5,
	},

	username: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#ffffff',
	},

	dots: {
		width: 25,
		height: 25,
	},

	postImageContainer: {
		flex: 1, // Take up all available space
		width: '100%', // Ensure the container is full width
		alignItems: 'center', // Center children horizontally
		justifyContent: 'center', // Center children vertically
	},

	postImage: {
		width: '100%',
		height: '100%',
	},

	postFooter: {
		position: 'absolute',
		bottom: '11.1%',
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'flex-start',
		paddingLeft: 15,
		paddingRight: 15,
		paddingBottom: 20,
		zIndex: 1,
	},

	postDataContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'flex-start',
		gap: 10,
	},

	postDataRow: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	postDataInnerRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		gap: 15,
	},

	iconsContainer: {
		width: '30%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	iconsInnerContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		gap: 15,
	},

	icon: {
		width: 40,
		height: 40,
	},

	gbIcon: {
		width: 50,
		height: 50,
	},

	deleteIcon: {
		width: 30,
		height: 30,
	},

	deleteContainer: {
		position: 'absolute',
		backgroundColor: '#ffffffc0',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
	},

	deleteButton: {
		backgroundColor: '#000000',
		textAlign: 'center',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 15,
		borderRadius: 10,
	},

	deleteText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: '#ffffff',
	},

	cancelText: {
		fontSize: 16,
		textDecorationLine: 'underline',
		margin: 25,
	},

	captionContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},

	caption: {
		fontSize: 16,
		color: '#ffffff',
	},

	commentsContainer: {
		position: 'absolute',
		top: 0,
		width: '100%',
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#FFFFFFF0',
		zIndex: 1000,
		// marginBottom: 25
	},

	commentsHeader: {
		// width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		width: '90%',
		height: '20%',
		marginTop: 100,
	},

	noCommentsContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		// height: '50%'
	},

	closeIcon: {
		height: 25,
		width: 25,
	},

	inputContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '85%',
	},

	input: {
		height: 50,
		maxWidth: '70%',
		minWidth: '40%',
		marginTop: 5,
		marginBottom: 15,
		paddingTop: 15,
		paddingLeft: 15,
		paddingRight: 15,
		borderWidth: 0,
		borderRadius: 25,
		fontSize: 16,
		textAlign: 'center',
		backgroundColor: '#cccccca0',
		color: '#000000',
		overflow: 'hidden',
		// zIndex: 1000,
	},

	submitCommentButton: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#000000',
		borderRadius: 10,
		width: 125,
		borderWidth: 1,
		borderColor: '#000000',
	},

	submitCommentText: {
		color: '#ffffff',
		padding: 7.5,
		fontSize: 16,
		fontWeight: 'bold',
	},

	commentsScroll: {
		width: 390,
	},

	commentContainer: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		paddingTop: 10,
		paddingBottom: 10,
		borderTopColor: '#00000040',
		borderTopWidth: 1,
	},

	lastComment: {
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		paddingTop: 10,
		paddingBottom: 10,
		borderTopColor: '#00000040',
		borderTopWidth: 1,
		borderBottomColor: '#00000040',
		borderBottomWidth: 1,
	},

	profileImageComments: {
		width: 40,
		height: 40,
		borderRadius: 25,
		marginLeft: 15,
		marginRight: 15,
	},

	commentInfoContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'flex-start',
		width: '90%',
	},

	commentInfoInnerContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		paddingBottom: 5,
	},

	commentContentContainer: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '87.5%',
	},

	commentUser: {
		fontSize: 16,
		fontWeight: 'bold',
		paddingRight: 10,
	},

	commentContent: {
		fontSize: 16,
		fontWeight: 'normal',
	},

	timestamp: {
		fontSize: 13,
		color: '#ffffff',
	},

	loadingContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
		marginTop: 100,
	},

	mediaLoadingContainer: {
		position: 'absolute',
		top: '0%',
		left: '0%',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: '100%',
		// marginTop: 100
		zIndex: 1000,
		backgroundColor: 'grey',
	},

	loader: {
		width: 75,
		height: 75,
	},
});

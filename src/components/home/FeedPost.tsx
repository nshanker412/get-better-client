/**
 * Todo
 * -  implement zidx stack to imporove layout precision
 * - get profile pic svg
 */

import { CommentIcon } from '@assets/darkSvg/CommentIcon';
import { StarIcon } from '@assets/darkSvg/StarIcon.js';
import { StarIconFilled } from '@assets/darkSvg/StarIconFilled.js';
import { BLUR_HASH } from '@constants/constants';
import { PushNotificationInfoPacket } from '@context/notifications/Notifications.types';
import { useNotifications } from '@context/notifications/useNotifications';
import { PostMetadata } from '@models/posts';
import { Link } from '@react-navigation/native';
import axios from 'axios';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import {
	State,
	TapGestureHandler,
	TouchableOpacity,
} from 'react-native-gesture-handler';
import { Portal } from 'react-native-portalize';
import { SvgXml } from 'react-native-svg';
import { sanitize } from '../../utils/sanitize';
import { timeAgo } from '../../utils/timeAgo';
import { LoadingSpinner } from '../loading-spinner/LoadingSpinner';
import { ConnectedProfileAvatar } from '../profile-avatar/ConnectedProfileAvatar';
import { useFeedPostStyles } from './FeedPost.styles';
import { ConnectedPostCommentDrawer } from './post-comment-drawer/ConnectedPostCommentDrawer';


export interface FeedPostProps {
	index: number;
	loadMedia: boolean;
	postID: string;
	postData: PostMetadata;
	myUsername: string;
	profileUsername: string;
	pauseVideo: boolean;
}


export const FeedPost: React.FC<FeedPostProps> = ({
	index,
	loadMedia,
	postID,
	postData,
	myUsername,
	profileUsername,
	pauseVideo
}) => {


	const [liked, setLiked] = useState(false);
	const [likes, setLikes] = useState(null);
	const [comments, setComments] = useState([]);
	const [commentsLoading, setCommentsLoading] = useState(false);
	const [media, setMedia] = useState(null);
	const [loadingMedia, setLoadingMedia] = useState(false);
	// const [profileImage, setProfileImage] = useState(null);
	const [isPlaying, setIsPlaying] = useState(true);
	const doubleTapRef = useRef();
	const commentDrawerRef = useRef(null);
	

	const {sendOutPushNotification} = useNotifications();

	// const { profileUsername } = useParams();

	const openCommentDrawer = () => {
		commentDrawerRef.current?.openModal();
	};
	const feedPostStyles = useFeedPostStyles();

	async function updatePostLiked(isLiked: boolean): Promise<void> {
		axios
			.post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/like`, {
				profileUsername: profileUsername,
				postID: postID,
				myUsername: myUsername,
				status: isLiked,
			})
			.then((response) => {
				setLikes(response.data.likes);

				if (isLiked) {
				
					const pushNotifInfo: PushNotificationInfoPacket = {
						title: `${myUsername} liked your post.`,
						body: `check it out!`,
						data: { path: 'profile', params: { profileUsername: profileUsername, postId: postID } },
					};
				
					sendOutPushNotification(profileUsername, pushNotifInfo);
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
		if (event.nativeEvent.state === State.ACTIVE) {
			// Toggle play/pause
			setIsPlaying(!isPlaying);
		}
	};

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
						console.log('fetchPostMedia', url);	
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


	return (
		<>
			<View style={feedPostStyles.userPostContainer}>
				<View
					style={{
						height: Dimensions.get('window').height,
					}}>
					<View style={feedPostStyles.postHeader}>
						<ConnectedProfileAvatar
							key={profileUsername}
							username={profileUsername}
							fetchSize={300}
							size={40}
						/>
						<View style={feedPostStyles.postHeaderInfoContainer}>
							<Link
								to={{
									screen: 'profile',
									params: { profileUsername: postData.user },
								}}>
								<Text style={feedPostStyles.username}>
									{postData.user}
								</Text>
							</Link>
							<Text style={feedPostStyles.timestamp}>
								{timeAgo(postData.timestamp)}
							</Text>
						</View>
					</View>
					<View style={feedPostStyles.postImageContainer}>
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
													key={`{profileUsername}_${postID}-video`}
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
									<View
										style={
											feedPostStyles.mediaLoadingContainer
										}>
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
											key={`{profileUsername}_${postID}-image`}
										
										placeholder={BLUR_HASH}
										transition={300}
										style={{
											width: Dimensions.get('window')
												.width,
											height: '100%',
										}}
										source={{
											uri: `data:image/jpeg;base64,${media}`,
										}}
										allowDownscaling={false}
										contentFit='cover'
									/>
								</TapGestureHandler>
								{loadingMedia && (
									<View
										style={
											feedPostStyles.mediaLoadingContainer
										}>
										<LoadingSpinner />
									</View>
								)}
							</>
						)}
					</View>
					<View style={feedPostStyles.postFooter}>
						<View style={feedPostStyles.postDataContainer}>
							<View style={feedPostStyles.postDataInnerRow}>
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
									<View style={feedPostStyles.icon}>
										<SvgXml
											width={40}
											height={40}
											xml={
												liked
													? StarIconFilled
													: StarIcon
											}
										/>
									</View>
								</TouchableOpacity>
								<Text style={feedPostStyles.username}>
									{likes}
								</Text>
							</View>
							<View style={feedPostStyles.postDataRow}>
								<View style={feedPostStyles.postDataInnerRow}>
									<TouchableOpacity
										onPress={() => {
											Haptics.impactAsync(
												Haptics.ImpactFeedbackStyle
													.Medium,
											);
											openCommentDrawer();
											fetchPostComments();
										}}>
										<View style={feedPostStyles.icon}>
											<SvgXml
												style={feedPostStyles.iconStyle}
												width={40}
												height={40}
												xml={CommentIcon}
											/>
										</View>
									</TouchableOpacity>
									<Text style={feedPostStyles.username}>
										{comments?.length ?? 0}
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
											style={feedPostStyles.gbIcon}
											source={require('../../img/medal.png')}></Image>
									</TouchableOpacity>
								)}
							</View>
							{postData?.caption?.length > 0 && (
								<View style={feedPostStyles.postDataRow}>
									<Text style={feedPostStyles.caption}>
										{sanitize(postData.caption)}
									</Text>
								</View>
							)}
						</View>
					</View>
				</View>

				<Portal>
					<ConnectedPostCommentDrawer
						ref={commentDrawerRef}
						postID={postID}
						profileUsername={profileUsername}
						comments={comments}
					/>
				</Portal>
			</View>
		</>
	);
}


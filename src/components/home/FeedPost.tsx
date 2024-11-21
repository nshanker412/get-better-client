/**
 * Todo
 * -  implement zidx stack to imporove layout precision
 * - get profile pic svg
 */

import { CommentIcon } from '@assets/darkSvg/CommentIcon';
import { StarIcon } from '@assets/darkSvg/StarIcon.js';
import { StarIconFilled } from '@assets/darkSvg/StarIconFilled.js';
import { FlagBlank } from '@assets/darkSvg/Flag.js';
import { FlagFilled } from '@assets/darkSvg/FlagFilled.js';
import { BLUR_HASH } from '@constants/constants';
import { NotificationType, PushNotificationInfoPacket } from '@context/notifications/Notifications.types';
import { useNotifications } from '@context/notifications/useNotifications';
import { PostMetadata } from '@models/posts';
import { Link } from '@react-navigation/native';
import axios from 'axios';
import { Video } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React, { useCallback, useRef, useState } from 'react';
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
import { usePostLifecycle } from './hooks/usePostLifecycle';
import { ConnectedPostCommentDrawer } from './post-comment-drawer/ConnectedPostCommentDrawer';

export interface FeedPostProps {
	index: number;
	loadMedia: boolean;
	postID: string;
	filename: string;
	postData: PostMetadata;
	myUsername: string;
	profileUsername: string;
	pauseVideo: boolean;
}

export const FeedPost: React.FC<FeedPostProps> = ({
	index,
	loadMedia,
	postID,
	filename,
	postData,
	myUsername,
	profileUsername,
	pauseVideo
}) => {
	const {
		loadingLikesCount,
		loadingCommentsCount,
		loadingMedia,
		likesCount,
		liked,
		commentsCount,
		postMedia,
		flagged,
		// setPostLiked: hookSetIsPostLiked,
		refresh,
	} = usePostLifecycle({ filename, postID, metadata: postData, myUsername });

	const [isPlaying, setIsPlaying] = useState(true);
	const [_liked, _setIsLiked] = useState(postData.likes.includes(myUsername));
	const [_flagged, _setIsFlagged] = useState(postData.likes.includes(myUsername));
	
	const [_likesCount, _setLikesCount] = useState(postData.likes.length);
	const doubleTapRef = useRef();
	const commentDrawerRef = useRef(null);
	const { sendOutPushNotification } = useNotifications();
	const feedPostStyles = useFeedPostStyles();

	const openCommentDrawer = () => {
		commentDrawerRef.current?.openModal();
	};

	const onDoubleTapEvent = async (event): Promise<void>  => {
		if (event.nativeEvent.state === State.ACTIVE) {
			// Double tap was detected
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

			// image wasn't already liked
			if (!_liked) {
				  onLikePress(true);
			}
		}
	};

	const onSingleTapEvent = (event) => {
		if (event.nativeEvent.state === State.ACTIVE) {
			// Toggle play/pause
			setIsPlaying(!isPlaying);
		}
	};


	const setPostLiked = async (isLiked: boolean): Promise<void> => {
        
		try {
		  await axios
				.post(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/like`, {
					postID: postData["id"],
					liked_by: myUsername,
					status: isLiked,
				})
	
		} catch (error) {
			console.log('setPostLikedError', error);
		}
        
		// if (isLiked) {

		// 	const pushNotifInfo: PushNotificationInfoPacket = {
		// 		title: `${myUsername} liked your post.`,
		// 		body: `check it out!`,
		// 		data: {
		// 			type: NotificationType.LIKED_POST,
		// 			path: 'profile',
		// 			params:
		// 			{
		// 				profileUsername: postData.user,
		// 				postID: postID
		// 			}
		// 		},
		// 	};
        
		// 	sendOutPushNotification(postData.user, pushNotifInfo);
		// }
		
		refresh();
	};

	const onLikePress = useCallback( (newLikedStatus:boolean) => {
		
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

		if (!_likesCount && newLikedStatus) {
			_setLikesCount(1);
		}
	
		const newCount = newLikedStatus ? _likesCount + 1 : _likesCount - 1;
		_setLikesCount(newCount);

		_setIsLiked(newLikedStatus);
		 setPostLiked(newLikedStatus);
	}, [_liked, _likesCount, setPostLiked]);

	const onFlagPress = useCallback( (newFlagPressed:boolean) => {
		console.log(newFlagPressed)
	}, []);



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
								{postMedia && (
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
													key={`${profileUsername}_${postID}-video`}
													source={{ uri: postMedia }}
													rate={1.0}
													// transition={300}
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
											key={`${profileUsername}_${postID}-image`}
											placeholder={BLUR_HASH}
											// transition={300}
											style={{
												width: Dimensions.get('window')
													.width,
												height: '100%',
											}}
											source={{
												uri: `data:image/jpeg;base64,${postMedia}`,
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
									onPress={() => onLikePress(!_liked)}>
									<View style={feedPostStyles.icon}>
										<SvgXml
											width={40}
											height={40}
											xml={
												_liked
													? StarIconFilled
													: StarIcon
											}
										/>
									</View>
								</TouchableOpacity>
								{(loadingMedia && loadingLikesCount) ?
								(<Text style={feedPostStyles.username}>
									<LoadingSpinner />
								</Text>
								) : (
									<Text style={feedPostStyles.username}>
										{_likesCount}
									</Text>
								)}
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
									{(loadingMedia && loadingCommentsCount) ?
										(<Text style={feedPostStyles.username}>
											<LoadingSpinner />
										</Text>
										) : (
											<Text style={feedPostStyles.username}>
												{commentsCount}
											</Text>
										)}
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
					/>
				</Portal>
			</View>
		</>
	);
}


/**
 * Todo
 * -  implement zidx stack to imporove layout precision
 * - get profile pic svg
 */

import { CommentIcon } from '@assets/darkSvg/CommentIcon';
import { StarIcon } from '@assets/darkSvg/StarIcon.js';
import { StarIconFilled } from '@assets/darkSvg/StarIconFilled.js';
import { BLUR_HASH } from '@constants/constants';
import { PostMetadata } from '@models/posts';
import { Link } from '@react-navigation/native';
import { Video } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import React, { useRef, useState } from 'react';
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
		setPostLiked
	} = usePostLifecycle({ filename, postID, metadata: postData, myUsername });
	

	const [isPlaying, setIsPlaying] = useState(true);
	const doubleTapRef = useRef();
	const commentDrawerRef = useRef(null);
	const feedPostStyles = useFeedPostStyles();


	const openCommentDrawer = () => {
		commentDrawerRef.current?.openModal();
	};


	const onDoubleTapEvent = (event) => {
		if (event.nativeEvent.state === State.ACTIVE) {
			// Double tap was detected
			Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

			// image wasn't already liked
			if (!liked) {
				setPostLiked(liked!);
			}
		}
	};

	const onSingleTapEvent = (event) => {
		if (event.nativeEvent.state === State.ACTIVE) {
			// Toggle play/pause
			setIsPlaying(!isPlaying);
		}
	};



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
													key={`{profileUsername}_${postID}-video`}
													source={{ uri: postMedia }}
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
											key={`${profileUsername}_${postID}-image`}
										
										placeholder={BLUR_HASH}
										transition={300}
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
									onPress={() => {
										Haptics.impactAsync(
											Haptics.ImpactFeedbackStyle.Medium,
										);
										setPostLiked(!liked);
									
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
									{likesCount}
								</Text>


								{(loadingMedia && loadingLikesCount) ?
								(<Text style={feedPostStyles.username}>
									<LoadingSpinner />
								</Text>
								) : (
									<Text style={feedPostStyles.username}>
										{loadingLikesCount}
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


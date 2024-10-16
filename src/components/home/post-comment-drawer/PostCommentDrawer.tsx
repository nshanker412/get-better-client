import { EllipseIcon } from '@assets/darkSvg/EllipseIcon';
import { Link } from '@react-navigation/native';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { timeAgo } from '../../../utils/timeAgo';
import { LoadingSpinner } from '../../loading-spinner/LoadingSpinner';
import { ConnectedProfileAvatar } from '../../profile-avatar/ConnectedProfileAvatar';
import { usePostCommentDrawerStyles } from './PostCommentDrawer.styles';
import { PostCommentDrawerProps } from './PostCommentDrawer.types';

/**
 * TODO - need to hydrate comments on refresh
 * @returns
 */
export const PostCommentDrawer: React.FC<PostCommentDrawerProps> = ({
	comments,
	commentsLoading,
}) => {
	const postCommentDrawerStyles = usePostCommentDrawerStyles();
	const [refreshing, setRefreshing] = useState(false);

	const genCommentsList = () =>
		comments?.map((item, index) => {
			return (
				<View
					style={
						comments?.length - 1 === index
							? postCommentDrawerStyles.lastcommentContainer
							: postCommentDrawerStyles.commentContainer
					}
					key={index}>
					<View style={postCommentDrawerStyles.commentInnerContainer}>
						<View
							style={{
								flex: 1,
								display: 'flex',
								alignItems: 'flex-start',
								justifyContent: 'flex-start',
							}}>
							<ConnectedProfileAvatar key={item.username} username={item.username} size={ 40} />
						</View>
						<View style={{ flex: 5, justifyContent: 'flex-start' }}>
							<View
								style={{
									flex: 4,
									flexDirection: 'row',
									alignItems: 'center',
									justifyContent: 'flex-start',
									gap: 8,
								}}>
								<View>
									<Link
										to={{
											screen: 'profile',
											params: {
												profileUsername: item.username,
											},
										}}>
										<Text
											style={
												postCommentDrawerStyles.username
											}>
											{item.username}
										</Text>
									</Link>
								</View>
								<View
									style={{
										alignItems: 'flex-start',
										justifyContent: 'center',
									}}>
									<SvgXml
										xml={EllipseIcon}
										override={{ width: '5', height: '5' }}
									/>
								</View>

								<Text style={postCommentDrawerStyles.timestamp}>
									{timeAgo(parseInt(item.timestamp, 10))}
								</Text>
							</View>
							<View style={{ alignItems: 'flex-start' }}>
								<Text
									style={
										postCommentDrawerStyles.commentContent
									}>
									{item.content}
								</Text>
							</View>
						</View>
					</View>
				</View>
			);
		});

	/**
	 * update kids during refresh
	 */
	const onRefresh = () => {
		// Add logic to refresh data here
		setRefreshing(true);

		// Simulate an asynchronous data refresh
		setTimeout(() => {
			setRefreshing(false);
		}, 1000);
	};

	return (
		<ScrollView
			style={postCommentDrawerStyles.scrollView}
			
			contentContainerStyle={
				postCommentDrawerStyles.commentScrollContainer
			}
			scrollEnabled={true}
			refreshControl={
				<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
					colors={['#ffffff']}
					tintColor={'#ffffff'}
				/>
			}>
			{!commentsLoading ? (
				comments?.length > 0 ? (
					<ScrollView scrollEnabled={true}>{genCommentsList()}</ScrollView>
				) : (
					<View style={postCommentDrawerStyles.noCommentsContainer}>
						<Text style={postCommentDrawerStyles.noCommentsText}>
							No comments yet. Be the first!
						</Text>
					</View>
				)
			) : (
				<View style={postCommentDrawerStyles.loadingContainer}>
					<LoadingSpinner />
				</View>
			)}
		</ScrollView>
	);
};

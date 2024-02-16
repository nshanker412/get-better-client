import { EllipseIcon } from '@assets/darkSvg/EllipseIcon';
import { Link } from '@react-navigation/native';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { timeAgo } from '../../../utils/timeAgo';
import { LoadingSpinner } from '../../loading-spinner/LoadingSpinner';
import { usePostCommentDrawerStyles } from './NotificationsDrawer.styles';
import { NotificationDrawerProps } from './NotificationsDrawer.types';

/**
 * TODO - need to hydrate comments on refresh
 * @returns
 */
export const NotificationsDrawer: React.FC<NotificationDrawerProps> = ({
	loading,
	allNotifications,
}) => {
	const postCommentDrawerStyles = usePostCommentDrawerStyles();
	const [refreshing, setRefreshing] = useState(false);

	if (loading) {
		return (
			<View style={postCommentDrawerStyles.loadingContainer}>
				<LoadingSpinner />
			</View>
		);
	}

	const genCommentsList = () =>
		allNotifications?.map((item, index) => {
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
							<Link
								to={{
									screen: 'profile',
									params: { profileUsername: item.username },
								}}>
								<>
									{commentProfileImages[item.username] ? (
										<Image
											style={{
												paddingRight: 10,
												width: 40,
												height: 40,
												borderRadius: 20,
											}}
											source={{
												uri: `data:image/jpeg;base64,${
													commentProfileImages[
														item.username
													]
												}`,
											}}
										/>
									) : (
										<Image
											style={{
												paddingRight: 10,
												width: 40,
												height: 40,
												borderRadius: 20,
											}}
											source={require('../../../img/exampleProfile.png')}
										/>
									)}
								</>
							</Link>
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
					<>{genCommentsList()}</>
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

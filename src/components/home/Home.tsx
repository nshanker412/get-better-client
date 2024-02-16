import { useBottomTabEvent } from '@context/bottom-tab-nav/useBottomTabEvent';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useThemeContext } from '@context/theme/useThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Haptics from 'expo-haptics';

import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
	Dimensions,
	RefreshControl,
	ScrollView,
	TouchableOpacity,
	View,
} from 'react-native';
import { Host } from 'react-native-portalize';
import { Header } from '../header/Header';
import { LoadingSpinner } from '../loading-spinner/LoadingSpinner';
import { FeedPost } from './FeedPost';
import { useHomeStyles } from './Home.styles';
import { NotificationsBell } from './notifications-drawer/NotificationsBell';

export const Home: React.FC = () => {
	const [posts, setPosts] = useState([]);
	const [loadingPosts, setLoadingPosts] = useState(false);
	const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
	const [publicPostsFetched, setPublicPostsFetched] = useState(false);
	const scrollViewRef = useRef();
	const window = Dimensions.get('window');
	const homeStyles = useHomeStyles();
	const { username: myUsername } = useMyUserInfo();
	const navigation = useNavigation();
	const { theme } = useThemeContext();
	const isFocused = useIsFocused();
	const { onHomeTabPressWhenFocused } = useBottomTabEvent();

	const currentScrollIndexRef = useRef(currentScrollIndex);

	// can only pass refs in closure
	const onTabPressCb = useCallback(() => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

		if (scrollViewRef.current == null) return;

		if (currentScrollIndexRef.current === 0) {
			// TODO: scrollViewRef.current.onRefresh();
			// refresh page
			console.log('refreshing');
		} else {
			scrollViewRef.current?.scrollTo({ y: 0, animated: true });
		}
	}, []);

	useEffect(() => {
		onHomeTabPressWhenFocused(onTabPressCb);
	}, []);

	useEffect(() => {
		console.log('currentScrollIndex', currentScrollIndex);
	}, [currentScrollIndex]);

	/**
	 * TODO:
	 * 1. if not focused on home tab, stop vid autoplay
	 * 2. when focus resets on home tab restart vid autoplay
	 */

	const [unreadNotifications, setUnreadNotifications] = useState([]);

	const getUnreadNotifications = async () => {
		//1. get the last read time
		const getLastReadTimeStorage = await AsyncStorage.getItem(
			'lastNotificationReadTimestamp',
		);

		//2. get timestamnp of 6 hours ago
		const now = new Date();
		const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60);

		console.log(
			'getLastReadTimeStorage',
			getLastReadTimeStorage,
			new Date(parseInt(getLastReadTimeStorage)),
		);
		console.log('sixHoursAgo', sixHoursAgo);

		//3.
		const lastReadTime = getLastReadTimeStorage
			? new Date(parseInt(getLastReadTimeStorage))
			: sixHoursAgo;

		console.log('lastReadTime', lastReadTime);

		//4. fetch notificaitons
		const response = await axios.get(
			`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notifications/fetch/${myUsername}`,
		);
		const notifications = response.data.notifications;
		console.log('notifications', notifications);

		//4. find the notifications that are newer than the last read time
		const unreadNotifications = notifications.filter((notification) => {
			const notificationTime = new Date(
				parseInt(notification.timestamp) * 1000,
			);

			return notificationTime > lastReadTime;
		});

		//5. set the unread notifications
		setUnreadNotifications(unreadNotifications);
	};

	useEffect(() => {
		getUnreadNotifications();
	}, []);

	// fetch all friends post metadata
	const fetchFriendsPosts = async () => {
		setLoadingPosts(true);
		// console.log(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/feed/fetch/friends/${myUsername}`)
		await axios
			.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/feed/fetch/friends/${myUsername}`,
			)
			.then((response) => {
				setPosts(response.data.posts);
				console.log('setPosts');
			})
			.catch((error) => {
				console.log('fetchFriendsPostsError', error);

				// if no posts in friends feed, fetch the public feed
				fetchPublicPosts();
			})
			.finally(() => {
				setLoadingPosts(false);
			});
	};

	// fetch public posts metadata (10 or all of them??)
	function fetchPublicPosts() {
		setLoadingPosts(true);
		axios
			.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/feed/fetch/public/${myUsername}`,
			)
			.then((response) => {
				setPosts((prevPosts) => [...prevPosts, ...response.data.posts]);
				setLoadingPosts(false);
				setPublicPostsFetched(true);
			})
			.catch((error) => {
				console.log('fetchPublicPostsError', error);
				setLoadingPosts(false);
			});
	}

	useEffect(() => {
		if (myUsername) {
			fetchFriendsPosts();
		}
	}, [myUsername]);

	const handleScroll = (event) => {
		// media loading handling
		const yOffset = event.nativeEvent.contentOffset.y;
		const index = Math.round(yOffset / window.height);
		setCurrentScrollIndex(index);
		currentScrollIndexRef.current = index;

		// fetch public handling
		const contentHeight = event.nativeEvent.contentSize.height;
		const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;

		// Check if the user has scrolled to the bottom
		if (
			yOffset + scrollViewHeight >= contentHeight - 20 &&
			!publicPostsFetched
		) {
			fetchPublicPosts();
		}
	};

	// delete files that are older than a week
	async function clearOldFiles() {
		try {
			const directoryUri = FileSystem.documentDirectory;
			const files = await FileSystem.readDirectoryAsync(directoryUri);
			const now = new Date();

			for (const fileName of files) {
				if (!fileName.endsWith('_profile')) {
					const fileUri = `${directoryUri}${fileName}`;
					const fileInfo = await FileSystem.getInfoAsync(fileUri);

					if (fileInfo.modificationTime) {
						const fileDate = new Date(
							fileInfo.modificationTime * 1000,
						);
						const oneWeekAgo = new Date(
							now.getTime() - 7 * 24 * 60 * 60 * 1000,
						);

						// Check if file is older than one week
						if (fileDate < oneWeekAgo) {
							await FileSystem.deleteAsync(fileUri);
							console.log('Deleted old file:', fileName);
						}
					}
				}
			}
		} catch (error) {
			console.error('Error clearing old files:', error);
		}
	}

	useEffect(() => {
		clearOldFiles();

		return () => clearOldFiles();
	}, []);

	/**
	 * TODO = implement feed fetch & merge
	 */
	const [refreshing, setRefreshing] = React.useState(false);

	const onRefresh = async () => {
		setRefreshing(true);
		await fetchFriendsPosts();
		setRefreshing(false);
	};

	return (
		<View style={homeStyles.homeContainer}>
			<Host>
				<Header />
				<TouchableOpacity
					style={homeStyles.bellIconContainer}
					onPress={() => {
						navigation.navigate('notifications', {
							profileUsername: myUsername,
						});
					}}>
					<View style={homeStyles.bellIconInnerContainer}>
						<NotificationsBell
							newNotificationsCount={unreadNotifications}
						/>
					</View>
				</TouchableOpacity>
				<View style={{ height: Math.round(window.height * 1) }}>
					<ScrollView
						ref={scrollViewRef}
						id='home-feed-scroll-view'
						contentContainerStyle={homeStyles.homeScrollContainer}
						snapToAlignment={'start'}
						pagingEnabled
						onMomentumScrollEnd={() => {
							Haptics.impactAsync(
								Haptics.ImpactFeedbackStyle.Medium,
							);
						}}
						refreshControl={
							<RefreshControl
								refreshing={refreshing}
								onRefresh={onRefresh}
								colors={[theme.textColorPrimary]}
								tintColor={theme.textColorPrimary}
							/>
						}
						onScroll={handleScroll}
						scrollEventThrottle={100}>
						<>
							{posts.map((item, index) => {
								const splitIndex =
									item['filename'].lastIndexOf('_');
								return (
									<FeedPost
										key={index}
										index={index}
										loadMedia={
											index === currentScrollIndex ||
											index === currentScrollIndex + 1
										}
										profileUsername={item[
											'filename'
										].substring(0, splitIndex)}
										postID={item['filename'].substring(
											splitIndex + 1,
										)}
										postData={item['metadata']}
										myUsername={myUsername}
										storePost={true}
										pauseVideo={
											index !== currentScrollIndex ||
											!isFocused
										}
									/>
								);
							})}
							{loadingPosts ? (
								<View
									style={[
										homeStyles.loadingContainer,
										{
											height: Dimensions.get('window')
												.height,
										},
									]}>
									<LoadingSpinner />
								</View>
							) : null}
						</>
					</ScrollView>
				</View>
			</Host>
		</View>
	);
};

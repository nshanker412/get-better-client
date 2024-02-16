import { useThemeContext } from '@context/theme/useThemeContext';
import { EvilIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link, useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import * as ExpoNotifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Linking, ScrollView, Text, View } from 'react-native';
import { RefreshControl, TouchableOpacity } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { timeAgo } from '../../utils/timeAgo';
import { Header } from '../header/Header';
import { ConnectedProfileAvatar } from '../profile-avatar/ConnectedProfileAvatar';
import { useNotificationsStyles } from './Notifications.styles';

// const updateReadTimeToNow = async () => {
// 	const now = new Date();
// 	const now2 = Math.floor(now.getTime());
// 	const nowString = now2.toString();

// 	// get timestamp of 6 hours ago
// 	const sixHoursAgo = new Date(now.getTime() - 6 * 60 * 60 * 1000);
// 	await AsyncStorage.setItem('lastNotificationReadTimestamp', JSON.stringify(sixHoursAgo));
// 	return;
// };

/**
 *
 * Convert to Notification Tiles and use Flatlist or Flashlist
 */
export const Notifications = () =>  {
	const profileUsername = useRoute()?.params?.profileUsername;
	// const navigate = useNavigation();
	const [notifications, setNotifications] = useState([]);
	// const [profileImages, setProfileImages] = useState({});
	const [loading, setLoading] = useState(true);
	const [notificationPermissions, setNotificationPermissions] = useState('');
	const [lastReadTime, setLastReadTime] = useState('');
	const navigation = useNavigation();

	useEffect(() => {
		// first get the timestamp
		const getLastReadTime = async () => {
			const getLastReadTime = await AsyncStorage.getItem(
				'lastNotificationReadTimestamp',
			);
			console.log('getLastReadTime', getLastReadTime);
			setLastReadTime(getLastReadTime);
		};
		getLastReadTime();

		// on component unmount update the read time to now
		// return () => updateReadTimeToNow();
	}, []);

	const notificationStyles = useNotificationsStyles();
	const { theme } = useThemeContext();

	async function fetchNotificationPermissions() {
		const { status: permissions } =
			await ExpoNotifications.getPermissionsAsync();
		setNotificationPermissions(permissions);

		if (permissions !== 'granted') {
			alert('Please enable notifications in your settings.');
			return;
		}
	}

	// useEffect(() => {
	// 	fetchProfilePictures();
	// }, [notifications]);

	useEffect(() => {
		fetchNotificationPermissions();
	}, []);

	useEffect(() => {
		setLoading(true);
		let url = `${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notifications/fetch/${profileUsername}`;
		axios
			.get(url)
			.then((response) => {
				console.log(
					'fetchNotifications',
					response.data.notifications.length,
				);
				setNotifications(response.data.notifications);
				setLoading(false);
			})
			.catch((error) => {
				console.log('fetchNotificationsError', error);
			});
	}, []);

	console.log('notifications', notifications);

	return (
		<>
			<Header />
			<Link
				underlayColor='transparent'
				to={{ screen: 'home' }}
				style={notificationStyles.backArrowContainer}>
				<EvilIcons
					name='chevron-left'
					size={50}
					color={theme.textColorPrimary}
				/>
			</Link>
			<View style={notificationStyles.notificationsContainer}>
				<View style={notificationStyles.notificationsTitleContainer}>
					<Text style={notificationStyles.notificationsTitleText}>
						Notifications
					</Text>
				</View>
				{notificationPermissions !== 'granted' && (
					<View style={notificationStyles.settingsContainer}>
						<Text style={{ color: theme.textColorPrimary }}>
							Please enable notifications in your settings.
						</Text>
						<TouchableOpacity
							style={notificationStyles.settingsButton}
							onPress={() => {
								Linking.openSettings();
							}}>
							<Text
								style={notificationStyles.challengeButtonText}>
								Settings
							</Text>
						</TouchableOpacity>
					</View>
				)}
				<ScrollView
					contentContainerStyle={
						notificationStyles.notificationsScroll
					}
					refreshControl={
						<RefreshControl
							refreshing={loading}
							colors={[theme.textColorPrimary]}
							tintColor={theme.textColorPrimary}
							onRefresh={() => {
								setLoading(true);
								axios
									.get(
										`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notifications/fetch/${profileUsername}`,
									)
									.then((response) => {
										console.log(
											'fetchNotifications',
											response.data.notifications.length,
										);
										setNotifications(
											response.data.notifications,
										);
										setLoading(false);
										Toast.show({
											text1: "You're up to date!",
											type: 'success',
											visibilityTime: 2000,
											topOffset: 90,
										});
									})
									.catch((error) => {
										console.log(
											'fetchNotificationsError',
											error,
										);
									});
							}}
						/>
					}>
					{!loading ? (
						<>
							{notifications.map((item, index) => {
								const itemUsername = item.content.split(' ')[0];
								const itemContent = item.content
									.split(' ')
									.slice(1)
									.join(' ');
								// default to profile screen
								let itemLink = {
									screen: 'profile',
									params: {
										profileUsername: itemUsername,
									},
								};

								if (itemContent.includes('motivating')) {
									// itemLink = `/profile/${item.linkUsername}`;
									itemLink = {
										screen: 'profile',
										params: {
											profileUsername: itemUsername,
										},
									};
								} else if (
									itemContent.includes('liked') ||
									itemContent.includes('commented')
								) {
									// itemLink = `/profile/post/${item.linkUsername}/${item.postID}`;
									itemLink = {
										screen: 'profile',
										params: {
											profileUsername: itemUsername,
											linkPostID: item?.postID,
										},
									};
								}

								return (
									<Link
										to={itemLink}
										key={index}>
										<View
											style={
												notificationStyles.notificationContainer
											}>
											<ConnectedProfileAvatar
												username={itemUsername}
												fetchSize={300}
												size={40}
												onNavigateToProfile={() =>
													navigation.navigate(
														'profile',
														{
															profileUsername:
																itemUsername,
														},
													)
												}
											/>

											<View
												style={
													notificationStyles.notificationInfoContainer
												}>
												<View
													style={
														notificationStyles.notificationContentContainer
													}>
													<Link
														underlayColor='transparent'
														to={{
															screen: 'profile',
															params: {
																profileUsername:
																	itemUsername,
															},
														}}>
														<Text
															numberOfLines={1}
															ellipsizeMode='tail'
															style={
																notificationStyles.notificationUser
															}>
															{itemUsername}
														</Text>
													</Link>
													<Text
														style={
															notificationStyles.notificationContent
														}
														numberOfLines={1}
														ellipsizeMode='tail'>
														{itemContent}
													</Text>
												</View>
												<Text
													style={
														notificationStyles.timestamp
													}>
													{timeAgo(item.timestamp)}
												</Text>
												{item.challenge && (
													<View
														style={
															notificationStyles.challengeContainer
														}>
														<View
															style={
																notificationStyles.notificationContentContainer
															}>
															<Link
																underlayColor='transparent'
																to={{
																	screen: 'profile',
																	params: {
																		profileUsername:
																			itemUsername,
																	},
																}}>
																<Text
																	style={
																		notificationStyles.notificationUser
																	}>
																	The
																	Challenge:
																</Text>
															</Link>
															<Text
																style={
																	notificationStyles.notificationContent
																}>
																{item.challenge}
															</Text>
														</View>
														<Link
															to={{
																screen: 'post',
																params: {
																	challengeUsername:
																		itemUsername,
																	challengeID:
																		item?.timestamp,
																	challenge:
																		item?.challenge,
																},
															}}>
															<Text
																style={
																	notificationStyles.notificationContent
																}>
																{
																	item.challengeDescription
																}
															</Text>
															<TouchableOpacity
																style={
																	notificationStyles.challengeButton
																}>
																<Text
																	style={
																		notificationStyles.challengeButtonText
																	}>
																	Complete
																	Challenge
																</Text>
															</TouchableOpacity>
														</Link>
													</View>
												)}
											</View>
										</View>
									</Link>
								);
							})}
							<View style={notificationStyles.scrollBuffer}>
								<Text></Text>
							</View>
						</>
					) : null}
				</ScrollView>
			</View>
		</>
	);
}

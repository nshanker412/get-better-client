import { useAuth } from '@context/auth/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import * as ExpoNotifications from 'expo-notifications';
import React, { createContext, useCallback, useEffect, useReducer } from 'react';
import Toast from 'react-native-toast-message';
import { ApiLoadingState, UserData } from '../../types/types';
import {
	MyUserInfoAction,
	MyUserInfoContextProps,
	MyUserInfoProviderProps,
	MyUserInfoState,
	RESET_USER_INFO,
	SET_LOAD_USER_INFO_STATE,
	SET_LOAD_USER_PLANS_STATE,
	SET_SHOWN_INTRO_PAGE,
	SET_USER_INFO,
	SET_USER_PLANS,
	initialMyUserInfoState,
} from './MyUserInfo.types';

// Reducer function
const myUserInfoReducer = (
	state: MyUserInfoState,
	action: MyUserInfoAction,
): MyUserInfoState => {
	switch (action.type) {
		case SET_LOAD_USER_INFO_STATE:
			return {
				...state,
				loadUserInfoState: action.payload.loadUserInfoState,
			};
		case SET_USER_PLANS:
			return { ...state, plans: action.payload.plans };
		case SET_USER_INFO:
			return { ...state, ...action.payload };
		case SET_LOAD_USER_PLANS_STATE:
			return {
				...state,
				loadPlansState: action.payload.loadUserPlansState,
			};
		case SET_SHOWN_INTRO_PAGE:
			return { ...state, shownIntroPage: true };
		case RESET_USER_INFO:
			return initialMyUserInfoState;
		default:
			return state;
	}
};

export const MyUserInfoContext = createContext<
	MyUserInfoContextProps | undefined
>(undefined);

export const MyUserInfoProvider: React.FC<MyUserInfoProviderProps> = ({
	children,
}) => {
	const [state, dispatch] = useReducer(
		myUserInfoReducer,
		initialMyUserInfoState,
	);

	const { userToken } = useAuth();	

	useEffect(() => {
		const fetchUserInfo = async (token: string | null) => {
			if (token) {
				console.log('MyUserInfoProvider setting user info in use effect');
				try {
					const uname = await setMyUserInfo(token);
					console.log('MyUserInfoProvider: ', uname);
				} catch (error) {
					console.error('Error fetching user info:', error);
					dispatch({
						type: SET_LOAD_USER_INFO_STATE,
						payload: { loadUserInfoState: ApiLoadingState.Error },
					});
						Toast.show({
							type: 'error',
							text1: `Hmm.. There seems to be an issue: ${userToken}`,
							text2: 'Please try logging in again',
						});
					
				}
			
			} else {
				// Toast.show({
				// 	type: 'info',
				// 	text1: `MyuserinfoProvider: ${userToken}`,
				// 	text2: 'no user token found ',
				// });
				console.log('MyUserInfoProvider no user token', userToken);
				throw new Error('No user token found');
			}
		}
		fetchUserInfo(userToken);

	}, [userToken]);

	const scheduleDailyNotification = async () => {
		// Check if notification already scheduled
		const existingNotifications =
			await ExpoNotifications.getAllScheduledNotificationsAsync();

		// await ExpoNotifications.cancelAllScheduledNotificationsAsync();
		if (existingNotifications.length === 0) {
			// Schedule the notification if none are scheduled
			await ExpoNotifications.scheduleNotificationAsync({
				content: {
					title: 'Get Better',
					body: 'Did you get better today?',
				},
				trigger: {
					hour: 18,
					minute: 0,
					repeats: true,
				},
			});
		}
	};

	const registerForPushNotificationsAsync = async (username: string) => {
		const { status: existingStatus } =
			await ExpoNotifications.getPermissionsAsync();
		let finalStatus = existingStatus;

		if (existingStatus !== 'granted') {
			const { status } =
				await ExpoNotifications.requestPermissionsAsync();
			finalStatus = status;
		}

		if (finalStatus !== 'granted') {
			alert('Please enable notifications in your settings.');
			return;
		}

		const tokenSaved = await AsyncStorage.getItem('notificationToken');

		const projectId = Constants.expoConfig.extra.eas.projectId;
		const token = (await ExpoNotifications.getExpoPushTokenAsync({projectId: projectId})).data;
		if (tokenSaved !== token) {
			await AsyncStorage.setItem('notificationToken', token);
			console.log('New token ', token);

			axios
				.post(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notificationToken/save`,
					{
						username: username,
						token: token,
					},
				)
				.then((response) => {
					console.log('saveNotificationToken', response.data);
				})
				.catch((error) => {
					console.log('saveNotificationTokenError', error);
				});
		}

		return token;
	};

	/**
	 * Initializes the MyUserInfo after the user logs in
	 */

	const setMyUserInfo = async (email: string) => {
		dispatch({
			type: SET_LOAD_USER_INFO_STATE,
			payload: { loadUserInfoState: ApiLoadingState.Loading },
		});

		try {
			if (!email) {
				throw new Error('No email provided');
			}

			const usernameResponse = await axios.get<{ username: string }>(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetchUsername/${email}`,
			);
			const username = usernameResponse.data.username;

			// Initialize and register notifications
			await registerForPushNotificationsAsync(username);
			await scheduleDailyNotification();

			const userDataResponse = await axios.get<UserData>(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetch/${username}/${username}/True`,
			);
			const myData: UserData = userDataResponse.data;

			const notificationTokensResponse = await axios.get<{
				tokens: string[];
			}>(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notificationTokens/fetch/${username}`,
			);
			const notificationTokens = notificationTokensResponse.data.tokens;

			const hasPostedDailyResponse = await axios.get<{
				hasPosted: boolean;
			}>(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/hasPosted/${username}`,
			);
			const hasPostedDaily = hasPostedDailyResponse.data.hasPosted;

			// Dispatch SET_USER_INFO action with fetched data
			dispatch({
				type: SET_USER_INFO,
				payload: {
					...state,
					myData: myData,
					username: username,
					notificationTokens: notificationTokens,
					hasPostedDaily: hasPostedDaily,
				},
			});
			if (hasPostedDaily) {
				setShownIntroPage();
			}
			dispatch({
				type: SET_LOAD_USER_INFO_STATE,
				payload: { loadUserInfoState: ApiLoadingState.Loaded },
			});
			return Promise.resolve(username);
		} catch (error) {
			console.error('Error fetching user info:', error);
			// Handle the error as needed (e.g., show a user-friendly message)
			dispatch({
				type: SET_LOAD_USER_INFO_STATE,
				payload: { loadUserInfoState: ApiLoadingState.Error },
			});
			return Promise.reject(error);
		}
	};

	const fetchMyPlans = useCallback(async () => {
		try {
			dispatch({
				type: SET_LOAD_USER_PLANS_STATE,
				payload: { loadUserPlansState: ApiLoadingState.Loading },
			});
			const response = await axios.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/plans/fetch/${state.username}`,
			);
			dispatch({
				type: SET_USER_PLANS,
				payload: { ...state, plans: response?.data?.plans },
			});
			dispatch({
				type: SET_LOAD_USER_PLANS_STATE,
				payload: { loadUserPlansState: ApiLoadingState.Loaded },
			});
		} catch (error) {
			console.log('fetchMyPlansError', error);
			dispatch({
				type: SET_LOAD_USER_PLANS_STATE,
				payload: { loadUserPlansState: ApiLoadingState.Error },
			});
		}
	}, [state.username]);

	const logout = async () => {
		console.log('logout');
		// Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
		// remove locally stored feeds
		await AsyncStorage.removeItem('friendsFeed');
		await AsyncStorage.removeItem('publicFeed');
		await AsyncStorage.removeItem('profileFeed');
		await AsyncStorage.removeItem('profileImages');
		await AsyncStorage.removeItem('username');
		await AsyncStorage.removeItem('notificationToken');

		try {
			const projectId = Constants.expoConfig.extra.eas.projectId;
			console.log('projectId', projectId);
			const token = (await ExpoNotifications?.getExpoPushTokenAsync({projectId: projectId}))
				?.data;

			await axios
				.post(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notificationToken/remove`,
					{
						username: state.username,
						token: token,
					},
				)
				.then(async (response) => {
					console.log('removeNotificationToken', response.data);
				})
				.catch((error) => {
					console.log('removeNotificationTokenError', error);
				});
		} catch (e) {
			console.error('Error getting notification token', e);
		}
	};

	async function clearFileSystem() {
		try {
			const directoryUri = FileSystem.documentDirectory;

			if (directoryUri === null) {
				return;
			}
			// List all files and directories
			const files = await FileSystem.readDirectoryAsync(directoryUri);

			// Iterate and delete each
			await Promise.all(
				files.map(async (file) => {
					const fileUri = `${directoryUri}${file}`;
					await FileSystem.deleteAsync(fileUri);
				}),
			);

			console.log('File system cleared.');
		} catch (error) {
			console.error('Error clearing file system:', error);
		}
	}

	const onLogout = async () => {
		try {
			await logout();
		} catch (e) {
			console.error('Error logging out', e);
		}
		try {
			await clearFileSystem();
		} catch (e) {
			console.error('Error clearing file system', e);
		}
	};

	const setShownIntroPage = () => {
		dispatch({
			type: SET_SHOWN_INTRO_PAGE,
		});
	};

	const refreshMyUserInfo = async () => {
		dispatch({
			type: SET_LOAD_USER_INFO_STATE,
			payload: { loadUserInfoState: ApiLoadingState.Loading },
		});

		try {
			const userDataResponse = await axios.get<UserData>(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetch/${state.username}/${state.username}/True`,
			);
			const myData: UserData = userDataResponse.data;

			const hasPostedDailyResponse = await axios.get<{
				hasPosted: boolean;
			}>(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/hasPosted/${state.username}`,
			);
			const hasPostedDaily = hasPostedDailyResponse.data.hasPosted;

			// Dispatch SET_USER_INFO action with fetched data
			dispatch({
				type: SET_USER_INFO,
				payload: {
					...state,
					myData: myData,
					hasPostedDaily: hasPostedDaily,
				},
			});

			dispatch({
				type: SET_LOAD_USER_INFO_STATE,
				payload: { loadUserInfoState: ApiLoadingState.Loaded },
			});

			await fetchMyPlans();
		} catch (error) {
			console.error('Error fetching user info:', error);
			// Handle the error as needed (e.g., show a user-friendly message)
			dispatch({
				type: SET_LOAD_USER_INFO_STATE,
				payload: { loadUserInfoState: ApiLoadingState.Error },
			});
		}
	};

	const deletePost = async (postID: string) => {
		//1. confirm the post exists and its my post
		await axios
			.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/media/${state.username}/${postID}`,
			)
			.then(async (response) => {
				console.log('it exsists', response.data);
			})
			.catch((error) => {
				throw new Error('trying to delete a post that does not exist');
			});

		//2. delete the post
		await axios
			.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/delete/${state.username}/${postID}`,
			)
			.then(async (response) => {

				// REMOVE POST FROM FILE STORAGE
				const directoryUri = FileSystem.documentDirectory;
				const fileUri = `${directoryUri}${state.username}_${postID}.jpeg`;
				FileSystem?.getInfoAsync(fileUri).then(async ({ exists }) => {
					if (exists) {
						await FileSystem.deleteAsync(fileUri);
					}
				});
			})
			.catch((error) => {
				throw new Error('Error deleting post');
			})
			.finally(() => {
				console.log('done deleting now refreshing user info');
				refreshMyUserInfo();
			});

		//3. fetch to configm the post is deleted (may need to flush cache when configured)
		await axios
			.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/post/fetch/media/${state.username}/${postID}`,
			)
			.then(async (response) => {
				console.log('post deletion unsuccessful', response.data);
				Toast.show({
					type: 'error',
					text1: 'There was an issue deleting the post',
					text2: 'Please try again',
				});
			})
			.catch((error) => {
				console.log('Post does not exist', error);
				Toast.show({
					type: 'success',
					text1: 'Post successfully deleted!',
				});
				return;
			});
	};

	const contextValue: MyUserInfoContextProps = {
		...state,
		setMyUserInfo,
		onLogout,
		fetchMyPlans,
		refreshMyUserInfo,
		deletePost,
		setShownIntroPage,
	};

	return (
		<MyUserInfoContext.Provider value={contextValue}>
			{children}
		</MyUserInfoContext.Provider>
	);
};

import { useAuth } from '@context/auth/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import React, { createContext, useCallback, useEffect, useReducer } from 'react';
import Toast from 'react-native-toast-message';
import { ApiLoadingState, UserData } from '../../types/types';
import { FollowStatus, UpdateFollowForm, defaultContextValue } from './MyUserInfo.types';

import {
	MyUserInfoAction,
	MyUserInfoContextProps,
	MyUserInfoProviderProps,
	MyUserInfoState,
	RESET_USER_INFO,
	SET_LOAD_USER_INFO_STATE,
	SET_LOAD_USER_PLANS_STATE,
	SET_POSTS,
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
		case SET_POSTS:
			return { ...state, posts: action.payload.posts };
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
	MyUserInfoContextProps
>(defaultContextValue);

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

				console.log('MyUserInfoProvider no user token', userToken);
				console.log('No user token found');
			}
		}
		fetchUserInfo(userToken);
	}, [userToken]);

	

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
				console.log('No email provided');
			}

			const usernameResponse = await axios.get<{ username: string }>(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetchUsername/${email}`,
			);
			const username = usernameResponse.data.username;

			// Initialize and register notifications
			// await registerForPushNotificationsAsync(username);
			// await scheduleDailyNotification();

			const userDataResponse = await axios.get<UserData>(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetch/${username}/${username}/True`,
			);
			const myData: UserData = userDataResponse.data;

			// const notificationTokensResponse = await axios.get<{
			// 	tokens: string[];
			// }>(
			// 	`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notificationTokens/fetch/${username}`,
			// );
			// const notificationTokens = notificationTokensResponse.data.tokens;

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

	const fetchMyPlans = async () => {
		try {

			const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/v2/plans/fetch/${state.username}`);
			const plans = response.data?.plans;
			// only set state if there are new plans
			if (plans.length !== state.plans?.length) {
				dispatch({
					type: SET_USER_PLANS,
					payload: { plans: plans },
				});
			}
	
		
		} catch (error) {
			console.log('fetchMyPlansError', error);
	
		}
	}

	const deletePlan = async (planID: string) => {

		if (!state.username || !planID) {
			console.log('No username or planID provided');
			return;
		}
		try {

			await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/v2/plan/delete/${state.username}/${planID}`);

			await fetchMyPlans();
		
		} catch (error) {
			console.log('Error deleting plan', error);
	
		}
	}


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
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetch/${state.username}/${state.username}/False`,
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
			await fetchMyPosts();
		} catch (error) {
			console.error('Error fetching user info:', error);
			// Handle the error as needed (e.g., show a user-friendly message)
			dispatch({
				type: SET_LOAD_USER_INFO_STATE,
				payload: { loadUserInfoState: ApiLoadingState.Error },
			});
		}
	};

	const deletePost = async (postID: string): Promise<void> => {
		//1. confirm the post exists and its my post


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
				console.log('Error deleting post');
			})
			.finally(() => {
				console.log('done deleting now refreshing user info');
				refreshMyUserInfo();
			});
		
	};

	const fetchMyPosts = async (): Promise<void> => {
		if (!state.username) {
			console.log('No username provided');
			return;
		}
		try {
			const response = await axios.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetch/posts/${state.username}`,
			);

			// only set state if there are new posts

			const newPosts = response?.data?.posts;
			// compare the lists and only set state if there are new posts
			if (newPosts.length !== state.posts?.length) {
				dispatch({
					type: SET_POSTS,
					payload: { posts: newPosts },
				});
			}
		} catch (error) {
			console.log('fetchMyposts', error);
		}
	}

	const fetchSocialConnections = async () => {
		try {
			const response = await axios.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/v2/user/fetch/social/${state.username}`,
			);
			return response.data;
		} catch (error) {
			console.log('fetchSocial', error);
		}
	}


	const fetchIsFollowing = async (amIFollowingThisPerson: string): Promise<boolean> => {
		if (!state.username) {
			console.log('No username provided');
			return false;
		}

		if (amIFollowingThisPerson === state.username) {
			return false;
		}

		console.log(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/v2/user/isFollowing/${state.username}/${amIFollowingThisPerson}`)


		try {
			const response = await axios.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/v2/user/isFollowing/${state.username}/${amIFollowingThisPerson}`,
			);
			return response.data.isFollowing;
		} catch (error) {
			console.log('onCheckIfFollowing', error);
			return false;
		}
	}


	
	const updateFollowStatus = useCallback(async (userToFollowOrUnfollow: string, newFollowStatus: FollowStatus): Promise<boolean | void> => {
		if (!state.username) {
			console.log('No username provided');
			return;
		}
		try {
			// create the form data
			
			const form: UpdateFollowForm = {
				newFollowStatus: newFollowStatus,
				usernameToFollowOrUnfollow: userToFollowOrUnfollow,
				myUsername: state.username!
			};

			const formD = new FormData();
			formD.append('newFollowStatus', newFollowStatus);
			formD.append('usernameToFollowOrUnfollow', userToFollowOrUnfollow);

			formD.append('myUsername', state.username!);
	

			console.log('updateFollowStatus', form);

			const response = await axios.post(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/v2/user/update/following`,
				formD,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				}
			);
			console.log('onChangeFollowStatus', response.data);

			

			return response.data?.isFollowing;
		} catch (error) {
			console.log('onChangeFollowStatus', error);
		}
	}, [state.username]);


	const contextValue: MyUserInfoContextProps = {
		...state,
		setMyUserInfo,
		onLogout,
		fetchIsFollowing,
		fetchMyPlans,
		updateFollowStatus,
		fetchSocialConnections,
		refreshMyUserInfo,
		deletePost,
		setShownIntroPage,
		fetchMyPosts,
		deletePlan
	};

	return (
		<MyUserInfoContext.Provider value={contextValue}>
			{children}
		</MyUserInfoContext.Provider>
	);
};

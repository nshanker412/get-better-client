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

	const setMyUserInfo = async (auth_token: string) => {
		dispatch({
			type: SET_LOAD_USER_INFO_STATE,
			payload: { loadUserInfoState: ApiLoadingState.Loading },
		});

		try {
			if (!auth_token) {
				console.log('No email provided');
			}
			// {
			// 	"bio": "",
			// 	"challengesComplete": 0,
			// 	"consistency": 2,
			// 	"followers": 0,
			// 	"following": 0,
			// 	"isFollowing": false,
			// 	"name": "Kunal"
			// 	}
			// Initialize and register notifications
			// await registerForPushNotificationsAsync(username);
			// await scheduleDailyNotification();

			const userDataResponse = await axios.get<UserData>(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me`,{ headers: {"Authorization" : `Bearer ${auth_token}`} }
			);
			const myData: UserData = userDataResponse.data;
			// const notificationTokensResponse = await axios.get<{
			// 	tokens: string[];
			// }>(
			// 	`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notificationTokens/fetch/${username}`,
			// );
			// const notificationTokens = notificationTokensResponse.data.tokens;

			const hasPostedDailyResponse = await axios.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/post`,{ headers: {"Authorization" : `Bearer ${auth_token}`} }
			);
			const posts = hasPostedDailyResponse.data["results"]
			let hasPostedDaily = false;
			if(posts){
				hasPostedDaily = true
			}

			// Dispatch SET_USER_INFO action with fetched data
			dispatch({
				type: SET_USER_INFO,
				payload: {
					...state,
					myData: myData["profile"],
					username: myData["username"],
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
			return Promise.resolve(myData["username"]);
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

			const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/plan`,{ headers: {"Authorization" : `Bearer ${userToken}`}}

			);;
			const plans = response.data?.results;
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


	const setRelationship = async (isFollowing: boolean) => {
		dispatch({
			type: SET_USER_INFO,
			payload: {
				myData: {
					...state.myData,
					isFollowing: isFollowing,
				},
			},
		});
	}

	const refreshMyUserInfo = async () => {
		dispatch({
			type: SET_LOAD_USER_INFO_STATE,
			payload: { loadUserInfoState: ApiLoadingState.Loading },
		});

		try {
			const userDataResponse = await axios.get<UserData>(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me`,{ headers: {"Authorization" : `Bearer ${userToken}`,'Content-Type': 'multipart/form-data'}},
			);
			const myData: UserData = userDataResponse.data;

			const hasPostedDailyResponse = await axios.get<{
				hasPosted: boolean;
			}>(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
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
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/post?search=${state.username}`,{ headers: {"Authorization" : `Bearer ${userToken}`,'Content-Type': 'multipart/form-data'}},
			);

			// only set state if there are new posts

			const newPosts = response?.data?.results;
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

		console.log(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/v2/user/isfollowing/${state.username}/${amIFollowingThisPerson}`)


		try {
			const response = await axios.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/v2/user/isfollowing/${state.username}/${amIFollowingThisPerson}`,
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
		setRelationship,
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

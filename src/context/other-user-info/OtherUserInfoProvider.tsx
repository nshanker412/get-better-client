import { ApiLoadingState, UserData } from '../../types';

import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { NotificationType, PushNotificationInfoPacket } from '@context/notifications/Notifications.types';
import { useNotifications } from '@context/notifications/useNotifications';
import axios from 'axios';
import React, {
	createContext,
	useCallback,
	useEffect,
	useReducer,
} from 'react';
import {
	OtherUserInfoAction,
	OtherUserInfoContextProps,
	OtherUserInfoProviderProps,
	OtherUserInfoState,
	RESET_USER_INFO,
	SET_FOLLOW_STATUS,
	SET_LOAD_CHALLENGE_USER_STATE,
	SET_LOAD_FOLLOW_STATUS_STATE,
	SET_LOAD_USER_INFO_STATE,
	SET_LOAD_USER_PLANS_STATE,
	SET_POSTS,
	SET_USER_INFO,
	SET_USER_PLANS,
	defaultContextValue,
	initialOtherUserInfoState,
} from './OtherUserInfo.types';


const otherUserInfoReducer = (
	state: OtherUserInfoState,
	action: OtherUserInfoAction,
): OtherUserInfoState => {
	switch (action.type) {
		case SET_LOAD_USER_INFO_STATE:
			return {
				...state,
				loadUserInfoState: action.payload.loadUserInfoState,
			};
		case SET_USER_PLANS:
			return { ...state, plans: action.payload.plans };
		case SET_USER_INFO:
			return {
				...state,
				userData: action.payload.userData,
				username: action.payload.username,
			};
		case SET_LOAD_USER_PLANS_STATE:
			return {
				...state,
				loadPlansState: action.payload.loadUserPlansState,
			};
		case SET_FOLLOW_STATUS:
			return {
				...state,
				userData: {
					...state.userData,
					followers: action.payload.followers,
				},
			};
		case SET_LOAD_FOLLOW_STATUS_STATE:
			return {
				...state,
				loadFollowStatusState: action.payload.loadFollowStatusState,
			};

		case SET_LOAD_CHALLENGE_USER_STATE:
			return {
				...state,
				loadChallengeUserState: action.payload.loadChallengeUserState,
			};
		case SET_POSTS:
			return {
					...state,
					posts: action.payload.posts,
				};

		case RESET_USER_INFO:
			return initialOtherUserInfoState;

		default:
			return state;
	}
};




export const OtherUserInfoContext = createContext<
	OtherUserInfoContextProps
>(defaultContextValue);

export const OtherUserInfoProvider: React.FC<OtherUserInfoProviderProps> = ({
	otherProfileUsername,
	children,
}) => {

	const { sendOutPushNotification } = useNotifications();
	const { username: myUsername } = useMyUserInfo();

	const [state, dispatch] = useReducer(otherUserInfoReducer, {
		...initialOtherUserInfoState,
		username: otherProfileUsername,
		myUsername: myUsername,
		posts: [],
		plans: [],
	});

	/**
	 * Initializes the OtherUserInfo after the user logs in
	 */
	const setOtherUserInfo = useCallback(
		async (myUsername: string, otherProfileUsername: string) => {
			dispatch({
				type: SET_LOAD_USER_INFO_STATE,
				payload: { loadUserInfoState: ApiLoadingState.Loading },
			});

			try {
				const userDataResponse = await axios.get<UserData>(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetch/${otherProfileUsername}/${myUsername}/True`,
				);
				const userData: UserData = userDataResponse.data;

				// Dispatch SET_USER_INFO action with fetched data
				dispatch({
					type: SET_USER_INFO,
					payload: {
						userData: userData,
						username: otherProfileUsername,
					},
				});
			} catch (error) {
				console.error('Error fetching user info:', error);
				// Handle the error as needed (e.g., show a user-friendly message)
				dispatch({
					type: SET_LOAD_USER_INFO_STATE,
					payload: { loadUserInfoState: ApiLoadingState.Error },
				});
			} finally {
				dispatch({
					type: SET_LOAD_USER_INFO_STATE,
					payload: { loadUserInfoState: ApiLoadingState.Loaded },
				});
			}
		},
		[state.username],
	);

	useEffect(() => {
		setOtherUserInfo(myUsername, otherProfileUsername);
		// nullify state on unmount
		return () => dispatch({ type: RESET_USER_INFO });
	}, [myUsername, otherProfileUsername]);

	const fetchUserPlans = useCallback(async () => {
		try {
			dispatch({
				type: SET_LOAD_USER_PLANS_STATE,
				payload: { loadUserPlansState: ApiLoadingState.Loading },
			});
			const response = await axios.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/v2/plans/fetch/${state.username}`,
			);
			dispatch({
				type: SET_USER_PLANS,
				payload: { plans: response?.data?.plans },
			});
			dispatch({
				type: SET_LOAD_USER_PLANS_STATE,
				payload: { loadUserPlansState: ApiLoadingState.Loaded },
			});
		} catch (error) {
			console.log('fetchOtherUsersPlansError', error);
			dispatch({
				type: SET_LOAD_USER_PLANS_STATE,
				payload: { loadUserPlansState: ApiLoadingState.Error },
			});
		}
	}, [state.username]);

	const setFollowStatus = async (myUsername?: string) => {
		if (!state.username || !myUsername) {
			console.log(
				'ERROR Setting follow status: no profile username or myUsername provided',
			);
			return;
		}
		console.log('setFollowStatus', state.username, state.myUsername);

		const previouslyFollowing = state.userData?.isFollowing;

		console.log(
			'setFollowStatus',
			state.username,
			state.myUsername,
			previouslyFollowing,
		);
		dispatch({
			type: SET_LOAD_FOLLOW_STATUS_STATE,
			payload: { loadFollowStatusState: ApiLoadingState.Loading },
		});

		try {
			const followers = (
				await axios.post(
					`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/follow`,
					{
						following: !previouslyFollowing,
						recievingUser: state.username,
						sendingUser: myUsername,
					},
				)
			).data.followers;

			dispatch({
				type: SET_FOLLOW_STATUS,
				payload: { followers: followers },
			});
		} catch (error) {
			console.error('setFollowStatusError', error);
			return;
		}

		if (!previouslyFollowing) {

			try {
				const notifPacket: PushNotificationInfoPacket = {
					title: `${myUsername} started motivating you.`,
					body: 'Check out their profile!',
					data: {
						type: NotificationType.FOLLOWED,
						path: 'notifications',
						params: {
							profileUsername: state.username,
						},
					},
				};

				sendOutPushNotification(state.username, notifPacket);
		
			} catch (error) {
				console.error('setFollowStatusError', error);
			}
		}

		dispatch({
			type: SET_LOAD_FOLLOW_STATUS_STATE,
			payload: { loadFollowStatusState: ApiLoadingState.Loaded },
		});
	};

	/**
	 * Send a challenge to the user and notify them
	 * Heuristic:
	 * 1. Make sure we have the necessary data to send the challenge
	 * 2. Submit the challenge to the server
	 * 3. Send notification to user
	 *  a. Fetch user notification tokens
	 *  b. Send the challenge notification to the user across all devices
	 * Note: Should return failure only for 1 or 2
	 *
	 * @param challengeText
	 * @param myUsername
	 * @returns
	 */
	const challengeUser = async (challengeText: string, myUsername: string) => {
		console.log(
			'in challengeUser',
			challengeText,
			myUsername,
			state.username,
		);

		// 1. Make sure we have the necessary data to send the challenge
		if (!state.username || !myUsername) {
			console.log(
				'ERROR challenging user: no profile username or myUsername provided',
				state.username,
				myUsername,
			);
			console.log(
				'ERROR challenging user: no profile username or myUsername provided',
			);
			dispatch({
				type: SET_LOAD_CHALLENGE_USER_STATE,
				payload: { loadChallengeUserState: ApiLoadingState.Error },
			});
			return;
		}
		if (challengeText == '') {
			console.log('ERROR: Input instructions for the challenge.');
			dispatch({
				type: SET_LOAD_CHALLENGE_USER_STATE,
				payload: { loadChallengeUserState: ApiLoadingState.Error },
			});
			return;
		}

		try {
			// 2. Submit the challenge to the server
			console.log('pre 2');
			const resp = await axios.post(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/notifications/addChallenge`,
				{
					recievingUser: state.username,
					sendingUser: myUsername,
					challenge: challengeText,
				},
			);
			console.log('post 2', resp.data);
		} catch (error) {
			console.error('challengeUserError', error, error?.message);
			return Promise.reject(error);
		}

		console.log("sending notificaiton to the user's devices");
		
		// 3. Send notification to user

		try {

		const notifPacket: PushNotificationInfoPacket = {
			title: `${myUsername} challenged you!`,
			body: 'You have 1 week. Tap here to see the challenge!',
			data: {
				type: NotificationType.CHALLENGED,
				path: 'notifications',
				params: {
					profileUsername: state.username,
					challenge: challengeText,
				},
			},
		};

			sendOutPushNotification(state.username, notifPacket);
			


			return Promise.resolve();
		} catch (error) {
			console.error('setFollowStatusError', error);
		}
	};


	const fetchUserPosts = async (): Promise<void> => {
		console.log("IN OTHER USER FETCHING PLANS")

		if (!state.username) {
			console.log('ERROR fetchUserPosts: No profile username provided');
			return;
		}

		try {
			const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetch/posts/${state.username}`);

			const newPosts = resp?.data?.posts;
			// compare the lists and only set state if there are new posts
			if (newPosts.length !== state.posts?.length) {
				dispatch({
					type: SET_POSTS	,
					payload: {
						posts: newPosts,

					},
				});
			}
			console.log('fetchUserPosts', resp.data);

		} catch (error) {
			console.log('fetchUserPostsError', error);
		}
			
	};


	const contextValue: OtherUserInfoContextProps = {
		...state,
		userData: state.userData,
		plans: state.plans,

		setOtherUserInfo,
		fetchUserPlans,
		fetchUserPosts,
		setFollowStatus,
		challengeUser,
	};

	return (
		<OtherUserInfoContext.Provider value={contextValue}>
			{children}
		</OtherUserInfoContext.Provider>
	);
};

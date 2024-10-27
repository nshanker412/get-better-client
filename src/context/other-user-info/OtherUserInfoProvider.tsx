import { ApiLoadingState, UserData } from '../../types';
import { useAuth } from '@context/auth/useAuth';

import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { NotificationType, PushNotificationInfoPacket } from '@context/notifications/Notifications.types';
import { useNotifications } from '@context/notifications/useNotifications';
import axios from 'axios';
import React, {
	createContext,
	useCallback,
	useEffect,
	useReducer
} from 'react';
import {
	OtherUserInfoAction,
	OtherUserInfoContextProps,
	OtherUserInfoProviderProps,
	OtherUserInfoState,
	RESET_USER_INFO,
	SET_FOLLOW_STATUS,
	SET_LOAD_CHALLENGE_USER_STATE,
	SET_LOAD_REPORT_POST_STATE,
	SET_LOAD_USER_INFO_STATE,
	SET_LOAD_USER_PLANS_STATE,
	SET_POSTS,
	SET_USER_INFO,
	SET_USER_PLANS,
	defaultContextValue,
	initialOtherUserInfoState
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
				otherUserData: action.payload.otherUserData,
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
				otherUserData: {
					...state.otherUserData,
					followers: action.payload.followers,
					following: action.payload.following,
				},
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
	const { username: myUsername, refreshMyUserInfo, setRelationship } = useMyUserInfo();
	const {userToken} =useAuth();


	const [state, dispatch] = useReducer(otherUserInfoReducer, {
		...initialOtherUserInfoState,
		username: otherProfileUsername,
		posts: [],
		plans: [],
	});


	useEffect(() => {
		if (otherProfileUsername) {
			setOtherUserInfo();
		}
	}, [otherProfileUsername]);


	/**
	 * Initializes the OtherUserInfo after the user logs in
	 */
	const setOtherUserInfo = async () => {
		dispatch({
			type: SET_LOAD_USER_INFO_STATE,
			payload: { loadUserInfoState: ApiLoadingState.Loading },
		});

		try {
			console.log('fetching user info:', otherProfileUsername, myUsername);
			const userDataResponse = await axios.get<UserData>(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/users?search=${otherProfileUsername}`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
				

			);
			const otherUserData: UserData = userDataResponse.data["results"][0];


			// // Dispatch SET_USER_INFO action with fetched data
			dispatch({
				type: SET_USER_INFO,
				payload: {
					otherUserData: otherUserData,
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
	}

	const fetchUserPlans = useCallback(async () => {
		try {
			dispatch({
				type: SET_LOAD_USER_PLANS_STATE,
				payload: { loadUserPlansState: ApiLoadingState.Loading },
			});
			const response = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/plan?search=${otherProfileUsername}`,{ headers: {"Authorization" : `Bearer ${userToken}`}}

			);
			dispatch({
				type: SET_USER_PLANS,
				payload: { plans: response?.data?.results },
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

	

	const setFollowStatus = async () => {
		if (!state.username || !myUsername) {
			console.log(
				'ERROR Setting follow status: no profile username or myUsername provided',
			);
			return;
		}

		const previouslyFollowing = state.otherUserData?.isFollowing;
		console.log(state.otherUserData);
		
		console.log("dada",{
			following: !previouslyFollowing,
			recievingUser: state.username, 
			followed_by: myUsername, 
		});
		
		try {
			const resp = await axios.post(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me/update_follower_following`,
				{
					is_following: !previouslyFollowing,
					followering_user_name: state.username, 
					follower_user_name: myUsername, 
				},
				{ headers: {"Authorization" : `Bearer ${userToken}`}}
			);


			console.log('setFollowStatus', resp.data);

			// update the follow status in the context


			dispatch({
				type: SET_USER_INFO,
				payload: { 
					...state,
					username: state.username,
					otherUserData: {
						...state.otherUserData,
						isFollowing: resp?.data?.isFollowing,
						followers: resp?.data?.followers,
						following: resp?.data?.following,
					},
				},
			});

			refreshMyUserInfo(resp?.data?.isFollowing);

		} catch (error) {
			console.error('setFollowStatusError', error);
			return;
		}

		if (!previouslyFollowing && myUsername !== otherProfileUsername) {

			try {
				const notifPacket: PushNotificationInfoPacket = {
					title: `${myUsername} started motivating you.`,
					body: 'Check out their profile!',
					data: {
						type: NotificationType.FOLLOWED,
						path: 'notifications',
						params: {
							profileUsername: myUsername,
						},
					},
				};

				sendOutPushNotification(state.username, notifPacket);
		
			} catch (error) {
				console.error('setFollowStatusError', error);
			}
		}


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
			console.log("sd",state.username);
			console.log("myUsername",myUsername);
			
			const resp1 = await axios.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/users?search=${state.username}`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
				
		  
			  );
			const resp2 = await axios.get(
			`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/users?search=${myUsername}`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
			
		
			);
			const resp = await axios.post(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/challenge`,
				{
					challenged_to: resp1.data["results"][0]["profile_id"],
					challenged_by: resp2.data["results"][0]["profile_id"],
					content: challengeText,
				},
				{ headers: {"Authorization" : `Bearer ${userToken}`}}
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

/**
	 * Send a reportPost to the user and notify them
	 * Heuristic:
	 * 1. Make sure we have the necessary data to send the reportPost
	 * 2. Submit the reportPost to the server
	 * 3. Send notification to user
	 *  a. Fetch user notification tokens
	 *  b. Send the reportPost notification to the user across all devices
	 * Note: Should return failure only for 1 or 2
	 *
	 * @param reportPostText
	 * @param myUsername
	 * @returns
	 */
const reportPost = async (reportPostText: string, myUsername: string) => {
	console.log(
		'in reportPost',
		reportPostText,
		myUsername,
		state.username,
	);

	// 1. Make sure we have the necessary data to send the challenge
	if (!state.username || !myUsername) {
		console.log(
			'ERROR report user: no profile username or myUsername provided',
			state.username,
			myUsername,
		);
		console.log(
			'ERROR report user: no profile username or myUsername provided',
		);
		dispatch({
			type: SET_LOAD_REPORT_POST_STATE,
			payload: { loadReportPostState: ApiLoadingState.Error },
		});
		return;
	}
	if (reportPostText == '') {
		console.log('ERROR: Input instructions for the report.');
		dispatch({
			type: SET_LOAD_REPORT_POST_STATE,
			payload: { loadReportPostState: ApiLoadingState.Error },
		});
		return;
	}

	try {
		// 2. Submit the challenge to the server
		console.log('pre 2');
		const resp1 = await axios.get(
			`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/users?search=${state.username}`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
			
	  
		  );
		const resp2 = await axios.get(
		`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/users?search=${myUsername}`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
		
	
		);
		const resp = await axios.post(
			`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/report`,
			{
				challenged_to: resp1.data["results"][0]["profile_id"],
				challenged_by: resp2.data["results"][0]["profile_id"],
				content: reportPostText,
			},
			{ headers: {"Authorization" : `Bearer ${userToken}`}}
		);
		console.log('post 2', resp.data);
	} catch (error) {
		console.error('reportPostError', error, error?.message);
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
				challenge: reportPostText,
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
			const resp = await axios.get(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/post?published_by__username=${state.username}`,{ headers: {"Authorization" : `Bearer ${userToken}`}});

			const newPosts = resp?.data?.results;
			// compare the lists and only set state if there are new posts
			if (newPosts.length !== state.results?.length) {
				dispatch({
					type: SET_POSTS	,
					payload: {
						posts: newPosts,

					},
				});
			}

		} catch (error) {
			console.log('fetchUserPostsError', error);
		}
			
	};


	const contextValue: OtherUserInfoContextProps = {
		...state,
		otherUserData: state.otherUserData,
		plans: state.plans,

		setOtherUserInfo,
		fetchUserPlans,
		fetchUserPosts,
		setFollowStatus,
		challengeUser,
		reportPost,
	};

	return (
		<OtherUserInfoContext.Provider value={contextValue}>
			{children}
		</OtherUserInfoContext.Provider>
	);
};

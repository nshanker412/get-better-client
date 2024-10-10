import { Post } from '@models/posts';
import { ReactNode } from 'react';
import { ApiLoadingState, UserData } from '../../types';

export interface OtherUserInfoProviderProps {
	otherProfileUsername: string;
	children: ReactNode;
}

export type OtherUserInfoState = {
	loadUserInfoState: ApiLoadingState;
	username: string | null;
	otherUserData: UserData | null;
	loadPlansState: ApiLoadingState;
	plans: Array<any> | [];
	posts: Post[] | [];
};

export interface OtherUserInfoContextProps extends OtherUserInfoState {
	setOtherUserInfo: (
		myUsername: string,
		otherProfileUsername: string,
	) => void;
	fetchUserPlans: () => Promise<void>;
	setFollowStatus: () => Promise<void>;
	challengeUser: (challengeText: string, myUsername: string) => Promise<void>;
	reportPost: (reportPostText: string, myUsername: string) => Promise<void>;
	fetchUserPosts: () => Promise<void>;
}

// Define action types
export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_USER_PLANS = 'SET_USER_PLANS';
export const RESET_USER_INFO = 'RESET_USER_INFO';
export const SET_LOAD_USER_INFO_STATE = 'SET_LOAD_USER_INFO_STATE';
export const SET_LOAD_USER_PLANS_STATE = 'SET_LOAD_USER_PLANS_STATE';
export const SET_FOLLOW_STATUS = 'SET_FOLLOW_STATUS';
export const SET_LOAD_FOLLOW_STATUS_STATE = 'SET_LOAD_FOLLOW_STATUS_STATE';
export const SET_LOAD_CHALLENGE_USER_STATE = 'SET_LOAD_CHALLENGE_USER_STATE';
export const SET_LOAD_REPORT_POST_STATE = 'SET_LOAD_REPORT_POST_STATE';
export const SET_POSTS = 'SET_POSTS';

// Define action interfaces
export interface SetLoadUserInfoStateAction {
	type: typeof SET_LOAD_USER_INFO_STATE;
	payload: { loadUserInfoState: ApiLoadingState };
}

export interface SetUserInfoAction {
	type: typeof SET_USER_INFO;
	payload: {
		username: string | null;
		otherUserData: UserData;
	};
}

export interface ResetUserInfoAction {
	type: typeof RESET_USER_INFO;
}

export interface SetUserPlansAction {
	type: typeof SET_USER_PLANS;
	payload: { plans: Array<any> };
}

export interface SetLoadUserPlansStateAction {
	type: typeof SET_LOAD_USER_PLANS_STATE;
	payload: { loadUserPlansState: ApiLoadingState };
}

export interface SetFollowStatusAction {
	type: typeof SET_FOLLOW_STATUS;
	payload: { followers: number, following: number};
}


export interface SetLoadChallengeUserState {
	type: typeof SET_LOAD_CHALLENGE_USER_STATE;
	payload: { loadChallengeUserState: ApiLoadingState };
}
export interface SetLoadReportPostState {
	type: typeof SET_LOAD_REPORT_POST_STATE;
	payload: { loadReportPostState: ApiLoadingState };
}
export interface SetPostsAction {
	type: typeof SET_POSTS;
	payload: { posts: Post[] | [] };
}

export type OtherUserInfoAction =
	| SetUserInfoAction
	| ResetUserInfoAction
	| SetUserPlansAction
	| SetLoadUserInfoStateAction
	| SetLoadUserPlansStateAction
	| SetFollowStatusAction
	| SetLoadChallengeUserState
	| SetLoadReportPostState
	| SetPostsAction;

export const initialOtherUserInfoState: OtherUserInfoState = {
	loadUserInfoState: ApiLoadingState.Idle,
	loadPlansState: ApiLoadingState.Idle,
	username: null,
	otherUserData: null,
	plans: [],
	posts: []
};

export const defaultContextValue: OtherUserInfoContextProps = {
	...initialOtherUserInfoState,
	setOtherUserInfo: () => {},
	fetchUserPlans: () => Promise.resolve(),
	setFollowStatus: () => Promise.resolve(),
	challengeUser: () => Promise.resolve(),
	fetchUserPosts: () => Promise.resolve(),
	reportPost:() => Promise.resolve(),
};
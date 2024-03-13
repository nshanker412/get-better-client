import { ReactNode } from 'react';
import { ApiLoadingState, UserData } from '../../types';

export interface MyUserInfoProviderProps {
	children: ReactNode;
}

export type MyUserInfoState = {
	loadUserInfoState: ApiLoadingState;
	username: string | null;
	email: string | null;
	hasPostedDaily: boolean | null;
	myData: UserData | null;
	loadPlansState: ApiLoadingState;
	plans: Array<any> | null;
	shownIntroPage: boolean;
};

export interface MyUserInfoContextProps extends MyUserInfoState {
	setMyUserInfo: (email: string) => Promise<string>;
	fetchMyPlans: () => void;
	onLogout: () => Promise<void>;
	setShownIntroPage: () => void;
	deletePost: (postID: string) => Promise<void>;
	refreshMyUserInfo: () => void;
	
}

// Define action types
export const SET_USER_INFO = 'SET_USER_INFO';
export const SET_USER_PLANS = 'SET_USER_PLANS';
export const RESET_USER_INFO = 'RESET_USER_INFO';
export const SET_LOAD_USER_INFO_STATE = 'SET_LOAD_USER_INFO_STATE';
export const SET_LOAD_USER_PLANS_STATE = 'SET_LOAD_USER_PLANS_STATE';
export const SET_SHOWN_INTRO_PAGE = 'SET_SHOWN_INTRO_PAGE';

// Define action interfaces
export interface SetLoadUserInfoStateAction {
	type: typeof SET_LOAD_USER_INFO_STATE;
	payload: { loadUserInfoState: ApiLoadingState };
}

export interface SetUserInfoAction {
	type: typeof SET_USER_INFO;
	payload: {
		username: string | null;
		email: string | null;
		hasPostedDaily: boolean | null;
		myData: UserData;
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

export interface SetShownIntroPageAction {
	type: typeof SET_SHOWN_INTRO_PAGE;
}

export type MyUserInfoAction =
	| SetUserInfoAction
	| ResetUserInfoAction
	| SetUserPlansAction
	| SetLoadUserInfoStateAction
	| SetShownIntroPageAction
	| SetLoadUserPlansStateAction;

/** TODO
 * 1. optimize subsequent load speed by caching other profiles on changes
 */
export const initialMyUserInfoState: MyUserInfoState = {
	loadUserInfoState: ApiLoadingState.Idle,
	username: null,
	email: null,
	hasPostedDaily: null,
	myData: null,
	loadPlansState: ApiLoadingState.Idle,
	plans: null,
	shownIntroPage: false,
};

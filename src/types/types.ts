/**
 * Type for Dot scroll in PagerView
 */

export type NativeEvent = {
	nativeEvent: {
		offset: number;
		position: number;
	};
};

/**
 * Profile - User Stats Types
 * @description - The user stats displayed in the stats container in profile
 * @param {string} consistency - The consistency of the user
 */

export type UserStatType = number | '-';

export type UserStats = {
	consistency: UserStatType;
	completedChallenges: UserStatType;
	numberOfPlans: UserStatType;
};

/**
 * App State management types
 * @description - The user stats displayed in the stats container in profile
 * @param {string} consistency - The consistency of the user
 */

export type Notification = {
	id: string;
	title: string;
	body: string;
	read: boolean;
	date: Date;
};

export interface UserData {
	bio: string | null;
	challengesComplete: number | null;
	consistency: number | null;
	followers: number | null;
	following: number | null;
	isFollowing: boolean | null;
	name: string | null;
	profileImage: string | null;
}

export interface MyUserInfo extends UserData {
	loading: boolean;
	username: string | null;
	email: string | null;
	hasPostedDaily: boolean | null;
	notificationTokens: string[] | null;
	unreadNotifications: string[] | null;
}

export enum ApiLoadingState {
	Idle = 'Idle',
	Loading = 'Loading',
	Loaded = 'Loaded',
	Error = 'Error',
}

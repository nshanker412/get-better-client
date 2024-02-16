import { AxiosError, AxiosResponse } from 'axios';

export interface ApiServiceInterface {
	registerUser(
		email: string,
		name: string,
		username: string,
	): Promise<AxiosResponse | AxiosError>;
	fetchUsername(email: string): Promise<AxiosResponse | AxiosError>;
	checkHasPosted(username: string): Promise<boolean>;
	saveNotificationToken(username: string, token: string): Promise<void>;
	fetchFriendsPosts(myUsername: string): Promise<any>;
	fetchPublicPosts(myUsername: string): Promise<any>;
	updatePostLike(
		profileUsername: string,
		postID: string,
		myUsername: string,
		status: boolean,
	): Promise<void>;
	fetchPostComments(profileUsername: string, postID: string): Promise<any>;
	fetchPostLikes(
		profileUsername: string,
		postID: string,
		myUsername: string,
	): Promise<any>;
	fetchPostMedia(
		profileUsername: string,
		postID: string,
		type?: string,
	): Promise<string>;
	fetchProfileImage(profileUsername: string): Promise<string>;
	fetchLeaderboard(
		leaderboardMetric: string,
		myUsername: string,
		isFriendsFeed: boolean,
		limit: number,
	): Promise<any[]>;
	searchByUsername(
		profileUsername: string,
		relationship: string,
		keyword?: string,
	): Promise<any[]>;
	removeNotificationToken(myUsername: string, token: string): Promise<void>;
	fetchUserProfile(
		profileUsername: string,
		myUsername: string,
	): Promise<void>;
	setFollowStatus(
		following: boolean,
		profileUsername: string,
		myUsername: string,
	): Promise<void>;
	addChallengeNotification(
		profileUsername: string,
		myUsername: string,
		challengeText: string,
	): Promise<void>;
	fetchConnectedStatsList(
		profileUsername: string,
		myUsername: string,
	): Promise<void>;
	fetchConnectedBody(profileUsername: string): Promise<void>;
	fetchProfilePlan(profileUsername: string, planID: string): Promise<void>;
	likePost(
		profileUsername: string,
		postID: string,
		myUsername: string,
		status: boolean,
	): Promise<void>;
	addComment(
		profileUsername: string,
		postID: string,
		myUsername: string,
		content: string,
	): Promise<void>;
	fetchConnectedPosts(profileUsername: string): Promise<void>;
	savePost(formData: FormData): Promise<void>;
	completeChallenge(
		myUsername: string,
		challengeUsername: string,
		challengeID: string,
	): Promise<void>;
	savePlan(
		formData: FormData,
		setLoading: (value: boolean) => void,
		navigate: (path: string) => void,
	): Promise<void>;
}

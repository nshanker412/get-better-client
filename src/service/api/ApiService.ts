import axios, { AxiosError, AxiosResponse } from 'axios';
import * as FileSystem from 'expo-file-system';
import { ApiServiceInterface } from './ApiService.types';

/**
 * Service Class for GetBetterService API calls
 */
class ApiService implements ApiServiceInterface {
	private readonly baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	/**************************************************************************
	 * @Login API calls
	 **************************************************************************/

	/**
	 * Register a new user
	 */
	public async registerUser(
		email: string,
		name: string,
		username: string,
	): Promise<AxiosResponse | AxiosError> {
		try {
			const response = await axios.post(`${this.baseUrl}/api/auth/register`, {
				email,
				name,
				username,
			});

			// Handle success
			console.log('Signup successful:', response.data);

			return response;
		} catch (error) {
			// Handle errors
			console.error('Registration failed:', error);

			throw error;
		}
	}

	/**
	 * Login with user email
	 */
	public async fetchUsername(
		email: string,
	): Promise<AxiosResponse | AxiosError> {
		return axios.get(`${this.baseUrl}/user/fetchUsername/${email}`);
	}

	/**************************************************************************
	 * @AppContext API calls
	 **************************************************************************/

	/**
	 * Check if a user has posted
	 */
	public async checkHasPosted(username: string): Promise<boolean> {
		try {
			const response = await axios.get(
				`${this.baseUrl}/hasPosted/${username}`,
			);
			console.log('hasPosted:', response.data);
			return response.data.hasPosted;
		} catch (error) {
			console.error('hasPostedError:', error);
			// In case of an error, set default value to true
			return true;
		}
	}

	/**
	 * Save notification token for a user
	 */
	public async saveNotificationToken(
		username: string,
		token: string,
	): Promise<void> {
		try {
			const response = await axios.post(
				`${this.baseUrl}/notificationToken/save`,
				{
					username,
					token,
				},
			);
			console.log('saveNotificationToken:', response.data);
		} catch (error) {
			console.error('saveNotificationTokenError:', error);
			throw error;
		}
	}

	/**************************************************************************
	 * @Home API calls
	 **************************************************************************/

	/**
	 * Fetch posts from friends
	 */
	public async fetchFriendsPosts(userToken: string): Promise<any> {
		try {
			const response = await axios.get(
				`${this.baseUrl}/api/post`,{ headers: {"Authorization" : `Bearer ${userToken}`}}
			);
			return response.data["results"];
		} catch (error) {
			console.error('fetchFriendsPostsError:', error);
			throw error;
		}
	}

	/**
	 * Fetch public posts
	 */
	public async fetchPublicPosts(myUsername: string): Promise<any> {
		try {
			const response = await axios.get(
				`${this.baseUrl}/feed/fetch/public/${myUsername}`,
			);
			return response.data.posts;
		} catch (error) {
			console.error('fetchPublicPostsError:', error);
			throw error;
		}
	}

	/**
	 * Update post like status
	 */
	public async updatePostLike(
		profileUsername: string,
		postID: string,
		myUsername: string,
		status: boolean,
	): Promise<void> {
		try {
			const response = await axios.post(`${this.baseUrl}/post/like`, {
				profileUsername,
				postID,
				myUsername,
				status,
			});

			console.log('updatePostLiked:', response.data);

			// Handle other actions, e.g., sending notifications
			if (status) {
				const notificationTokens =
					await this.fetchUserNotificationTokens(profileUsername);
				const notifications = notificationTokens.tokens.map(
					(token) => ({
						to: token,
						sound: 'default',
						title: `${myUsername} liked your post.`,
						body: 'Check it out!',
						data: {
							path: `/profile/post/${profileUsername}/${postID}`,
						},
					}),
				);

				await this.sendNotifications(notifications);
			}
		} catch (error) {
			console.error('updatePostLikeError:', error);
			throw error;
		}
	}

	/**
	 * Fetch comments for a post
	 */
	public async fetchPostComments(
		profileUsername: string,
		postID: string,
	): Promise<any> {
		try {
			const response = await axios.post(
				`${this.baseUrl}/post/fetch/comments`,
				{
					profileUsername,
					postID,
				},
			);

			return response.data.comments;
		} catch (error) {
			console.error('fetchPostCommentsError:', error);
			throw error;
		}
	}

	/**
	 * Fetch likes for a post
	 */
	public async fetchPostLikes(
		profileUsername: string,
		postID: string,
		myUsername: string,
	): Promise<any> {
		try {
			const response = await axios.post(
				`${this.baseUrl}/post/fetch/likes`,
				{
					profileUsername,
					postID,
					myUsername,
				},
			);

			return {
				likes: response.data.likes,
				liked: response.data.liked,
			};
		} catch (error) {
			console.error('fetchPostLikesError:', error);
			throw error;
		}
	}

	/**
	 * Fetch media for a post
	 */
	public async fetchPostMedia(
		profileUsername: string,
		postID: string,
		type?: string,
	): Promise<string> {
		try {
			const fileUri = `${FileSystem.documentDirectory}${profileUsername}_${postID}.${type === 'video' ? 'mp4' : 'jpeg'}`;

			const { exists } = await FileSystem.getInfoAsync(fileUri);

			if (exists) {
				const base64String = await FileSystem.readAsStringAsync(
					fileUri,
					{
						encoding: FileSystem.EncodingType.Base64,
					},
				);
				return base64String;
			}

			const response = await axios.get(
				`${this.baseUrl}/post/fetch/media/${profileUsername}/${postID}`,
			);
			const media = response.data.media;

			// write to file system
			await FileSystem.writeAsStringAsync(fileUri, media, {
				encoding: FileSystem.EncodingType.Base64,
			});

			return media;
		} catch (error) {
			console.error('fetchPostMediaError:', error);
			throw error;
		}
	}

	/**
	 * Fetch profile image
	 */
	public async fetchProfileImage(profileUsername: string): Promise<string> {
		try {
			const fileUri = `${FileSystem.documentDirectory}${profileUsername}_profile.jpeg`;

			const response = await axios.get(
				`${this.baseUrl}/post/fetch/${profileUsername}/profile/300/300`,
			);
			const profileImage = response.data.image;

			// write to file system
			await FileSystem.writeAsStringAsync(fileUri, profileImage, {
				encoding: FileSystem.EncodingType.Base64,
			});

			return profileImage;
		} catch (error) {
			console.error('fetchProfileImageError:', error);
			throw error;
		}
	}

	/**
	 * Fetch user notification tokens
	 */
	private async fetchUserNotificationTokens(
		profileUsername: string,
	): Promise<any> {
		try {
			const response = await axios.get(
				`${this.baseUrl}/notificationTokens/fetch/${profileUsername}`,
			);
			console.log('fetchUserNotificationTokens:', response.data);
			return response.data;
		} catch (error) {
			console.error('fetchUserNotificationTokensError:', error);
			throw error;
		}
	}

	/**
	 * Send push notifications
	 */
	private async sendNotifications(notifications: any[]): Promise<void> {
		try {
			const response = await axios.post(
				'https://exp.host/--/api/v2/push/send',
				notifications,
				{
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
				},
			);

			console.log('sendNotifications:', response.data);
		} catch (error) {
			console.error('sendNotificationsError:', error);
			throw error;
		}
	}

	/**************************************************************************
	 * @Leaderboard API calls
	 **************************************************************************/

	/**
	 * Fetch profile picture
	 */
	public async fetchProfilePicture(username: string): Promise<string> {
		try {
			const fileUri = `${FileSystem.documentDirectory}${username}_profile.jpeg`;

			const { exists } = await FileSystem.getInfoAsync(fileUri);

			if (exists) {
				const base64String = await FileSystem.readAsStringAsync(
					fileUri,
					{
						encoding: FileSystem.EncodingType.Base64,
					},
				);
				return base64String;
			}

			const response = await axios.get(
				`${this.baseUrl}/post/fetch/${username}/profile/300/300`,
			);
			const profilePicture = response.data.image;

			// write new pfp to file system
			await FileSystem.writeAsStringAsync(fileUri, profilePicture, {
				encoding: FileSystem.EncodingType.Base64,
			});

			console.log('fetchProfilePicture:', username);
			return profilePicture;
		} catch (error) {
			console.error('apiService fetchProfilePictureError:', error);
			throw error;
		}
	}

	/**
	 * Fetch leaderboard
	 */
	public async fetchLeaderboard(
		leaderboardMetric: string,
		myUsername: string,
		isFriendsFeed: boolean,
		limit: number,
	): Promise<any[]> {
		try {
			const feedType = isFriendsFeed ? 'friends' : 'public';

			const response = await axios.post(
				`${this.baseUrl}/leaderboard/${leaderboardMetric}`,
				{
					username: myUsername,
					feedType,
					limit,
				},
			);

			console.log(
				'fetchLeaderboardConsistency:',
				response.data.leaderboard.length,
			);
			return response.data.leaderboard;
		} catch (error) {
			console.error('fetchLeaderboardConsistencyError:', error);
			throw error;
		}
	}

	/**************************************************************************
	 * @Search API calls
	 **************************************************************************/

	/**
	 * Search for profiles by username
	 */
	public async searchByUsername(
		profileUsername: string,
		relationship: string,
		keyword?: string,
	): Promise<any[]> {
		try {
			let url = `${this.baseUrl}/users/fetch/${profileUsername}/${relationship}`;

			if (keyword) {
				url += `/${keyword}`;
			}

			const response = await axios.get(url);

			console.log('search:', response.data.profiles.length);
			return response.data.profiles;
		} catch (error) {
			console.error('searchError:', error);
			throw error;
		}
	}

	/**************************************************************************
	 * @Profile API calls
	 **************************************************************************/

	/**
	 * Remove notification token for a user
	 */
	public async removeNotificationToken(
		myUsername: string,
		token: string,
	): Promise<void> {
		try {
			const response = await axios.post(
				`${this.baseUrl}/notificationToken/remove`,
				{
					username: myUsername,
					token: token,
				},
			);

			console.log('removeNotificationToken:', response.data);
		} catch (error) {
			console.error('removeNotificationTokenError:', error);
			throw error;
		}
	}

	/**
	 * Set follow status for a user
	 */
	public async setFollowStatus(
		following: boolean,
		profileUsername: string,
		myUsername: string,
	): Promise<void> {
		try {
			const response = await axios.post(`${this.baseUrl}/user/follow`, {
				following: !following,
				recievingUser: profileUsername,
				sendingUser: myUsername,
			});

			console.log('setFollowStatus:', response.data);
			// Update user info and other states accordingly
			// ...
		} catch (error) {
			console.error('setFollowStatusError:', error);
			throw error;
		}
	}

	/**
	 * Add challenge notification for a user
	 */
	public async addChallengeNotification(
		profileUsername: string,
		myUsername: string,
		challengeText: string,
	): Promise<void> {
		try {
			const response = await axios.post(
				`${this.baseUrl}/notifications/addChallenge`,
				{
					recievingUser: profileUsername,
					sendingUser: myUsername,
					challenge: challengeText,
				},
			);

			console.log('addChallengeNotification:', response.data);
			// Fetch user's notification tokens and perform other actions
			// ...
		} catch (error) {
			console.error('addChallengeNotificationError:', error);
			throw error;
		}
	}

	/**************************************************************************
	 * @ProfileEdit API calls
	 **************************************************************************/

	/**
	 * Fetch user profile
	 */
	public async fetchUserProfile(profileUsername: string): Promise<void> {
		try {
			const response = await axios.get(
				`${this.baseUrl}/user/fetch/${profileUsername}/${profileUsername}/True`,
			);

			console.log('fetchUserProfile:', response.data.name);
			// Set the states accordingly (e.g., setName, setBio, setOldProfileImage, setLoading)
			// ...
		} catch (error) {
			console.error('fetchUserProfileError:', error);
			throw error;
		}
	}

	/**
	 * Update user profile
	 */
	public async updateProfile(
		formData: FormData,
		newProfileImage: string | null,
	): Promise<void> {
		try {
			const response = await axios.post(
				`${this.baseUrl}/user/update`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				},
			);

			console.log('updateProfile:', response.data);
			if (newProfileImage) {
				// Set the storage profile picture and perform other actions
				// ...
			}
		} catch (error) {
			console.error('updateProfileError:', error);
			throw error;
		}
	}

	/**************************************************************************
	 * @ProfilePlan API calls
	 **************************************************************************/

	/**
	 * Fetch user's plan
	 */
	public async fetchProfilePlan(
		profileUsername: string,
		planID: string,
	): Promise<void> {
		try {
			const response = await axios.get(
				`${this.baseUrl}/plans/fetch/${profileUsername}/${planID}/${300}/${300}`,
			);

			console.log('fetchProfilePlan:', profileUsername, planID);
			// Set the states accordingly (e.g., setPlanData, setLoading)
			// For example:
			// setPlanData(response.data);
			// setLoading(false);
		} catch (error) {
			console.error('fetchProfilePlanError:', error);
			throw error;
		}
	}

	/**************************************************************************
	 * @ProfilePost API calls
	 **************************************************************************/
	public async likePost(
		profileUsername: string,
		postID: string,
		myUsername: string,
		status: boolean,
	): Promise<void> {
		try {
			const response = await axios.post(`${this.baseUrl}/post/like`, {
				profileUsername: profileUsername,
				postID: postID,
				myUsername: myUsername,
				status: status,
			});

			console.log('likePost:', response.data);
			// Set the likes state accordingly (e.g., setLikes)
			// For example:
			// setLikes(response.data.likes);
		} catch (error) {
			console.error('likePostError:', error);
			throw error;
		}
	}

	public async addComment(
		profileUsername: string,
		postID: string,
		myUsername: string,
		content: string,
	): Promise<void> {
		try {
			const response = await axios.post(`${this.baseUrl}/post/comment`, {
				profileUsername: profileUsername,
				postID: postID,
				myUsername: myUsername,
				content: content,
			});

			console.log('addComment:', response.data);
			// Set the comments state accordingly (e.g., setComments)
			// For example:
			// setComments(response.data.comments);
		} catch (error) {
			console.error('addCommentError:', error);
			throw error;
		}
	}

	public async fetchCommentProfileImage(
		username: string,
		fileUri: string,
		imageSize: string,
	): Promise<void> {
		try {
			const response = await axios.get(
				`${this.baseUrl}/post/fetch/${username}/profile/${imageSize}`,
			);

			console.log('fetchCommentProfileImage:', response.data);
			// Set the comment profile images state accordingly (e.g., setCommentProfileImages)
			// For example:
		} catch (error) {
			console.error('fetchCommentProfileImageError:', error);
			throw error;
		}
	}

	/**************************************************************************
	 * @ProfileConnectedPlan API calls
	 **************************************************************************/
	public async fetchUserPlans(profileUsername: string): Promise<void> {
		try {
			const response = await axios.get(
				`${this.baseUrl}/plans/fetch/${profileUsername}`,
			);

			console.log('fetchUserPlans:', response.data);
			// Set the plans state accordingly (e.g., setPlans)
			// For example:
			// setPlans(response.data.plans);
		} catch (error) {
			console.error('fetchUserPlansError:', error);
			throw error;
		}
	}

	/**************************************************************************
	 * @ProfileConnectedPosts API calls
	 **************************************************************************/
	public async fetchConnectedPosts(profileUsername: string): Promise<void> {
		try {
			const response = await axios.get(
				`${this.baseUrl}/user/fetch/posts/${profileUsername}`,
			);
			// console.log('FETCH POSTS: => ', response?.data);
			// Assuming these state variables are part of your class
			// Set posts and post previews accordingly
			// this.setPosts(response?.data.posts);
			// this.setPostPreviews(response?.data?.posts.map(() => true));
		} catch (error) {
			console.log('fetchConnectedPostsError', error);
			// Assuming isError and setLoadedPosts are part of your class
			// this.setIsError(true);
		}
	}

	/**************************************************************************
	 * @ProfileConnectedStatsList API calls
	 **************************************************************************/
	public async fetchConnectedStatsList(
		profileUsername: string,
		myUsername: string,
	): Promise<void> {
		try {
			const response = await axios.get(
				`${this.baseUrl}/user/fetch/${profileUsername}/${myUsername}/False`,
			);
			console.log('FETCH CONNECTED STATS LIST: => ', response?.data);
			// Assuming you want to do something with the response
			// For example, set it in state if it's part of your class
			// this.setConnectedStatsList(response?.data);
		} catch (error) {
			console.log('fetchConnectedStatsListError', error);
			// Assuming isError is part of your class
			// this.setIsError(true);
		}
	}

	/**************************************************************************
	 * @ProfileConnectedBody API calls
	 **************************************************************************/
	public async fetchConnectedBody(profileUsername: string): Promise<void> {
		try {
			const response = await axios.get(
				`${this.baseUrl}/plans/fetch/${profileUsername}`,
			);
			console.log('FETCH CONNECTED BODY: => ', response?.data);
			// Assuming you want to do something with the response
			// For example, set it in state if it's part of your class
			// this.setConnectedBody(response?.data);
		} catch (error) {
			console.log('fetchConnectedBodyError', error);
			// Assuming isError is part of your class
			// this.setIsError(true);
		}
	}

	/**************************************************************************
	 * @CreatePost API calls
	 **************************************************************************/
	public async savePost(formData: FormData): Promise<void> {
		try {
			const response = await axios.post(
				`${this.baseUrl}/post/save`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				},
			);
			console.log('Post saved:', response.data);

			// Additional logic or state updates can be added here
		} catch (error) {
			console.log('sendPostError', error);

			// Additional error handling or state updates can be added here
		}
	}

	public async completeChallenge(
		myUsername: string,
		challengeUsername: string,
		challengeID: string,
	): Promise<void> {
		try {
			const response = await axios.post(
				`${this.baseUrl}/challenge/complete`,
				{
					recievingUser: myUsername,
					sendingUser: challengeUsername,
					challengeID: challengeID,
				},
			);
			console.log('Challenge completed:', response.data);

			// Additional logic or state updates can be added here
		} catch (error) {
			console.log('completeChallengeError', error);

			// Additional error handling or state updates can be added here
		}
	}

	/**************************************************************************
	 * @CreatePlan API calls
	 **************************************************************************/
	public async savePlan(
		formData: FormData,
		setLoading: (value: boolean) => void,
		navigate: (path: string) => void,
	): Promise<void> {
		try {
			const response = await axios.post(
				`${this.baseUrl}/plan/save`,
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				},
			);
			console.log('Plan saved:', response.data);

			// Additional logic or state updates can be added here
		} catch (error) {
			console.log('savePlanError', error);

			// Additional error handling or state updates can be added here
		}
	}
}
export default ApiService;

import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useOtherUserInfo } from '@context/other-user-info';
import { useThemeContext } from '@context/theme/useThemeContext';
import { Post, PostsApiResponse } from '@models/posts';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ProfilePosts } from './ProfilePosts';
import { useProfilePostsStyles } from './ProfilePosts.styles';
import { ConnectedProfilePostsProps } from './ProfilePosts.types';
import { PreviewFeedScreen } from './modals/PostPreviewModal';

/**
 * Connected ProfilePosts Component
 * Details:
 */
export const ConnectedProfilePosts: React.FC<ConnectedProfilePostsProps> = ({
	isMyProfile,
}) => (isMyProfile ? <MyProfilePosts /> : <OtherProfilePosts />);

const MyProfilePosts: React.FC = () => {
	const { username: myUsername } = useMyUserInfo();
	const ProfilePostsStyles = useProfilePostsStyles();
	const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
	const [loadedPosts, setLoadedPosts] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [posts, setPosts] = useState<Post[]>([]);

	const [refreshing, setRefreshing] = useState(false);
	const { theme } = useThemeContext();


	const handleScroll = (event: any) => {
		// media loading handling
		const yOffset = event.nativeEvent.contentOffset.y;
		const index = Math.round(yOffset / 200);
		setCurrentScrollIndex(index);
	};

	// TODO: API call should not timeout if the user has no posts
	// fetch all user's posts metadata
	const fetchUserPosts = async () => {
		setLoadedPosts(false);
		setPosts([]);
		 await axios
			.get<PostsApiResponse>(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetch/posts/${myUsername}`,
			)
			.then((response) => {
				console.log('FETCH POSTS: => ', response?.data);
				setPosts(response?.data.posts);
				// setPostPreviews(response?.data?.posts.map(() => true));
			})
			.catch((error) => {
				console.log('fetchMyposts', error);
				setIsError(true);
			})
			.finally(() => {
				setLoadedPosts(true);
			});
	}


	const onRefreshFeed = async () => {
		setRefreshing(true);
		await fetchUserPosts();
		setRefreshing(false);
	}


	useEffect(() => {
		fetchUserPosts();
	}, [myUsername]);

	return (

		<ProfilePosts
			posts={posts}
			currentScrollIndex={currentScrollIndex}
			isError={isError}
			isMyProfile={true}
			fetchUserPosts={onRefreshFeed}
		/>

	);
};

const OtherProfilePosts: React.FC = () => {
	const { username: profileUsername } = useOtherUserInfo();
	const ProfilePostsStyles = useProfilePostsStyles();
	const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
	const [loadedPosts, setLoadedPosts] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [posts, setPosts] = useState([]);
	const [postPreviews, setPostPreviews] = useState([]);
	const [refreshing, setRefreshing] = useState(false);

	const { theme } = useThemeContext();

	const handleScroll = (event: any) => {
		// media loading handling
		const yOffset = event.nativeEvent.contentOffset.y;
		const index = Math.round(yOffset / 200);
		setCurrentScrollIndex(index);
	};

	// TODO: API call should not timeout if the user has no posts
	// fetch all user's posts metadata
	const fetchUserPosts = async () => {
		setLoadedPosts(false);
		axios
			.get(
				`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/user/fetch/posts/${profileUsername}`,
			)
			.then((response) => {
				setPosts(response?.data.posts);
				setPostPreviews(response?.data?.posts.map(() => true));
			})
			.catch((error) => {
				console.log('fetchFriendsPostsError', error);
				setIsError(true);
			})
			.finally(() => {
				setLoadedPosts(true);
			});
	};

	useEffect(() => {
		fetchUserPosts();
	}, [profileUsername]);


	const onRefreshFeed = async () => {
		setRefreshing(true);
		await fetchUserPosts();
		setRefreshing(false);
	}



	return (
		<PreviewFeedScreen 
			posts={posts}
			currentScrollIndex={currentScrollIndex}
			isMyProfile={false}
			onClosePress={onRefreshFeed}
			isPreviewMode={false}
			fetchUserPosts={onRefreshFeed}

		/>
	);
};

import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useOtherUserInfo } from '@context/other-user-info';
import { Post, PostsApiResponse } from '@models/posts';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ProfilePosts } from './ProfilePosts';
import { ConnectedProfilePostsProps } from './ProfilePosts.types';

/**
 * Connected ProfilePosts Component
 * Details:
 */
export const ConnectedProfilePosts: React.FC<ConnectedProfilePostsProps> = ({
	isMyProfile,
}) => (isMyProfile ? <MyProfilePosts /> : <OtherProfilePosts />);

const MyProfilePosts: React.FC = () => {
	const { username: myUsername } = useMyUserInfo();
	const [loadedPosts, setLoadedPosts] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [posts, setPosts] = useState<Post[]>([]);


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
		await fetchUserPosts();
	}


	useEffect(() => {
		fetchUserPosts();
	}, [myUsername]);

	return (

		<ProfilePosts
			posts={posts}
			isError={isError}
			isMyProfile={true}
			fetchUserPosts={onRefreshFeed}
		/>

	);
};

const OtherProfilePosts: React.FC = () => {
	const { username: profileUsername } = useOtherUserInfo();
	const [loadedPosts, setLoadedPosts] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [posts, setPosts] = useState([]);


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
		await fetchUserPosts();
	}
	return (
		<ProfilePosts
			posts={posts}
			isError={isError}
			isMyProfile={false}
			fetchUserPosts={onRefreshFeed}
		/>
	);
};

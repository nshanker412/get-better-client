import { useProfileContext } from '@context/profile-context/useProfileContext';
import React, { useEffect } from 'react';
import { ProfilePosts } from './ProfilePosts';

/**
 * Connected ProfilePosts Component
 * Details:
*/


export const ConnectedProfilePosts: React.FC = () => {
	const { isMyProfile, onFetchPosts, posts, username } = useProfileContext();

	useEffect(() => {
		console.log("ConnectedProfilePosts: ", isMyProfile, username);
	}, [isMyProfile, username]);


	const onRefreshFeed = async () => {
		await onFetchPosts();
	}

	return (
		<ProfilePosts
			posts={posts}
			isMyProfile={isMyProfile}
			fetchUserPosts={onRefreshFeed}
		/>
	);
};




import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useOtherUserInfo } from '@context/other-user-info';
import React, { useCallback, useEffect } from 'react';
import { ApiLoadingState } from '../../../types/types';
import { ProfileHeader } from './ProfileHeader';
import {
	ConnectedProfileHeaderProps,
	MyProfileHeaderProps,
	OtherProfileHeaderProps,
} from './ProfileHeader.types';

/**
 * Connected ProfileHeader Component
 * Details:
 */
const MyProfileHeader: React.FC<MyProfileHeaderProps> = ({
	onOpenLogoutModal,
}) => {
	const { loadUserInfoState, username: myUsername, myData } = useMyUserInfo();

	return (
		<ProfileHeader
			isMyProfile={true}
			isLoading={loadUserInfoState === ApiLoadingState.Loading}
			userHandle={`@${myUsername}`}
			username={myUsername}
			bio={myData?.bio}
			onChallengePress={null}
			onMotivatePress={null}
			following={myData?.following}
			followers={myData?.followers}
			profileImage={myData?.profileImage}
			myUsername={myUsername}
			amIFollowing={false}
			onLogout={onOpenLogoutModal}
		/>
	);
};

const OtherUserProfileHeader: React.FC<OtherProfileHeaderProps> = ({
	onOpenChallengeModal,
}) => {
	const {
		loadUserInfoState,
		username: otherUsername,
		userData,
	} = useOtherUserInfo();

	const {
		username: myUsername,
		fetchIsFollowing,
		updateFollowStatus,
	} = useMyUserInfo();
	const [isFollowing, setIsFollowing] = React.useState<boolean | undefined>(
		undefined
	);
	const [isFollowingLoading, setIsFollowingLoading] = React.useState<boolean>(
		false
	);

	useEffect(() => {
		const fetchIsFollowingCb = async (otherUsername: string) => {
			setIsFollowingLoading(true);
			if (myUsername && otherUsername) {
				try {
					const isFollowing = await fetchIsFollowing(otherUsername);
				
					if (isFollowing !== undefined) {
						setIsFollowing(isFollowing);
					}

				} catch (e) {
					console.log('Error fetching isFollowing: ', e);
				}
			}
			setIsFollowingLoading(false);
			fetchIsFollowing
		}
		if (otherUsername) {
			fetchIsFollowingCb(otherUsername);
		}
	}, [otherUsername]);

	const onMotivatePressCb = useCallback((newFollowStatus: boolean) => {
		if (myUsername && otherUsername) {
			updateFollowStatus(otherUsername,newFollowStatus ? "follow" : "unfollow");
		}
	}, [myUsername, otherUsername]);

	return (
		<ProfileHeader
			isMyProfile={false}
			isLoading={isFollowingLoading}
			userHandle={`@${otherUsername}`}
			username={otherUsername}
			bio={userData?.bio}
			onOpenChallengeModal={onOpenChallengeModal}
			onMotivatePress={onMotivatePressCb}
			following={userData?.following}
			followers={userData?.followers}
			profileImage={userData?.profileImage}
			myUsername={otherUsername}
			amIFollowing={isFollowing}
			onLogout={null}
		/>
	);
};

export const ConnectedProfileHeader: React.FC<ConnectedProfileHeaderProps> = ({
	isMyProfile,
	onOpenLogoutModal,
	onOpenChallengeModal,
}) => {
	return isMyProfile ? (
		<MyProfileHeader onOpenLogoutModal={onOpenLogoutModal!} />
	) : (
		<OtherUserProfileHeader onOpenChallengeModal={onOpenChallengeModal!} />
	);
};

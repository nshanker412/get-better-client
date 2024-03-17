import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useOtherUserInfo } from '@context/other-user-info';
import React, { useCallback, useEffect } from 'react';
import { ApiLoadingState } from '../../../types/types';
import { MyProfileHeader } from './MyProfileHeader';
import { OtherProfileHeader } from './OtherProfileHeader';
import {
	ConnectedProfileHeaderProps,
	MyProfileHeaderConnectedProps,
	OtherProfileHeaderConnectedProps
} from './ProfileHeader.types';

/**
 * Connected ProfileHeader Component
 * Details:
 */
const MyProfileHeaderConnected: React.FC<MyProfileHeaderConnectedProps> = ({
	onOpenLogoutModal,
}) => {
	const { loadUserInfoState, username: myUsername, myData } = useMyUserInfo();

	return (
		<MyProfileHeader
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

const OtherUserProfileHeaderConnected: React.FC<OtherProfileHeaderConnectedProps> = ({
	onOpenChallengeModal,
}) => {
	const {
		loadUserInfoState,
		username: otherUsername,

		otherUserData,
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
		<OtherProfileHeader
			isLoading={loadUserInfoState === ApiLoadingState.Loading}
			userHandle={`@${otherUsername}`}
			username={otherUsername}
			bio={otherUserData?.bio}
			onOpenChallengeModal={onOpenChallengeModal}
			onMotivatePress={onMotivatePressCb}
			following={otherUserData?.following}
			followers={otherUserData?.followers}
			profileImage={otherUserData?.profileImage}
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
		<MyProfileHeaderConnected onOpenLogoutModal={onOpenLogoutModal!} />
	) : (
		<OtherUserProfileHeaderConnected onOpenChallengeModal={onOpenChallengeModal!} />
	);
};

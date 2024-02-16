import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useOtherUserInfo } from '@context/other-user-info';
import React from 'react';
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
		setFollowStatus: onMotivatePress,
	} = useOtherUserInfo();

	const { username: myUsername } = useMyUserInfo();

	const onMotivatePressCb = (): Promise<void>  => {
		return	onMotivatePress(myUsername!);
	};

	return (
		<ProfileHeader
			isMyProfile={false}
			isLoading={loadUserInfoState === ApiLoadingState.Loading}
			userHandle={`@${otherUsername}`}
			username={otherUsername}
			bio={userData?.bio}
			onOpenChallengeModal={onOpenChallengeModal}
			onMotivatePress={onMotivatePressCb}
			following={userData?.following}
			followers={userData?.followers}
			profileImage={userData?.profileImage}
			myUsername={otherUsername}
			amIFollowing={userData?.isFollowing}
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

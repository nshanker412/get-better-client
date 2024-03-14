import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { OtherUserInfoProvider } from '@context/other-user-info';
import { ProfileProvider } from '@context/profile-context/ProfileProvider';
import { useProfileContext } from '@context/profile-context/useProfileContext';
import { useRoute } from '@react-navigation/native';
import React, { useEffect, useMemo } from 'react';
import { MyProfile } from './MyProfile';
import { OtherProfile } from './OtherProfile';


export const Profile: React.FC = () => {
	const route = useRoute();
	const { username: myUsername } = useMyUserInfo();
	const profileUsername = useMemo(() => route.params?.profileUsername, [route.params?.profileUsername]);
	const myProfile = useMemo(() => myUsername === profileUsername, [myUsername, profileUsername]);


	useEffect(() => {
		console.log("Profile: ", profileUsername);
		console.log("MyProfile: ", myProfile);
	}, [profileUsername, myProfile]);
	
		return (
			<OtherUserInfoProvider otherProfileUsername={profileUsername}>
				<ProfileProvider isMyProfile={myProfile}>
					<_Profile  />
				</ProfileProvider>
			</OtherUserInfoProvider>
		)
	
}

export const _Profile: React.FC = () => {

	const { isMyProfile } = useProfileContext();

	useEffect(() => {
		console.log("in child Profile: ", isMyProfile);
	}, [isMyProfile]);

	if (isMyProfile === undefined) {
		return null;
	}
	else if (isMyProfile === true) {
		return (
			<MyProfile/>
		)
	} else {
		return (
			<OtherProfile/>
		)
	}
	
};
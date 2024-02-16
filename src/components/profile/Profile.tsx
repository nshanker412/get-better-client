import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useRoute } from '@react-navigation/native';
import React from 'react';
import { MyProfile } from './MyProfile';
import { OtherProfile } from './OtherProfile';

export const Profile: React.FC = () => {
	const route = useRoute();

	const { username: myUsername } = useMyUserInfo();

	if (route.params?.profileUsername === myUsername) {
		return <MyProfile />;
	} else {
		return <OtherProfile />;
	}
};

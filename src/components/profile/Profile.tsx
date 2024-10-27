import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { OtherUserInfoProvider } from '@context/other-user-info';
import { ProfileProvider } from '@context/profile-context/ProfileProvider';
import { useProfileContext } from '@context/profile-context/useProfileContext';
import React, { useEffect } from 'react';
import { MyProfile } from './MyProfile';
import { OtherProfile } from './OtherProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const Profile: React.FC = ({route}) => {
	const { username: myUsername } = useMyUserInfo();
	

	useEffect(() => {
		const setAsyncStorage = async ()=>{
			await AsyncStorage.removeItem("InProfile")
			await AsyncStorage.setItem("InProfile",route?.params?.profileUsername)
		}
		setAsyncStorage()
		console.log("in Profile: ", route?.params?.profileUsername);
	}
	, [route]);


		return (
			<OtherUserInfoProvider otherProfileUsername={route?.params?.profileUsername}>
				<ProfileProvider
					isMyProfile={myUsername === route?.params?.profileUsername}
					profileUsername={route?.params?.profileUsername}>
					<_Profile  />
				</ProfileProvider>
			</OtherUserInfoProvider>
		)
	
}

export const _Profile: React.FC = () => {

	const { isMyProfile } = useProfileContext();


	if (isMyProfile === undefined) {
		return null;
	}
	else if (isMyProfile) {
		return (
			<MyProfile/>
		)
	} else {
		return (
			<OtherProfile/>
		)
	}
	
};
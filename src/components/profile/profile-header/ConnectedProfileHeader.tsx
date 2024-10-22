import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useOtherUserInfo } from '@context/other-user-info';
import { UserFollowProvider } from '@context/user-follow/UserFollowProvider';
import React, { useCallback, useEffect, useState } from 'react';
import { ApiLoadingState } from '../../../types/types';
import { MyProfileHeader } from './MyProfileHeader';
import { OtherProfileHeader } from './OtherProfileHeader';
import {
	ConnectedProfileHeaderProps,
	MyProfileHeaderConnectedProps,
	OtherProfileHeaderConnectedProps
} from './ProfileHeader.types';
import { useAuth } from '@context/auth/useAuth';
/**
 * Connected ProfileHeader Component
 * Details:
 */
const MyProfileHeaderConnected: React.FC<MyProfileHeaderConnectedProps> = ({
	onOpenLogoutModal,
}) => {
	const { loadUserInfoState, username: myUsername,myData } = useMyUserInfo();
	const {userToken} = useAuth();
	const [myDataLocal,setMyData] = useState(myData);
	useEffect(()=>{
		if(myData==undefined){
			if(userToken){
				fetch(`${process.env.EXPO_PUBLIC_SERVER_BASE_URL}/api/me`,{
					headers:{
						Authorization:`Bearer ${userToken}`
					}
				}).then(res=>res.json()).then(data=>{
					setMyData(data);
				})
			}
		}
	},[userToken])
	

	return (
		<UserFollowProvider key="username-Provider" username={ myUsername ?? undefined}>

		<MyProfileHeader
			isMyProfile={true}
			isLoading={loadUserInfoState === ApiLoadingState.Loading}
			userHandle={`@${myUsername}`}
			username={myUsername}
			bio={myDataLocal?.bio}
			id={myDataLocal?.id}
			profile_id={myDataLocal?.profile_id}
			onChallengePress={null}
			onMotivatePress={null}
			following={myDataLocal?.following}
			followers={myDataLocal?.followers}
			profileImage={myDataLocal?.profile_picture}
			myUsername={myUsername}
			amIFollowing={false}
			consistency={myDataLocal?.consistency}
			onLogout={onOpenLogoutModal}
			/>
		</UserFollowProvider>

	);
};

const OtherUserProfileHeaderConnected: React.FC<OtherProfileHeaderConnectedProps> = ({
	onOpenChallengeModal,
}) => {
	const {
		loadUserInfoState,
		username: otherUsername,
		setFollowStatus,
		otherUserData,
	} = useOtherUserInfo();

	const {
		username: myUsername,
		 myData,
		fetchIsFollowing,
		
	} = useMyUserInfo();

	const [isFollowingLoading, setIsFollowingLoading] = React.useState<boolean>(
		false
	);

	useEffect(() => {
		const fetchIsFollowingCb = async (otherUsername: string) => {
			setIsFollowingLoading(true);
			if (myUsername && otherUsername) {
				try {
					const isFollowing = await fetchIsFollowing(otherUsername);
				
					// if (isFollowing !== undefined) {
					// 	setIsFollowing(isFollowing);
					// }

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

	const onMotivatePressCb = useCallback(async() => {
		setIsFollowingLoading(true);
		await setFollowStatus();
		setIsFollowingLoading(false);
		
	}, [myUsername, otherUsername, myData?.isFollowing, setFollowStatus]);

	return (
		<UserFollowProvider key="other-profile-context" username={ otherUsername}>

		<OtherProfileHeader
				isLoading={loadUserInfoState === ApiLoadingState.Loading}
			userHandle={`@${otherUsername}`}
			username={otherUsername}
			bio={otherUserData?.bio}
			id={otherUserData?.id}
				onOpenChallengeModal={onOpenChallengeModal}
				consistency={otherUserData?.consistency}
			onMotivatePress={onMotivatePressCb}
			following={otherUserData?.following}
			followers={otherUserData?.followers}
			profileImage={otherUserData?.profileImage}
			myUsername={otherUsername}
			myId={""}
			amIFollowing={otherUserData?.isFollowing}
			onLogout={null}
			/>
			</UserFollowProvider>
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
		)
					
			
			

};

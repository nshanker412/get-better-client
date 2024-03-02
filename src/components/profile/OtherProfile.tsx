import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import {
	OtherUserInfoProvider,
	useOtherUserInfo,
} from '@context/other-user-info';
import { useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Host } from 'react-native-portalize';
import { ChallengeModal } from '../challenge-modal/ChallengeModal';
import { ConnectedProfileBody } from './profile-body/ConnectedProfileBody';
import { ConnectedProfileHeader } from './profile-header/ConnectedProfileHeader';
import { useProfileStyles } from './profile.styles';

const _OtherProfile: React.FC = () => {
	/** TODO
	 * 1. make challenge modal its own component
	 */
	const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
	const profileStyles = useProfileStyles();

	const { username: profileUsername } = useOtherUserInfo();
	// const profileUsername = useRoute()?.params?.profileUsername;

	const onCloseModalPress = () => {
		setIsChallengeModalOpen(false);
	};

	const onChallengePress = () => {
		setIsChallengeModalOpen(true);
	};

	return (
		<SafeAreaView style={profileStyles.safeAreaViewContainer}>
			<View style={profileStyles.profileContainer}>
				<View style={{ flex: 3 }}>
					<ConnectedProfileHeader
						onOpenChallengeModal={onChallengePress}
						isMyProfile={false}
					/>
				</View>
				<View style={{ flex: 7}}>
					<ConnectedProfileBody isMyProfile={false} username={profileUsername}  />
				</View>
			</View>

			<ChallengeModal
				isVisible={isChallengeModalOpen}
				challengee={profileUsername!}
				onClosePress={onCloseModalPress}
			/>
		</SafeAreaView>
	);
};

export const OtherProfile: React.FC = () => {
	const route = useRoute();
	const { username: myUsername } = useMyUserInfo();

	/** TODO
	 * 1. Add a loading screen here
	 */
	if (!route?.params?.profileUsername) return null;
	if (!myUsername) return null;
	return (
		<Host>
			<OtherUserInfoProvider
				otherProfileUsername={route.params.profileUsername}
				myUsername={myUsername}>
				<_OtherProfile />
			</OtherUserInfoProvider>
		</Host>
	);
};

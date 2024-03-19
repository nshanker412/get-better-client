import { useOtherUserInfo } from '@context/other-user-info';
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Host } from 'react-native-portalize';
import { ChallengeModal } from '../challenge-modal/ChallengeModal';
import { ConnectedProfileBody } from './profile-body/ConnectedProfileBody';
import { ConnectedProfileHeader } from './profile-header/ConnectedProfileHeader';
import { useProfileStyles } from './profile.styles';

 export const OtherProfile: React.FC = () => {
	/** TODO
	 * 1. make challenge modal its own component
	 */
	const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
	 const profileStyles = useProfileStyles();
	 const {username} = useOtherUserInfo();


	const onCloseModalPress = () => {
		setIsChallengeModalOpen(false);
	};

	const onChallengePress = () => {
		setIsChallengeModalOpen(true);
	};

	return (
		<Host>
			<SafeAreaView style={profileStyles.safeAreaViewContainer}>
				<View style={{  flexBasis:"auto",  flexDirection:"column", alignItems:"center", justifyContent:"flex-start", display:"flex" }}>
						<ConnectedProfileHeader
							username={username!}
							onOpenChallengeModal={onChallengePress}
							isMyProfile={false}
						/>
					<View style={{ flexBasis:"auto",  flexShrink: 1, flexGrow: 1}}>
						<ConnectedProfileBody isMyProfile={false} />
						</View>
				</View>

			</SafeAreaView>
			
			<ChallengeModal
					isVisible={isChallengeModalOpen}
					challengee={username!}
					onClosePress={onCloseModalPress}
				/>
			</Host>
	);
};

// export const OtherProfile = React.memo(_OtherProfile);

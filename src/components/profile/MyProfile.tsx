import { useAuth } from '@context/auth/useAuth';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useNotifications } from '@context/notifications/useNotifications';
import { useThemeContext } from '@context/theme/useThemeContext';
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
import { Host } from 'react-native-portalize';
import { ActionButton } from '../primitives/action-button/ActionButton';
import { Modal } from '../primitives/action-modal/ActionModal';
import { ConnectedProfileBody } from './profile-body/ConnectedProfileBody';
import { ConnectedProfileHeader } from './profile-header/ConnectedProfileHeader';
import { useProfileStyles } from './profile.styles';

const LogoutModal: React.FC<{
	isVisible: boolean;
	onClosePress: () => void;
	onLogoutPress: () => Promise<void>;
}> = ({ isVisible, onClosePress, onLogoutPress }) => {
	const { theme } = useThemeContext();
	const [loading, setLoading] = useState<boolean>(false);

	const onLogoutPressCb = async () => {
		setLoading(true);
		await onLogoutPress();
		setLoading(false);
	};

	return (
		<Modal
			isVisible={isVisible}
			hasBackdrop
			animateOut='fadeOut'
			onBackdropPress={onClosePress}>
			<Modal.Container
				containerStyle={{
					backgroundColor: theme.innerContainer.backgroundColor,
				}}>
				<Modal.Header
					title='Are you sure you want to logout?'
					headerStyle={{ text: { ...theme.text.header } }}
				/>
				<Modal.Body bodyStyle={{ alignItems: 'center' }}>
					<View
						style={{
							flexDirection: 'row',
							alignItems: 'center',
							gap: 15,
						}}>
						<ActionButton
							isPrimary={true}
							styles={{ container: { padding: 10 } }}
							defaultPressed={false}
							title='Cancel'
							onPress={onClosePress}
						/>
						<ActionButton
							loading={loading}
							isPrimary={true}
							styles={{ container: { padding: 10 } }}
							defaultPressed={false}
							title='Logout'
							onPress={onLogoutPressCb}
						/>
					</View>
				</Modal.Body>
			</Modal.Container>
		</Modal>
	);
	};

export const MyProfile: React.FC = () => {
	const [logoutModalVisible, setLogoutModalVisible] =
		useState<boolean>(false); 
	const profileStyles = useProfileStyles();
	const { username: myUsername,  onLogout } = useMyUserInfo();
	const { removePushToken } = useNotifications();
	const { signOut } = useAuth();


	const onClosePress = () => {
		setLogoutModalVisible(false);
	};

	const onOpenLogoutModal = () => {
		setLogoutModalVisible(true);
	};

	const onLogoutPress = async (): Promise<void> => {
		try {
			await onLogout();
			await removePushToken();
			await signOut();
		} catch (error) {
			console.error('Error logging out:', error);
		} finally {
		
			 onClosePress();
		}
	};

	return (
		<Host>
			<SafeAreaView style={profileStyles.safeAreaViewContainer}>
			<View style={{  flexBasis:"auto",  flexDirection:"column", alignItems:"center", justifyContent:"flex-start", display:"flex" }}>


						<ConnectedProfileHeader
						username={myUsername!}
						isMyProfile={true}
						onOpenLogoutModal={onOpenLogoutModal}
					/>
			<View style={{ flexBasis:"auto",  flexShrink: 1, flexGrow: 1}}>
				</View>
					<ConnectedProfileBody
						isMyProfile={true}
					/>
			</View>

			<LogoutModal
				isVisible={logoutModalVisible}
				onClosePress={onClosePress}
				onLogoutPress={onLogoutPress}
			/>
			</SafeAreaView>
			</Host>
	);
};

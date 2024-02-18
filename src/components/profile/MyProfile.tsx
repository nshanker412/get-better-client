import { useAuth } from '@context/auth/useAuth';
import { useMyUserInfo } from '@context/my-user-info/useMyUserInfo';
import { useThemeContext } from '@context/theme/useThemeContext';
import React, { useState } from 'react';
import { SafeAreaView, View } from 'react-native';
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
		useState<boolean>(false); // Set initial state to false
	
	const profileStyles = useProfileStyles();

	const { onLogout } = useMyUserInfo();
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
		} catch (error) {
			console.error('Error logging out:', error);
		} finally {
			await signOut();
			setLogoutModalVisible(false);
		}
	};

	return (
		<SafeAreaView style={profileStyles.safeAreaViewContainer}>
			<View style={profileStyles.profileContainer}>
				<View style={{ flex: 4 }}>
					<ConnectedProfileHeader
						isMyProfile={true}
						onOpenLogoutModal={onOpenLogoutModal}
					/>
				</View>
				<View style={{ flex: 7 }}>
					<ConnectedProfileBody isMyProfile={true} />
				</View>
			</View>
			<LogoutModal
				isVisible={logoutModalVisible}
				onClosePress={onClosePress}
				onLogoutPress={onLogoutPress}
			/>
		</SafeAreaView>
	);
};

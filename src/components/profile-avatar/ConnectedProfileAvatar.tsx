import { useNavigation } from '@react-navigation/native';
import { ImageErrorEventData } from 'expo-image';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ProfileAvatar } from './ProfileAvatar';
import { ConnectedProfileAvatarProps } from './ProfileAvatar.types';
import useProfileImage from './hooks/useProfileImage';

/**
 * Connected ProfileAvatar Component
 * Details:
 */
export const ConnectedProfileAvatar: React.FC<ConnectedProfileAvatarProps> = ({
	overrideImage,
	disableLink=false,
	username,
	fetchSize = 200,
	size = 40,
	priority = 'normal',
	onNavigateToProfile,
}) => {
	const {hasProfileImage, profileImage } = useProfileImage(username, fetchSize);

	const navigation = useNavigation();


	const onErrorCallback = (event: ImageErrorEventData) => {
		console.log(event.error);
	
	};

	const onPressCallback = () => {
		if (onNavigateToProfile) {
			onNavigateToProfile();
		} else {
			navigation.navigate('profile', { profileUsername: username });
		}
	};

	return (
		<TouchableOpacity
			activeOpacity={0.9}
			disabled={disableLink}
			onPress={onPressCallback}
			style={{
				width: size,
				height: size,
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			<ProfileAvatar
				key={username}
				username={username}
				size={size}
				onError={onErrorCallback}
				imgSrc={overrideImage??profileImage}
				hasProfileImage={hasProfileImage}
				priority={priority}
			/>
		</TouchableOpacity>
	);
};
